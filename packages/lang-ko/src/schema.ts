/**
 * lang-ko — Солонгос хэлний сургалтын өгөгдлийн схем
 * ---------------------------------------------------------------------------
 * Энэ файл бол `packages/lang-ko/content/**` доторх БҮХ JSON файлын
 * цорын ганц үнэний эх сурвалж (single source of truth).
 *
 * Дүрэм:
 *  - Заавар, тайлбар бүхэн МОНГОЛ хэл дээр (`mn`) — энэ талбар үргэлж заавал.
 *  - Солонгос эх хэлбэр (`ko`) + латин галиг (`rom`, Revised Romanization)
 *    + англи товч утга (`en`) нь хөндлөнгийн шалгалт, ирээдүйн i18n-д хэрэгтэй.
 *  - ID бүр глобал давхардахгүй, тогтмол (контент нэмэгдэхэд хуучин ID өөрчлөгдөхгүй).
 *
 * This file is the single source of truth for every JSON file under
 * `packages/lang-ko/content/`. Instruction language is Mongolian.
 */

import { z } from 'zod'

/* -------------------------------------------------------------------------- */
/* Үндсэн блокууд / primitives                                                 */
/* -------------------------------------------------------------------------- */

/** Монгол заавал, солонгос/англи сонголттой олон хэлт мөр. */
export const L10n = z.object({
  mn: z.string().min(1),
  ko: z.string().optional(),
  en: z.string().optional(),
})

