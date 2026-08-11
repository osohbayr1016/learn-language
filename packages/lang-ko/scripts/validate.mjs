#!/usr/bin/env node
/**
 * lang-ko контентын бүрэн бүтэн байдлыг шалгах / content integrity checker.
 *
 *   node packages/lang-ko/scripts/validate.mjs [--quiet] [--json]
 *
 * Гуравдагч сангаас хамааралгүй (zod шаардахгүй) — CI, pre-commit, ETL-д
 * шууд ажиллана. Алдаа олдвол exit code 1.
 *
 * Шалгах зүйлс:
 *   1. JSON задрах эсэх, бүрхүүлийн (envelope) хэлбэр
 *   2. ID-ийн формат ба глобал давхардал
 *   3. Түвшин ↔ нэгжийн харилцан лавлагаа, урьдчилсан нөхцөлийн граф (мөчлөггүй)
 *   4. Тоон тохирол: нэгжүүдийн үгийн тоо → түвшний зорилт, хуримтлагдсан тоо
 *   5. Кросс-лавлагаа: unitId, domain, contrastWith, grammarIds, vocabIds
 *   6. Контентын чанарын доод хэмжүүр (жишээний тоо, mn талбар хоосон эсэх)
 *   7. Зөвхөн заагдсан дүрэм/үг уншлагын материалд орсон эсэх (сануулга)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = join(ROOT, 'content')

const args = new Set(process.argv.slice(2))
const QUIET = args.has('--quiet')
const AS_JSON = args.has('--json')

const errors = []
const warnings = []
const stats = {}

const err = (file, msg) => errors.push({ file: rel(file), msg })
const warn = (file, msg) => warnings.push({ file: rel(file), msg })
const rel = (f) => (f ? relative(ROOT, f).replace(/\\/g, '/') : '')

const LEVEL_IDS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6']

/* ------------------------------------------------------------------ helpers */

function readJson(file) {
  if (!existsSync(file)) return null
  try {
    const raw = readFileSync(file, 'utf8')
    if (raw.charCodeAt(0) === 0xfeff) warn(file, 'Файл BOM-той эхэлж байна — UTF-8 (BOM-гүй) байх ёстой')
    return JSON.parse(raw.replace(/^﻿/, ''))
  } catch (e) {
    err(file, `JSON задарсангүй: ${e.message}`)
    return null
  }
}

function listJson(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => join(dir, f))
}

function envelopeItems(file, json) {
  if (!json) return []
  if (!Array.isArray(json.items)) {
    err(file, 'Бүрхүүлд `items` массив алга')
    return []
  }
  if (typeof json.version !== 'number') err(file, '`version` (тоо) талбар дутуу')
  return json.items
}

function requireFields(file, obj, id, fields) {
  for (const f of fields) {
    const v = f.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) {
      err(file, `${id}: \`${f}\` талбар дутуу/хоосон`)
    }
  }
}

/* ------------------------------------------------------- 1. curriculum spine */

const curriculumFile = join(CONTENT, 'curriculum', 'curriculum.json')
const curriculum = readJson(curriculumFile)
const units = new Map()
const levels = new Map()

