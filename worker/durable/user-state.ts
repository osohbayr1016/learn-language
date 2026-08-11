import { DurableObject } from 'cloudflare:workers'

/**
 * One Durable Object per learner.
 *
 * Why this needs to be a DO and not just D1: a learner reviews on their phone
 * on the train (offline), then opens the laptop. Both devices push an op-log
 * of reviews. Merging those correctly means read-modify-write on the same card
 * rows, and D1 has no interactive transactions — two concurrent syncs would
 * interleave and lose reviews. A DO gives us single-threaded execution per
 * user, so the merge is trivially correct.
 *
 * Storage is the SQLite-backed DO API, which is the variant available on the
 * Workers free plan.
 */
export class UserStateDO extends DurableObject<Env> {
  private readonly sql: SqlStorage

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.sql = ctx.storage.sql
    // blockConcurrencyWhile guarantees no request observes a half-migrated DB.
    ctx.blockConcurrencyWhile(async () => {
      this.migrate()
    })
  }

  private migrate(): void {
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS card (
        card_id      TEXT PRIMARY KEY,
        item_type    TEXT NOT NULL,
        item_id      TEXT NOT NULL,
        mode         TEXT NOT NULL,
        due_ms       INTEGER NOT NULL,
        stability    REAL    NOT NULL DEFAULT 0,
        difficulty   REAL    NOT NULL DEFAULT 0,
        elapsed_days REAL    NOT NULL DEFAULT 0,
        scheduled_days REAL  NOT NULL DEFAULT 0,
        reps         INTEGER NOT NULL DEFAULT 0,
        lapses       INTEGER NOT NULL DEFAULT 0,
        state        INTEGER NOT NULL DEFAULT 0,
        last_review_ms INTEGER,
        updated_ms   INTEGER NOT NULL
      );

      -- The review queue is always "cards due before now, soonest first".
      CREATE INDEX IF NOT EXISTS card_due ON card (due_ms);

      -- Append-only log of every review, so a device that has been offline can
      -- ask "what changed since cursor N" rather than re-downloading state.
      CREATE TABLE IF NOT EXISTS op (
        seq        INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id  TEXT NOT NULL,
        -- Client-generated id; makes replaying a retried batch idempotent.
        op_id      TEXT NOT NULL UNIQUE,
        kind       TEXT NOT NULL,
        payload    TEXT NOT NULL,
        created_ms INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS meta (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `)
  }

  /** Cursor a client should send on its next pull. */
  latestSeq(): number {
    const row = this.sql.exec<{ seq: number | null }>('SELECT MAX(seq) AS seq FROM op').one()
    return row.seq ?? 0
  }

  /** Cards whose next review has come due. */
  dueCards(nowMs: number, limit: number): unknown[] {
    return this.sql
      .exec('SELECT * FROM card WHERE due_ms <= ? ORDER BY due_ms ASC LIMIT ?', nowMs, limit)
      .toArray()
  }

  /** Ops a client has not seen yet. */
  opsSince(cursor: number, limit: number): unknown[] {
    return this.sql
      .exec('SELECT * FROM op WHERE seq > ? ORDER BY seq ASC LIMIT ?', cursor, limit)
      .toArray()
  }
}