/** Түвшний ID: L0 (Хангыл) + L1..L6 (TOPIK 1..6). */
export const LevelId = z.enum(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'])

/** Хичээлийн нэгжийн ID, ж: "L1-U03". */
export const UnitId = z.string().regex(/^L[0-6]-U\d{2}$/)

/** Ярианы түвшин / 말차림새. */
export const SpeechLevel = z.enum([
  'haerache', //  해라체 — бичгийн/энгийн өгүүлэх (신문, 책)
  'haeche', //    해체   — 반말
  'hagece', //    하게체 — ховор, ахмад→дүү
  'haoche', //    하오체 — эртний/албан
  'haeyoche', //  해요체 — өдөр тутмын эелдэг
  'hapsyoche', // 합쇼체 — албан ёсны хүндэтгэл (-습니다)
  'neutral', //   тухайн зүйл ярианы түвшингээс хамаарахгүй
])

/** Үгийн аймаг. */
export const Pos = z.enum([
  'noun', //        명사   — нэр үг
  'pronoun', //     대명사 — төлөөний үг
  'number', //      수사   — тооны үг
  'verb', //        동사   — үйл үг
  'adjective', //   형용사 — тэмдэг нэр (солонгосд үйл үг шиг хувирдаг)
  'determiner', //  관형사 — тодотгол
  'adverb', //      부사   — дайвар үг
  'particle', //    조사   — нөхцөл
  'interjection', //감탄사 — аялга үг
  'ending', //      어미   — залгавар
  'affix', //       접사   — угтвар/дагавар
  'counter', //     분류사 — тоолуур
  'phrase', //      хэллэг / хэвшмэл илэрхийлэл
])

/** Үгийн гарал. */
export const WordOrigin = z.enum([
  'native', //  고유어  — уугуул солонгос
  'sino', //    한자어  — хятад гаралтай
  'loan', //    외래어  — гадаад (голдуу англи)
  'hybrid', //  холимог
])

/** Дүрмийн бус хувирлын ангилал (불규칙 활용). */
export const Irregular = z.enum(['b', 'd', 's', 'reu', 'eu', 'reo', 'u', 'h', 'l-drop', 'none'])

/** Дадлагын төрөл — апп дээрх дасгалын бүрэлдэхүүн. */
export const ExerciseType = z.enum([
  'jamo-trace', //         үсэг таних/бичих
  'syllable-build', //     үе угсрах
  'listen-select', //      сонсоод сонгох
  'dictation', //          сонсоод бичих
  'flashcard', //          SRS санах ой
  'match', //              харгалзуулах
  'cloze-particle', //     нөхцөл нөхөх
  'cloze-grammar', //      дүрмийн хэлбэр нөхөх
  'conjugation', //        хувиргалтын дасгал
  'scramble', //           үг эрэмбэлж өгүүлбэр угсрах
  'translate-mn-ko', //    монголоос солонгос руу
  'translate-ko-mn', //    солонгосоос монгол руу
  'sound-change', //       дуудлагын дүрмийн дасгал
  'dialogue-gap', //       харилцан ярианы нөхөлт
  'reading-mcq', //        уншаад сонголттой асуулт
  'reading-inference', //  дүгнэлт гаргах
  'sentence-parse', //     урт өгүүлбэрийг цэгцлэх
  'speed-read', //         хугацаатай унших
  'hanja-decode', //       үгийг хятад язгуураар нь тайлах
  'topik-mock', //         TOPIK загварын шалгалт
])

/** Уншлагын материалын төрөл. */
export const TextType = z.enum([
  'syllable-drill',
  'word-list',
  'mini-dialogue',
  'dialogue',
  'short-paragraph',
  'notice', //   зар, мэдэгдэл, зурагт хуудас
  'message', //  мессеж, чат, и-мэйл
  'article', //  нийтлэл, мэдээ
  'editorial', //редакцийн/шүүмж
  'academic', // эрдэм шинжилгээ / албан бичиг
  'literary', // уран зохиол
])

/** Жишээ өгүүлбэр — сургалтын бүх нэгжид хамаарах нэгдсэн хэлбэр. */
export const Example = z.object({
  ko: z.string().min(1),
  rom: z.string().min(1),
  mn: z.string().min(1),
  en: z.string().optional(),
  /** Дуудлагаар нь бичсэн хэлбэр, бичлэгээс ялгаатай үед (ж: 좋아요 → [조아요]). */
  pron: z.string().optional(),
  /** Аль дүрмийн зүйлийг харуулж буй тайлбар. */
  note: z.string().optional(),
  audioKey: z.string().optional(),
})

/* -------------------------------------------------------------------------- */
/* 1. Түвшин ба хичээлийн нэгж / curriculum spine                              */
/* -------------------------------------------------------------------------- */

export const Level = z.object({
  id: LevelId,
  /** TOPIK-ийн түвшин; L0 (хангыл) дээр null. */
  topik: z.number().int().min(1).max(6).nullable(),
  cefr: z.string(), // "pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  title: L10n,
  description: L10n,
  targets: z.object({
    newVocab: z.number().int().nonnegative(),
    cumulativeVocab: z.number().int().nonnegative(),
    newGrammar: z.number().int().nonnegative(),
    cumulativeGrammar: z.number().int().nonnegative(),
    hanja: z.number().int().nonnegative(),
    hours: z.number().positive(),
  }),
  /** "Би ... чадна" гэсэн хэмжигдэхүйц үр дүн. */
  canDo: z.array(
    L10n.extend({ skill: z.enum(['reading', 'listening', 'speaking', 'writing']) }),
  ).min(3),
  exitCriteria: z.array(L10n).min(1),
  unitIds: z.array(UnitId).min(1),
})

export const Unit = z.object({
  id: UnitId,
  levelId: LevelId,
  order: z.number().int().positive(),
  title: L10n,
  goal: L10n,
  /** Энэ нэгжид ШИНЭЭР танилцуулагдах дүрмийн хэлбэрүүд (солонгос эх бичиглэл). */
  grammarForms: z.array(z.string()),
  vocabDomains: z.array(z.string()),
  newVocabCount: z.number().int().nonnegative(),
  hanjaCount: z.number().int().nonnegative().default(0),
  textType: TextType,
  estimatedMinutes: z.number().int().positive(),
  prerequisites: z.array(UnitId),
  exerciseTypes: z.array(ExerciseType).min(1),
})

export const Curriculum = z.object({
  version: z.number().int().positive(),
  language: z.literal('ko'),
  instructionLanguage: z.literal('mn'),
  levels: z.array(Level).length(7),
  units: z.array(Unit).min(1),
})

/* -------------------------------------------------------------------------- */
/* 2. Хангыл — үсэг, үе, дуудлагын дүрэм                                       */
/* -------------------------------------------------------------------------- */

export const Jamo = z.object({
  /** ж: "ko-jamo-giyeok" */
  id: z.string().regex(/^ko-jamo-[a-z0-9-]+$/),
  char: z.string().min(1),
  /** Солонгос нэр, ж: "기역" */
  name: z.string(),
  /** Нэрийн монгол галиг, ж: "гиёк" */
  nameMn: z.string(),
  type: z.enum(['consonant-basic', 'consonant-aspirated', 'consonant-tense', 'vowel-basic', 'vowel-y', 'vowel-complex']),
  rom: z.object({
    /** Үений эхэнд (초성). */
    initial: z.string(),
    /** Үений төгсгөлд (종성); эгшигт хоосон. */
    final: z.string().optional(),
  }),
  ipa: z.string(),
  /** Монгол хүнд дуудлагыг тайлбарлах — ойролцоо ба ЯЛГАА нь. */
  soundMn: z.string().min(1),
  /** Монгол сурагчийн түгээмэл алдаа. */
  pitfallMn: z.string().optional(),
  /** Зурлагын дараалал — товч заавар. */
  strokes: z.number().int().positive(),
  strokeOrderMn: z.string().optional(),
  /** Уг үсгээр эхлэх/төгсөх энгийн жишээ үгс. */
  examples: z.array(Example).min(1),
  /** Хангылын хичээлийн дараалал дахь байр. */
  order: z.number().int().positive(),
  unitId: UnitId,
})

export const Batchim = z.object({
  id: z.string(),
  /** Бичлэг дэх төгсгөлийн гийгүүлэгч, ж: "ㄳ" */
  spelling: z.string(),
  /** 7 төлөөлөх авианы аль болж дуудагдах: ㄱㄴㄷㄹㅁㅂㅇ */
  sound: z.enum(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ']),
  isDouble: z.boolean(),
  ruleMn: z.string(),
  exceptions: z.array(z.object({ word: z.string(), pron: z.string(), noteMn: z.string() })).default([]),
  examples: z.array(Example).min(1),
})

export const SoundChange = z.object({
  /** ж: "ko-snd-yeoneum" */
  id: z.string().regex(/^ko-snd-[a-z0-9-]+$/),
  /** Солонгос нэр, ж: "연음 법칙" */
  name: z.string(),
  nameMn: z.string(),
  nameEn: z.string(),
  /** Албан ёсны томьёолол, ж: "받침 + ㅇ 초성 → 받침이 다음 음절 초성으로" */
  rule: z.string(),
  explanationMn: z.string().min(1),
  /** Ямар нөхцөлд ажиллах. */
  environment: z.string(),
  /** Аль түвшинд заах. */
  levelId: LevelId,
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  examples: z.array(
    Example.extend({ written: z.string(), pronounced: z.string() }),
  ).min(3),
  exceptions: z.array(z.string()).default([]),
})

/* -------------------------------------------------------------------------- */
/* 3. Дүрэм / grammar                                                          */
/* -------------------------------------------------------------------------- */

export const GrammarPoint = z.object({
  /** ж: "ko-g-0042" — тогтмол, дахин ашиглагдахгүй. */
  id: z.string().regex(/^ko-g-\d{4}$/),
  /** Солонгос эх хэлбэр, ж: "-(으)ㄹ 수 있다" */
  form: z.string().min(1),
  /** Хувилбарууд, ж: ["-을 수 있다", "-ㄹ 수 있다"] */
  variants: z.array(z.string()).default([]),
  rom: z.string(),
  type: z.enum([
    'particle', //      조사
    'ending-final', //  종결어미
    'ending-connective', // 연결어미
    'ending-prefinal', //선어말어미
    'ending-nominal', //전성어미 (-기, -(으)ㅁ, 관형형)
    'construction', //  дүрмийн хэв маяг (-는 것 같다)
    'honorific', //     존댓말 / 높임법
    'conjugation', //   хувиргалтын дүрэм (불규칙 гэх мэт)
    'expression', //    хэвшмэл илэрхийлэл
    'written-register', // 문어체 — уншихад чухал бичгийн хэлбэр
  ]),
  levelId: LevelId,
  unitId: UnitId,
  order: z.number().int().positive(),
  meaning: L10n,
  /** 3-6 өгүүлбэр монгол тайлбар. Монгол хэлний ижил төстэй үзэгдэлтэй харьцуулбал сайн. */
  explanationMn: z.string().min(20),
  /** Юунд залгагдах. */
  attachesTo: z.array(z.enum(['noun', 'verb', 'adjective', 'copula', 'clause', 'adverb', 'number'])).min(1),
  /** Бүтээх дүрэм — нөхцөл бүрээр. */
  formation: z.array(
    z.object({
      condition: z.string(), // ж: "받침 байвал"
      pattern: z.string(), //   ж: "동사 + 을 수 있다"
      example: z.string(), //   ж: "먹다 → 먹을 수 있다"
    }),
  ).min(1),
  speechLevel: SpeechLevel.default('neutral'),
  formality: z.enum(['spoken', 'written', 'both']).default('both'),
  examples: z.array(Example).min(3),
  /** Андуурч болзошгүй бусад дүрмийн ID + ялгааны монгол тайлбар. */
  contrastWith: z.array(z.object({ id: z.string(), differenceMn: z.string() })).default([]),
  commonMistakes: z.array(
    z.object({ wrong: z.string(), right: z.string(), whyMn: z.string() }),
  ).default([]),
  /** Уншихад хэр чухал вэ (5 = өгүүлбэр тайлахад зайлшгүй). */
  readingWeight: z.number().int().min(1).max(5),
  tags: z.array(z.string()).default([]),
})

/* -------------------------------------------------------------------------- */
/* 4. Үгийн сан / vocabulary                                                   */
/* -------------------------------------------------------------------------- */

export const VocabEntry = z.object({
  /** ж: "ko-v-00317" */
  id: z.string().regex(/^ko-v-\d{5}$/),
  ko: z.string().min(1),
  rom: z.string().min(1),
  /** Дуудлага бичлэгээс ялгаатай бол, ж: 좋다 → [조타] */
  pron: z.string().optional(),
  pos: Pos,
  origin: WordOrigin,
  /** Хятад гаралтай үгийн ханз, ж: "學生". Байхгүй бол null. */
  hanja: z.string().nullable().default(null),
  /** Монгол утга — үндсэн ойлголт. Олон утгыг ";"-ээр биш массиваар. */
  mn: z.array(z.string().min(1)).min(1),
  en: z.array(z.string()).min(1),
  levelId: LevelId,
  unitId: UnitId,
  /** Утгын хүрээ, ж: "food", "transport" — vocab-domains.json-той таарна. */
  domain: z.string().min(1),
  /** Үйл үг/тэмдэг нэрийн дүрмийн бус хувирал. */
  irregular: Irregular.default('none'),
  /** 하다-үйл үг эсэх (учир нь 공부 → 공부하다). */
  hadaVerb: z.boolean().default(false),
  /** Тоолуур: аль нэр үгэнд хэрэглэгдэх. */
  countsFor: z.array(z.string()).optional(),
  /** Эсрэг ба ойролцоо утгатай үгс (өөр бичлэгийн ID). */
  antonyms: z.array(z.string()).default([]),
  synonyms: z.array(z.string()).default([]),
  /** Ижил язгуурт үгс — уншихад хамгийн их үр өгөөжтэй холбоос. */
  family: z.array(z.string()).default([]),
  /** Хамт хэрэглэгддэг үг (연어): 밥을 먹다, 약속을 지키다. */
  collocations: z.array(z.string()).default([]),
  examples: z.array(Example).min(1),
  /** Хэрэглээний хүрээ. */
  register: z.enum(['neutral', 'formal', 'casual', 'written', 'slang', 'honorific', 'humble']).default('neutral'),
  /** Давтамжийн зэрэглэл (1 = хамгийн түгээмэл). Мэдэгдэхгүй бол null. */
  freqRank: z.number().int().positive().nullable().default(null),
  noteMn: z.string().optional(),
  audioKey: z.string().optional(),
})

export const VocabDomain = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: L10n,
  /** Аль түвшинд нээгдэх. */
  opensAt: LevelId,
  /** Түвшин тус бүрийн үгийн тоо. */
  perLevel: z.record(LevelId, z.number().int().nonnegative()),
  description: z.string().optional(),
})

