/**
 * lang-ko — нийтийн API / public API
 * ---------------------------------------------------------------------------
 * Апп энэ модулиар дамжуулан солонгос хэлний контентод хандана.
 * Контент нь түвшин тус бүрээр залхуу (lazy) ачаалагддаг тул эхлэгч сурагч
 * L5, L6-ийн өгөгдлийг татаж авахгүй.
 *
 * tsconfig шаардлага: `"resolveJsonModule": true`, `"module": "ESNext"`.
 */

import type {
  Batchim,
  Curriculum,
  Dialogue,
  GrammarPoint,
  HanjaMorpheme,
  Jamo,
  Level,
  LevelId,
  Reading,
  SoundChange,
  Unit,
  UnitId,
  VocabDomain,
  VocabEntry,
} from './schema'

export * from './schema'

/* -------------------------------------------------------------------------- */
/* Ачаалагч / loaders                                                          */
/* -------------------------------------------------------------------------- */

type Envelope<T> = { version: number; levelId?: LevelId; items: T[] }

const cache = new Map<string, unknown>()

async function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, await load())
  return cache.get(key) as T
}

const LEVEL_IDS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const

/** Түвшний өгөгдлийн статик зураглал — bundler-т ойлгомжтой байхын тулд гараар. */
const GRAMMAR = {
  L0: () => import('../content/grammar/grammar-L0.json'),
  L1: () => import('../content/grammar/grammar-L1.json'),
  L2: () => import('../content/grammar/grammar-L2.json'),
  L3: () => import('../content/grammar/grammar-L3.json'),
  L4: () => import('../content/grammar/grammar-L4.json'),
  L5: () => import('../content/grammar/grammar-L5.json'),
  L6: () => import('../content/grammar/grammar-L6.json'),
} as const

const VOCAB = {
  L0: () => import('../content/vocab/vocab-L0.json'),
  L1: () => import('../content/vocab/vocab-L1.json'),
  L2: () => import('../content/vocab/vocab-L2.json'),
  L3: () => import('../content/vocab/vocab-L3.json'),
  L4: () => import('../content/vocab/vocab-L4.json'),
  L5: () => import('../content/vocab/vocab-L5.json'),
  L6: () => import('../content/vocab/vocab-L6.json'),
} as const

const DIALOGUES = {
  L0: () => import('../content/dialogues/dialogues-L0.json'),
  L1: () => import('../content/dialogues/dialogues-L1.json'),
  L2: () => import('../content/dialogues/dialogues-L2.json'),
  L3: () => import('../content/dialogues/dialogues-L3.json'),
  L4: () => import('../content/dialogues/dialogues-L4.json'),
  L5: () => import('../content/dialogues/dialogues-L5.json'),
  L6: () => import('../content/dialogues/dialogues-L6.json'),
} as const

const READINGS = {
  L0: () => import('../content/readings/readings-L0.json'),
  L1: () => import('../content/readings/readings-L1.json'),
  L2: () => import('../content/readings/readings-L2.json'),
  L3: () => import('../content/readings/readings-L3.json'),
  L4: () => import('../content/readings/readings-L4.json'),
  L5: () => import('../content/readings/readings-L5.json'),
  L6: () => import('../content/readings/readings-L6.json'),
} as const

const pick = async <T>(key: string, loader: () => Promise<unknown>): Promise<T[]> =>
  once(key, async () => ((await loader()) as { default: Envelope<T> }).default.items ?? [])

/* -------------------------------------------------------------------------- */
/* Сургалтын хөтөлбөр / curriculum                                             */
/* -------------------------------------------------------------------------- */

export const getCurriculum = (): Promise<Curriculum> =>
  once('curriculum', async () => (await import('../content/curriculum/curriculum.json')).default as unknown as Curriculum)

export async function getLevels(): Promise<Level[]> {
  return (await getCurriculum()).levels
}

export async function getLevel(id: LevelId): Promise<Level | undefined> {
  return (await getLevels()).find((l) => l.id === id)
}

export async function getUnits(levelId?: LevelId): Promise<Unit[]> {
  const units = (await getCurriculum()).units
  const list = levelId ? units.filter((u) => u.levelId === levelId) : units
  return [...list].sort((a, b) => (a.levelId === b.levelId ? a.order - b.order : a.levelId.localeCompare(b.levelId)))
}

export async function getUnit(id: UnitId): Promise<Unit | undefined> {
  return (await getCurriculum()).units.find((u) => u.id === id)
}

/* -------------------------------------------------------------------------- */
/* Хангыл / hangul                                                             */
/* -------------------------------------------------------------------------- */

export const getJamo = (): Promise<Jamo[]> => pick('jamo', () => import('../content/hangul/jamo.json'))
export const getBatchim = (): Promise<Batchim[]> => pick('batchim', () => import('../content/hangul/batchim.json'))
export const getSoundChanges = (): Promise<SoundChange[]> =>
  pick('sound-changes', () => import('../content/hangul/sound-changes.json'))