if (!curriculum) {
  err(curriculumFile, 'Сургалтын хөтөлбөрийн үндсэн файл алга — бусад шалгалт хязгаарлагдана')
} else {
  if (curriculum.language !== 'ko') err(curriculumFile, '`language` "ko" байх ёстой')
  if (curriculum.instructionLanguage !== 'mn') err(curriculumFile, '`instructionLanguage` "mn" байх ёстой')

  for (const lv of curriculum.levels ?? []) {
    if (levels.has(lv.id)) err(curriculumFile, `Түвшний ID давхардсан: ${lv.id}`)
    levels.set(lv.id, lv)
    requireFields(curriculumFile, lv, lv.id, ['title.mn', 'description.mn', 'targets', 'canDo', 'exitCriteria', 'unitIds'])
  }
  for (const id of LEVEL_IDS) if (!levels.has(id)) err(curriculumFile, `Түвшин дутуу: ${id}`)

  for (const u of curriculum.units ?? []) {
    if (units.has(u.id)) err(curriculumFile, `Нэгжийн ID давхардсан: ${u.id}`)
    units.set(u.id, u)
    if (!/^L[0-6]-U\d{2}$/.test(u.id)) err(curriculumFile, `Нэгжийн ID формат буруу: ${u.id}`)
    if (!levels.has(u.levelId)) err(curriculumFile, `${u.id}: тодорхойгүй levelId "${u.levelId}"`)
    if (!u.id.startsWith(u.levelId + '-')) err(curriculumFile, `${u.id}: ID нь levelId "${u.levelId}"-тэй таарахгүй`)
    requireFields(curriculumFile, u, u.id, ['title.mn', 'goal.mn', 'textType', 'estimatedMinutes', 'exerciseTypes'])
  }

  // Хоёр талын лавлагаа
  for (const [lid, lv] of levels) {
    for (const uid of lv.unitIds ?? []) {
      if (!units.has(uid)) err(curriculumFile, `${lid}.unitIds → байхгүй нэгж "${uid}"`)
      else if (units.get(uid).levelId !== lid) err(curriculumFile, `${uid} нь ${lid}-д жагссан ч levelId нь ${units.get(uid).levelId}`)
    }
  }
  for (const [uid, u] of units) {
    const lv = levels.get(u.levelId)
    if (lv && !(lv.unitIds ?? []).includes(uid)) err(curriculumFile, `${uid} нь ${u.levelId}.unitIds-д ороогүй`)
    for (const p of u.prerequisites ?? []) {
      if (!units.has(p)) err(curriculumFile, `${uid}.prerequisites → байхгүй нэгж "${p}"`)
      if (p === uid) err(curriculumFile, `${uid}: өөрөө өөрийнхөө урьдчилсан нөхцөл болсон`)
    }
  }

  // Урьдчилсан нөхцөлийн мөчлөг
  const state = new Map()
  const walk = (id, path) => {
    if (state.get(id) === 'done') return
    if (state.get(id) === 'open') {
      err(curriculumFile, `Урьдчилсан нөхцөлд мөчлөг үүссэн: ${[...path, id].join(' → ')}`)
      return
    }
    state.set(id, 'open')
    for (const p of units.get(id)?.prerequisites ?? []) if (units.has(p)) walk(p, [...path, id])
    state.set(id, 'done')
  }
  for (const id of units.keys()) walk(id, [])

  // Тоон тохирол
  let cumVocab = 0
  let cumGrammar = 0
  for (const id of LEVEL_IDS) {
    const lv = levels.get(id)
    if (!lv) continue
    const lvUnits = [...units.values()].filter((u) => u.levelId === id)
    const sum = lvUnits.reduce((a, u) => a + (u.newVocabCount ?? 0), 0)
    const target = lv.targets?.newVocab ?? 0
    if (sum !== target) {
      const drift = Math.abs(sum - target)
      const msg = `${id}: нэгжүүдийн newVocabCount нийлбэр ${sum} ≠ targets.newVocab ${target} (зөрүү ${drift})`
      drift > Math.max(20, target * 0.05) ? err(curriculumFile, msg) : warn(curriculumFile, msg)
    }
    cumVocab += target
    cumGrammar += lv.targets?.newGrammar ?? 0
    if (lv.targets?.cumulativeVocab !== cumVocab) {
      warn(curriculumFile, `${id}: cumulativeVocab ${lv.targets?.cumulativeVocab} ≠ хуримтлал ${cumVocab}`)
    }
    if (lv.targets?.cumulativeGrammar !== cumGrammar) {
      warn(curriculumFile, `${id}: cumulativeGrammar ${lv.targets?.cumulativeGrammar} ≠ хуримтлал ${cumGrammar}`)
    }
    stats[id] = {
      units: lvUnits.length,
      targetVocab: target,
      unitVocabSum: sum,
      targetGrammar: lv.targets?.newGrammar ?? 0,
      hours: lv.targets?.hours ?? 0,
      grammarAuthored: 0,
      vocabAuthored: 0,
      dialogues: 0,
      readings: 0,
    }
  }
}

const unitLevel = (uid) => units.get(uid)?.levelId

/* ------------------------------------------------------------- 2. collectors */

const grammarIds = new Set()
const vocabIds = new Set()
const vocabByKo = new Map()
const domainIds = new Set()
const pendingContrast = []

/* --------------------------------------------------------------- 3. domains */