/* -------------------------------------------------------------------------- */
/* 5. Ханз язгуур / Sino-Korean                                                */
/* -------------------------------------------------------------------------- */

export const HanjaMorpheme = z.object({
  id: z.string().regex(/^ko-h-\d{4}$/),
  char: z.string().length(1),
  /** Солонгос дуудлага (음), ж: "학" */
  reading: z.string(),
  /** Хэд хэдэн дуудлагатай бол. */
  altReadings: z.array(z.string()).default([]),
  /** Утга (훈), ж: "배울" */
  meaningKo: z.string(),
  meaningMn: z.string(),
  meaningEn: z.string(),
  levelId: LevelId,
  /** Уншихад өгөх ашиг (1 = хамгийн өндөр). */
  payloadRank: z.number().int().positive(),
  /** Энэ язгуураар бүтсэн түгээмэл үгс. */
  words: z.array(
    z.object({ ko: z.string(), hanja: z.string(), mn: z.string(), en: z.string().optional() }),
  ).min(3),
  /** Ижил дуудлагатай өөр язгуурууд — андуурахаас сэргийлнэ. */
  homophones: z.array(z.object({ char: z.string(), meaningMn: z.string() })).default([]),
})

/* -------------------------------------------------------------------------- */
/* 6. Харилцан яриа ба унших материал                                          */
/* -------------------------------------------------------------------------- */