/** Хангылын бүх өгөгдөл — эхний түвшний хичээлүүдэд хэрэгтэй. */
export async function getHangul() {
  const [jamo, batchim, soundChanges] = await Promise.all([getJamo(), getBatchim(), getSoundChanges()])
  return { jamo, batchim, soundChanges }
}

/** 한글 үеийг 초성/중성/종성 болгон задлах (Unicode задаргаа). */
export function decomposeSyllable(ch: string): { initial: string; medial: string; final: string } | null {
  const code = ch.codePointAt(0)
  if (code == null || code < 0xac00 || code > 0xd7a3) return null
  const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
  const MEDIALS = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
  const FINALS = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ']
  const i = code - 0xac00
  return {
    initial: INITIALS[Math.floor(i / 588)],
    medial: MEDIALS[Math.floor((i % 588) / 28)],
    final: FINALS[i % 28] as string,
  }
}

/* -------------------------------------------------------------------------- */
/* Дүрэм ба үгийн сан / grammar & vocabulary                                   */
/* -------------------------------------------------------------------------- */

export const getGrammar = (levelId: LevelId): Promise<GrammarPoint[]> =>
  pick(`grammar:${levelId}`, GRAMMAR[levelId])

export const getVocab = (levelId: LevelId): Promise<VocabEntry[]> => pick(`vocab:${levelId}`, VOCAB[levelId])

export const getDomains = (): Promise<VocabDomain[]> => pick('domains', () => import('../content/vocab/domains.json'))

export const getHanja = (): Promise<HanjaMorpheme[]> => pick('hanja', () => import('../content/hanja/hanja.json'))

export const getDialogues = (levelId: LevelId): Promise<Dialogue[]> =>
  pick(`dialogues:${levelId}`, DIALOGUES[levelId])

export const getReadings = (levelId: LevelId): Promise<Reading[]> => pick(`readings:${levelId}`, READINGS[levelId])

/** Тухайн түвшин ба түүнээс өмнөх бүх түвшний контент (давтлага, хайлтад). */
export async function getUpTo<T>(levelId: LevelId, fn: (l: LevelId) => Promise<T[]>): Promise<T[]> {
  const upto = LEVEL_IDS.slice(0, LEVEL_IDS.indexOf(levelId) + 1)
  return (await Promise.all(upto.map(fn))).flat()
}

/* -------------------------------------------------------------------------- */
/* Хичээлийн багц / lesson bundle                                              */
/* -------------------------------------------------------------------------- */

export interface UnitBundle {
  unit: Unit
  level: Level
  grammar: GrammarPoint[]
  vocab: VocabEntry[]
  dialogues: Dialogue[]
  readings: Reading[]
  hanja: HanjaMorpheme[]
}

/** Нэг хичээлийн хуудсанд хэрэгтэй бүх контентыг нэг дуудлагаар. */
export async function getUnitBundle(unitId: UnitId): Promise<UnitBundle | null> {
  const unit = await getUnit(unitId)
  if (!unit) return null
  const level = await getLevel(unit.levelId)
  if (!level) return null
  const [grammar, vocab, dialogues, readings, hanja] = await Promise.all([
    getGrammar(unit.levelId),
    getVocab(unit.levelId),
    getDialogues(unit.levelId),
    getReadings(unit.levelId),
    getHanja(),
  ])
  return {
    unit,
    level,
    grammar: grammar.filter((g) => g.unitId === unitId).sort((a, b) => a.order - b.order),
    vocab: vocab.filter((v) => v.unitId === unitId),
    dialogues: dialogues.filter((d) => d.unitId === unitId),
    readings: readings.filter((r) => r.unitId === unitId),
    hanja: hanja.filter((h) => h.levelId === unit.levelId),
  }
}

/* -------------------------------------------------------------------------- */
/* Хайлт / search                                                              */
/* -------------------------------------------------------------------------- */

export interface VocabSearchHit {
  entry: VocabEntry
  matched: 'ko' | 'rom' | 'mn' | 'en' | 'hanja'
}

/** Солонгос, латин галиг, монгол болон англи утгаар хайх. */
export async function searchVocab(query: string, maxLevel: LevelId = 'L6', limit = 50): Promise<VocabSearchHit[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const all = await getUpTo(maxLevel, getVocab)
  const hits: VocabSearchHit[] = []
  for (const entry of all) {
    let matched: VocabSearchHit['matched'] | null = null
    if (entry.ko.includes(q)) matched = 'ko'
    else if (entry.rom.toLowerCase().includes(q)) matched = 'rom'
    else if (entry.mn.some((m) => m.toLowerCase().includes(q))) matched = 'mn'
    else if (entry.en.some((e) => e.toLowerCase().includes(q))) matched = 'en'
    else if (entry.hanja?.includes(query)) matched = 'hanja'
    if (matched) hits.push({ entry, matched })
    if (hits.length >= limit) break
  }
  return hits
}