const domainsFile = join(CONTENT, 'vocab', 'domains.json')
for (const d of envelopeItems(domainsFile, readJson(domainsFile))) {
  if (domainIds.has(d.id)) err(domainsFile, `Домэйн давхардсан: ${d.id}`)
  domainIds.add(d.id)
  if (!/^[a-z0-9-]+$/.test(d.id ?? '')) err(domainsFile, `Домэйний ID формат буруу: ${d.id}`)
  requireFields(domainsFile, d, d.id, ['label.mn', 'opensAt'])
}

/* ---------------------------------------------------------------- 4. hangul */

for (const file of listJson(join(CONTENT, 'hangul'))) {
  const items = envelopeItems(file, readJson(file))
  const seen = new Set()
  const kind = basename(file, '.json')
  for (const it of items) {
    if (!it.id) { err(file, 'ID-гүй бичлэг'); continue }
    if (seen.has(it.id)) err(file, `ID давхардсан: ${it.id}`)
    seen.add(it.id)
    if (kind === 'jamo') {
      requireFields(file, it, it.id, ['char', 'name', 'nameMn', 'type', 'soundMn', 'examples', 'unitId'])
      if (it.unitId && !units.has(it.unitId)) err(file, `${it.id}: байхгүй unitId "${it.unitId}"`)
    }
    if (kind === 'sound-changes') {
      requireFields(file, it, it.id, ['name', 'nameMn', 'rule', 'explanationMn', 'levelId', 'examples'])
      if ((it.examples ?? []).length < 3) err(file, `${it.id}: дуудлагын дүрэмд дор хаяж 3 жишээ хэрэгтэй (одоо ${(it.examples ?? []).length})`)
      for (const ex of it.examples ?? []) {
        if (!ex.written || !ex.pronounced) err(file, `${it.id}: жишээнд written/pronounced дутуу`)
      }
    }
    if (kind === 'batchim') requireFields(file, it, it.id, ['spelling', 'sound', 'ruleMn', 'examples'])
  }
  stats[kind] = { count: items.length }
}

/* --------------------------------------------------------------- 5. grammar */

for (const file of listJson(join(CONTENT, 'grammar'))) {
  for (const g of envelopeItems(file, readJson(file))) {
    if (!g.id) { err(file, 'ID-гүй дүрэм'); continue }
    if (grammarIds.has(g.id)) err(file, `Дүрмийн ID давхардсан: ${g.id}`)
    grammarIds.add(g.id)
    if (!/^ko-g-\d{4}$/.test(g.id)) err(file, `Дүрмийн ID формат буруу: ${g.id}`)
    requireFields(file, g, g.id, ['form', 'type', 'levelId', 'unitId', 'meaning.mn', 'explanationMn', 'attachesTo', 'formation', 'examples'])
    if ((g.examples ?? []).length < 3) err(file, `${g.id} (${g.form}): дор хаяж 3 жишээ өгүүлбэр хэрэгтэй (одоо ${(g.examples ?? []).length})`)
    for (const ex of g.examples ?? []) {
      if (!ex.ko || !ex.rom || !ex.mn) err(file, `${g.id}: жишээнд ko/rom/mn гурвуулаа байх ёстой`)
    }
    if ((g.explanationMn ?? '').length < 20) err(file, `${g.id}: монгол тайлбар хэт богино`)
    if (g.unitId && !units.has(g.unitId)) err(file, `${g.id}: байхгүй unitId "${g.unitId}"`)
    else if (g.unitId && unitLevel(g.unitId) !== g.levelId) err(file, `${g.id}: levelId ${g.levelId} ≠ нэгжийн түвшин ${unitLevel(g.unitId)}`)
    if (typeof g.readingWeight === 'number' && (g.readingWeight < 1 || g.readingWeight > 5)) err(file, `${g.id}: readingWeight 1..5 байх ёстой`)
    for (const c of g.contrastWith ?? []) pendingContrast.push({ file, from: g.id, to: c.id ?? c })
    if (stats[g.levelId]) stats[g.levelId].grammarAuthored++
  }
}
for (const c of pendingContrast) {
  if (!grammarIds.has(c.to)) warn(c.file, `${c.from}.contrastWith → байхгүй дүрэм "${c.to}"`)
}

/* ----------------------------------------------------------------- 6. vocab */