export const Dialogue = z.object({
  id: z.string().regex(/^ko-d-\d{4}$/),
  levelId: LevelId,
  unitId: UnitId,
  title: L10n,
  /** Нөхцөл байдлын монгол тайлбар. */
  settingMn: z.string(),
  speakers: z.array(z.object({ id: z.string(), nameKo: z.string(), roleMn: z.string() })).min(2),
  lines: z.array(
    z.object({
      speaker: z.string(),
      ko: z.string(),
      rom: z.string(),
      mn: z.string(),
      en: z.string().optional(),
      /** Энэ мөрөнд гарч буй дүрэм/үгийн ID. */
      grammarIds: z.array(z.string()).default([]),
      vocabIds: z.array(z.string()).default([]),
      noteMn: z.string().optional(),
      audioKey: z.string().optional(),
    }),
  ).min(4),
  comprehension: z.array(
    z.object({
      questionMn: z.string(),
      questionKo: z.string().optional(),
      options: z.array(z.string()).min(2),
      answerIndex: z.number().int().nonnegative(),
      explanationMn: z.string(),
    }),
  ).default([]),
  cultureNoteMn: z.string().optional(),
})

export const Reading = z.object({
  id: z.string().regex(/^ko-r-\d{4}$/),
  levelId: LevelId,
  unitId: UnitId,
  title: L10n,
  textType: TextType,
  /** Эх бичвэр — догол мөрөөр. Зөвхөн энэ болон өмнөх түвшний дүрэм/үгийг ашиглана. */
  paragraphs: z.array(z.string().min(1)).min(1),
  /** Бүтэн орчуулга — сурагч эхлээд өөрөө уншсаны дараа харна. */
  translationMn: z.array(z.string().min(1)).min(1),
  wordCount: z.number().int().positive(),
  /** Шинэ буюу хэцүү үгсийн тайлбар. */
  glossary: z.array(
    z.object({ ko: z.string(), rom: z.string(), mn: z.string(), vocabId: z.string().optional() }),
  ).default([]),
  grammarIds: z.array(z.string()).default([]),
  comprehension: z.array(
    z.object({
      type: z.enum(['mcq', 'true-false', 'short-answer', 'inference', 'ordering']),
      questionMn: z.string(),
      questionKo: z.string().optional(),
      options: z.array(z.string()).default([]),
      answer: z.union([z.string(), z.number()]),
      explanationMn: z.string(),
    }),
  ).min(2),
  /** Уншлагын арга барилын зөвлөмж. */
  strategyMn: z.string().optional(),
  /** Хугацаатай уншихад зориулсан зорилтот хугацаа (секунд). */
  targetSeconds: z.number().int().positive().optional(),
})