/** Дүрмийг солонгос хэлбэр эсвэл монгол утгаар хайх. */
export async function searchGrammar(query: string, maxLevel: LevelId = 'L6'): Promise<GrammarPoint[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const all = await getUpTo(maxLevel, getGrammar)
  return all.filter(
    (g) =>
      g.form.includes(q) ||
      g.variants.some((v) => v.includes(q)) ||
      g.rom.toLowerCase().includes(q) ||
      g.meaning.mn.toLowerCase().includes(q),
  )
}

/* -------------------------------------------------------------------------- */
/* Ахиц ба нээлт / progress gating                                             */
/* -------------------------------------------------------------------------- */

/** Урьдчилсан нөхцөл бүрэн биелсэн эсэх. */
export function isUnlocked(unit: Unit, completed: ReadonlySet<UnitId>): boolean {
  return unit.prerequisites.every((p) => completed.has(p))
}

/** Дараагийн санал болгох хичээл. */
export async function nextUnit(completed: ReadonlySet<UnitId>): Promise<Unit | null> {
  const units = await getUnits()
  return units.find((u) => !completed.has(u.id) && isUnlocked(u, completed)) ?? null
}

/** Түвшний гүйцэтгэлийн хувь. */
export async function levelProgress(levelId: LevelId, completed: ReadonlySet<UnitId>) {
  const units = await getUnits(levelId)
  const done = units.filter((u) => completed.has(u.id)).length
  return { done, total: units.length, ratio: units.length ? done / units.length : 0 }
}

/* -------------------------------------------------------------------------- */
/* SRS картууд / spaced repetition seeds (ts-fsrs)                             */
/* -------------------------------------------------------------------------- */

export type SrsCardKind = 'vocab-recall' | 'vocab-recognise' | 'grammar' | 'hanja' | 'sentence' | 'jamo'

export interface SrsSeed {
  /** Тогтвортой түлхүүр — хэрэглэгчийн давталтын түүхтэй холбогдоно. */
  key: string
  kind: SrsCardKind
  /** Урд тал (асуулт). */
  front: string
  /** Ар тал (хариулт). */
  back: string
  hint?: string
  levelId: LevelId
  unitId: UnitId
  sourceId: string
  audioKey?: string
}

/** Нэг хичээлээс SRS-ийн карт үүсгэх. `ts-fsrs`-т дамжуулахад бэлэн. */
export async function buildSrsSeeds(unitId: UnitId): Promise<SrsSeed[]> {
  const bundle = await getUnitBundle(unitId)
  if (!bundle) return []
  const seeds: SrsSeed[] = []

  for (const v of bundle.vocab) {
    const common = { levelId: v.levelId, unitId: v.unitId, sourceId: v.id, audioKey: v.audioKey }
    // Таних (унших) — уншиж ойлгох чадварт хамгийн чухал
    seeds.push({ key: `${v.id}:recognise`, kind: 'vocab-recognise', front: v.ko, back: v.mn.join(', '), hint: v.rom, ...common })
    // Сануулах (гаргах)
    seeds.push({ key: `${v.id}:recall`, kind: 'vocab-recall', front: v.mn.join(', '), back: v.ko, hint: v.pos, ...common })
  }

  for (const g of bundle.grammar) {
    seeds.push({
      key: `${g.id}:grammar`,
      kind: 'grammar',
      front: g.form,
      back: g.meaning.mn,
      hint: g.examples[0]?.ko,
      levelId: g.levelId,
      unitId: g.unitId,
      sourceId: g.id,
    })
    const ex = g.examples[0]
    if (ex) {
      seeds.push({
        key: `${g.id}:sentence`,
        kind: 'sentence',
        front: ex.mn,
        back: ex.ko,
        hint: g.form,
        levelId: g.levelId,
        unitId: g.unitId,
        sourceId: g.id,
      })
    }
  }

  for (const h of bundle.hanja) {
    seeds.push({
      key: `${h.id}:hanja`,
      kind: 'hanja',
      front: h.char,
      back: `${h.reading} — ${h.meaningMn}`,
      hint: h.words[0]?.ko,
      levelId: h.levelId,
      unitId,
      sourceId: h.id,
    })
  }

  return seeds
}

/* -------------------------------------------------------------------------- */
/* Тоо баримт / stats                                                          */
/* -------------------------------------------------------------------------- */

export async function curriculumStats() {
  const { levels, units } = await getCurriculum()
  const perLevel = await Promise.all(
    levels.map(async (l) => {
      const [g, v] = await Promise.all([getGrammar(l.id), getVocab(l.id)])
      return {
        levelId: l.id,
        units: units.filter((u) => u.levelId === l.id).length,
        grammar: g.length,
        vocab: v.length,
        hours: l.targets.hours,
      }
    }),
  )
  return {
    perLevel,
    totals: perLevel.reduce(
      (a, l) => ({
        units: a.units + l.units,
        grammar: a.grammar + l.grammar,
        vocab: a.vocab + l.vocab,
        hours: a.hours + l.hours,
      }),
      { units: 0, grammar: 0, vocab: 0, hours: 0 },
    ),
  }
}