for (const file of listJson(join(CONTENT, 'vocab'))) {
  if (basename(file) === 'domains.json') continue
  for (const v of envelopeItems(file, readJson(file))) {
    if (!v.id) { err(file, 'ID-гүй үг'); continue }
    if (vocabIds.has(v.id)) err(file, `Үгийн ID давхардсан: ${v.id}`)
    vocabIds.add(v.id)
    if (!/^ko-v-\d{5}$/.test(v.id)) err(file, `Үгийн ID формат буруу: ${v.id}`)
    requireFields(file, v, v.id, ['ko', 'rom', 'pos', 'origin', 'mn', 'en', 'levelId', 'unitId', 'domain', 'examples'])
    if (v.ko) {
      const prev = vocabByKo.get(v.ko)
      if (prev && prev.pos === v.pos) warn(file, `"${v.ko}" (${v.pos}) давхардсан: ${prev.id} ба ${v.id}`)
      else vocabByKo.set(v.ko, v)
      if (!/[가-힣]/.test(v.ko)) err(file, `${v.id}: \`ko\` талбарт солонгос үсэг алга ("${v.ko}")`)
    }
    if (v.domain && domainIds.size && !domainIds.has(v.domain)) err(file, `${v.id}: тодорхойгүй домэйн "${v.domain}"`)
    if (v.unitId && !units.has(v.unitId)) err(file, `${v.id}: байхгүй unitId "${v.unitId}"`)
    else if (v.unitId && unitLevel(v.unitId) !== v.levelId) err(file, `${v.id}: levelId ${v.levelId} ≠ нэгжийн түвшин ${unitLevel(v.unitId)}`)
    if (v.origin === 'sino' && !v.hanja) warn(file, `${v.id} (${v.ko}): 한자어 гэж тэмдэглэсэн ч hanja талбар хоосон`)
    if (v.origin !== 'sino' && v.hanja) warn(file, `${v.id} (${v.ko}): hanja талбартай ч origin "${v.origin}"`)
    if (!(v.examples ?? []).length) err(file, `${v.id}: жишээ өгүүлбэр алга`)
    if (stats[v.levelId]) stats[v.levelId].vocabAuthored++
  }
}

/* ---------------------------------------------------- 7. dialogues, readings */

const checkRefs = (file, id, gIds, vIds) => {
  for (const g of gIds ?? []) if (grammarIds.size && !grammarIds.has(g)) warn(file, `${id}: байхгүй дүрмийн ID "${g}"`)
  for (const v of vIds ?? []) if (vocabIds.size && !vocabIds.has(v)) warn(file, `${id}: байхгүй үгийн ID "${v}"`)
}

for (const file of listJson(join(CONTENT, 'dialogues'))) {
  for (const d of envelopeItems(file, readJson(file))) {
    if (!d.id) { err(file, 'ID-гүй харилцан яриа'); continue }
    requireFields(file, d, d.id, ['levelId', 'unitId', 'title.mn', 'settingMn', 'speakers', 'lines'])
    if (d.unitId && !units.has(d.unitId)) err(file, `${d.id}: байхгүй unitId "${d.unitId}"`)
    const speakerIds = new Set((d.speakers ?? []).map((s) => s.id))
    for (const [i, ln] of (d.lines ?? []).entries()) {
      if (!ln.ko || !ln.rom || !ln.mn) err(file, `${d.id} мөр ${i + 1}: ko/rom/mn дутуу`)
      if (ln.speaker && speakerIds.size && !speakerIds.has(ln.speaker)) err(file, `${d.id} мөр ${i + 1}: тодорхойгүй ярианы эзэн "${ln.speaker}"`)
      checkRefs(file, `${d.id}:${i + 1}`, ln.grammarIds, ln.vocabIds)
    }
    for (const q of d.comprehension ?? []) {
      if (!Array.isArray(q.options) || q.options.length < 2) err(file, `${d.id}: асуултад 2-оос доошгүй сонголт хэрэгтэй`)
      else if (q.answerIndex == null || q.answerIndex < 0 || q.answerIndex >= q.options.length) err(file, `${d.id}: answerIndex мужаас гарсан`)
    }
    if (stats[d.levelId]) stats[d.levelId].dialogues++
  }
}