/* -------------------------------------------------------------------------- */
/* 7. Файлын бүрхүүл / file envelopes                                          */
/* -------------------------------------------------------------------------- */

const envelope = <T extends z.ZodTypeAny>(items: T) =>
  z.object({
    version: z.number().int().positive(),
    /** Хэрэв файл нэг түвшинд хамаарах бол. */
    levelId: LevelId.optional(),
    generatedBy: z.string().optional(),
    items: z.array(items),
  })

export const GrammarFile = envelope(GrammarPoint)
export const VocabFile = envelope(VocabEntry)
export const HanjaFile = envelope(HanjaMorpheme)
export const DialogueFile = envelope(Dialogue)
export const ReadingFile = envelope(Reading)
export const JamoFile = envelope(Jamo)
export const BatchimFile = envelope(Batchim)
export const SoundChangeFile = envelope(SoundChange)
export const VocabDomainFile = envelope(VocabDomain)

/* -------------------------------------------------------------------------- */
/* Type exports                                                                */
/* -------------------------------------------------------------------------- */

export type L10n = z.infer<typeof L10n>
export type LevelId = z.infer<typeof LevelId>
export type UnitId = z.infer<typeof UnitId>
export type SpeechLevel = z.infer<typeof SpeechLevel>
export type Pos = z.infer<typeof Pos>
export type WordOrigin = z.infer<typeof WordOrigin>
export type Irregular = z.infer<typeof Irregular>
export type ExerciseType = z.infer<typeof ExerciseType>
export type TextType = z.infer<typeof TextType>
export type Example = z.infer<typeof Example>
export type Level = z.infer<typeof Level>
export type Unit = z.infer<typeof Unit>
export type Curriculum = z.infer<typeof Curriculum>
export type Jamo = z.infer<typeof Jamo>
export type Batchim = z.infer<typeof Batchim>
export type SoundChange = z.infer<typeof SoundChange>
export type GrammarPoint = z.infer<typeof GrammarPoint>
export type VocabEntry = z.infer<typeof VocabEntry>
export type VocabDomain = z.infer<typeof VocabDomain>
export type HanjaMorpheme = z.infer<typeof HanjaMorpheme>
export type Dialogue = z.infer<typeof Dialogue>
export type Reading = z.infer<typeof Reading>