for (const file of listJson(join(CONTENT, 'readings'))) {
  for (const r of envelopeItems(file, readJson(file))) {
    if (!r.id) { err(file, 'ID-гүй уншлага'); continue }
    requireFields(file, r, r.id, ['levelId', 'unitId', 'title.mn', 'textType', 'paragraphs', 'translationMn', 'comprehension'])
    if (r.unitId && !units.has(r.unitId)) err(file, `${r.id}: байхгүй unitId "${r.unitId}"`)
    if ((r.paragraphs ?? []).length !== (r.translationMn ?? []).length) {
      err(file, `${r.id}: догол мөрийн тоо (${(r.paragraphs ?? []).length}) орчуулгынхтай (${(r.translationMn ?? []).length}) таарахгүй`)
    }
    if ((r.comprehension ?? []).length < 2) err(file, `${r.id}: 2-оос доошгүй ойлголтын асуулт хэрэгтэй`)
    checkRefs(file, r.id, r.grammarIds, [])
    const words = (r.paragraphs ?? []).join(' ').split(/\s+/).filter(Boolean).length
    if (r.wordCount && Math.abs(r.wordCount - words) > Math.max(10, words * 0.25)) {
      warn(file, `${r.id}: wordCount ${r.wordCount} ≈ бодит ${words} биш`)
    }
    if (stats[r.levelId]) stats[r.levelId].readings++
  }
}

/* ------------------------------------------------------------------ 8. hanja */

const hanjaChars = new Set()
for (const file of listJson(join(CONTENT, 'hanja'))) {
  const items = envelopeItems(file, readJson(file))
  for (const h of items) {
    if (!h.id) { err(file, 'ID-гүй ханз'); continue }
    if (hanjaChars.has(h.char)) warn(file, `Ханз давхардсан: ${h.char}`)
    hanjaChars.add(h.char)
    requireFields(file, h, h.id, ['char', 'reading', 'meaningKo', 'meaningMn', 'levelId', 'words'])
    if ((h.words ?? []).length < 3) err(file, `${h.id} (${h.char}): дор хаяж 3 жишээ үг хэрэгтэй`)
  }
  stats.hanja = { count: (stats.hanja?.count ?? 0) + items.length }
}

/* ---------------------------------------------------- 9. хөтөлбөрийн бүрхүүл */

if (curriculum && grammarIds.size) {
  for (const [uid, u] of units) {
    const declared = (u.grammarForms ?? []).length
    if (declared === 0 && u.levelId !== 'L0') warn(curriculumFile, `${uid}: grammarForms хоосон`)
  }
  for (const id of LEVEL_IDS) {
    const s = stats[id]
    if (!s) continue
    if (s.grammarAuthored && s.targetGrammar && s.grammarAuthored < s.targetGrammar * 0.9) {
      warn('', `${id}: дүрэм ${s.grammarAuthored}/${s.targetGrammar} бичигдсэн`)
    }
    if (s.vocabAuthored && s.targetVocab && s.vocabAuthored < s.targetVocab * 0.9) {
      warn('', `${id}: үг ${s.vocabAuthored}/${s.targetVocab} бичигдсэн`)
    }
  }
}

/* ----------------------------------------------------------------- 10. output */

if (AS_JSON) {
  console.log(JSON.stringify({ ok: errors.length === 0, errors, warnings, stats }, null, 2))
} else {
  if (!QUIET) {
    console.log('\n📚 lang-ko — контентын шалгалт\n' + '─'.repeat(60))
    for (const id of LEVEL_IDS) {
      const s = stats[id]
      if (!s) continue
      console.log(
        `${id}  нэгж ${String(s.units).padStart(2)} · дүрэм ${String(s.grammarAuthored).padStart(3)}/${String(s.targetGrammar).padEnd(3)}` +
          ` · үг ${String(s.vocabAuthored).padStart(4)}/${String(s.targetVocab).padEnd(4)}` +
          ` · яриа ${String(s.dialogues).padStart(2)} · уншлага ${String(s.readings).padStart(2)} · ${s.hours} ц`,
      )
    }
    for (const k of ['jamo', 'batchim', 'sound-changes', 'hanja']) {
      if (stats[k]) console.log(`${k.padEnd(14)} ${stats[k].count}`)
    }
    console.log('─'.repeat(60))
  }
  for (const w of warnings) console.log(`⚠️  ${w.file ? w.file + ' — ' : ''}${w.msg}`)
  for (const e of errors) console.error(`❌ ${e.file ? e.file + ' — ' : ''}${e.msg}`)
  console.log(
    `\n${errors.length === 0 ? '✅ Алдаагүй' : `❌ ${errors.length} алдаа`}` +
      `${warnings.length ? ` · ⚠️ ${warnings.length} сануулга` : ''}\n`,
  )
}

process.exit(errors.length ? 1 : 0)
