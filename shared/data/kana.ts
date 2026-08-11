/**
 * The complete kana inventory: hiragana + katakana, with Hepburn romaji and a
 * Mongolian Cyrillic transliteration for every syllable.
 *
 * This is hand-authored source-of-truth data. The ETL (`scripts/etl/kana.ts`)
 * reads it, joins stroke-path data from KanjiVG, and emits the `kana` table.
 * Stroke counts are deliberately NOT stored here — they are derived from
 * KanjiVG so the two can never disagree.
 *
 * Cyrillic transliteration follows the convention used in Mongolian-language
 * Japanese textbooks: し→ши, じ→жи, ち→чи, つ→цу, ふ→фу, ざ→дза, and the
 * え-column takes э rather than е so it never softens the preceding consonant.
 */

export type KanaScript = 'hiragana' | 'katakana'

export type KanaKind =
  /** The 46 basic gojūon syllables. */
  | 'base'
  /** ゛dakuten voiced forms: が ざ だ ば. */
  | 'dakuten'
  /** ゜handakuten forms: ぱ. */
  | 'handakuten'
  /** Contracted yōon: きゃ しゅ ちょ … */
  | 'youon'
  /** Small kana used as modifiers: ぁ ゃ っ and the katakana long mark ー. */
  | 'small'
  /** Katakana-only combinations used to spell foreign loanwords: ファ ティ ヴ … */
  | 'extended'

export type Vowel = 'a' | 'i' | 'u' | 'e' | 'o' | 'n'

export interface KanaEntry {
  /** Stable slug, unique across the whole set. Also the audio/asset key. */
  readonly id: string
  readonly hiragana: string | null
  readonly katakana: string | null
  /** Modified Hepburn. */
  readonly romaji: string
  /** Mongolian Cyrillic transliteration. */
  readonly cyrillic: string
  readonly kind: KanaKind
  /** Consonant row of the gojūon grid: '' for the vowel row, then k s t n h m y r w. */
  readonly row: string
  readonly vowel: Vowel
  /** Teaching group. Lessons are built by walking these in ascending order. */
  readonly group: number
  /** For derived kana, the `id` of the kana it is built from. */
  readonly base?: string
}

/** Ordered teaching groups. `group` on a KanaEntry indexes into this. */
export const KANA_GROUPS = [
  { id: 1, label_mn: 'Эгшиг', title_mn: 'あ мөр — эгшгүүд' },
  { id: 2, label_mn: 'か мөр', title_mn: 'か мөр' },
  { id: 3, label_mn: 'さ мөр', title_mn: 'さ мөр' },
  { id: 4, label_mn: 'た мөр', title_mn: 'た мөр' },
  { id: 5, label_mn: 'な мөр', title_mn: 'な мөр' },
  { id: 6, label_mn: 'は мөр', title_mn: 'は мөр' },
  { id: 7, label_mn: 'ま мөр', title_mn: 'ま мөр' },
  { id: 8, label_mn: 'や мөр', title_mn: 'や мөр' },
  { id: 9, label_mn: 'ら мөр', title_mn: 'ら мөр' },
  { id: 10, label_mn: 'わ мөр ба ん', title_mn: 'わ мөр ба ん' },
  { id: 11, label_mn: 'Дакүтэн', title_mn: 'Дакүтэн ゛— が ざ だ ば' },
  { id: 12, label_mn: 'Хандакүтэн', title_mn: 'Хандакүтэн ゜— ぱ мөр' },
  { id: 13, label_mn: 'Ёо-он', title_mn: 'Ёо-он — жижиг ゃ ゅ ょ нийлмэл' },
  { id: 14, label_mn: 'Жижиг кана', title_mn: 'Жижиг кана ба сунгалт' },
  { id: 15, label_mn: 'Гадаад дуудлага', title_mn: 'Зээлдмэл үгийн катакана' },
] as const

/**
 * The 46 basic syllables in gojūon order.
 * Tuple shape: [id, hiragana, katakana, romaji, cyrillic, row, vowel, group]
 */
const BASE: ReadonlyArray<
  readonly [string, string, string, string, string, string, Vowel, number]
> = [
  ['a', 'あ', 'ア', 'a', 'а', '', 'a', 1],
  ['i', 'い', 'イ', 'i', 'и', '', 'i', 1],
  ['u', 'う', 'ウ', 'u', 'у', '', 'u', 1],
  ['e', 'え', 'エ', 'e', 'э', '', 'e', 1],
  ['o', 'お', 'オ', 'o', 'о', '', 'o', 1],

  ['ka', 'か', 'カ', 'ka', 'ка', 'k', 'a', 2],
  ['ki', 'き', 'キ', 'ki', 'ки', 'k', 'i', 2],
  ['ku', 'く', 'ク', 'ku', 'ку', 'k', 'u', 2],
  ['ke', 'け', 'ケ', 'ke', 'кэ', 'k', 'e', 2],
  ['ko', 'こ', 'コ', 'ko', 'ко', 'k', 'o', 2],

  ['sa', 'さ', 'サ', 'sa', 'са', 's', 'a', 3],
  ['shi', 'し', 'シ', 'shi', 'ши', 's', 'i', 3],
  ['su', 'す', 'ス', 'su', 'су', 's', 'u', 3],
  ['se', 'せ', 'セ', 'se', 'сэ', 's', 'e', 3],
  ['so', 'そ', 'ソ', 'so', 'со', 's', 'o', 3],

  ['ta', 'た', 'タ', 'ta', 'та', 't', 'a', 4],
  ['chi', 'ち', 'チ', 'chi', 'чи', 't', 'i', 4],
  ['tsu', 'つ', 'ツ', 'tsu', 'цу', 't', 'u', 4],
  ['te', 'て', 'テ', 'te', 'тэ', 't', 'e', 4],
  ['to', 'と', 'ト', 'to', 'то', 't', 'o', 4],

  ['na', 'な', 'ナ', 'na', 'на', 'n', 'a', 5],
  ['ni', 'に', 'ニ', 'ni', 'ни', 'n', 'i', 5],
  ['nu', 'ぬ', 'ヌ', 'nu', 'ну', 'n', 'u', 5],
  ['ne', 'ね', 'ネ', 'ne', 'нэ', 'n', 'e', 5],
  ['no', 'の', 'ノ', 'no', 'но', 'n', 'o', 5],

  ['ha', 'は', 'ハ', 'ha', 'ха', 'h', 'a', 6],
  ['hi', 'ひ', 'ヒ', 'hi', 'хи', 'h', 'i', 6],
  ['fu', 'ふ', 'フ', 'fu', 'фу', 'h', 'u', 6],
  ['he', 'へ', 'ヘ', 'he', 'хэ', 'h', 'e', 6],
  ['ho', 'ほ', 'ホ', 'ho', 'хо', 'h', 'o', 6],

  ['ma', 'ま', 'マ', 'ma', 'ма', 'm', 'a', 7],
  ['mi', 'み', 'ミ', 'mi', 'ми', 'm', 'i', 7],
  ['mu', 'む', 'ム', 'mu', 'му', 'm', 'u', 7],
  ['me', 'め', 'メ', 'me', 'мэ', 'm', 'e', 7],
  ['mo', 'も', 'モ', 'mo', 'мо', 'm', 'o', 7],

  ['ya', 'や', 'ヤ', 'ya', 'я', 'y', 'a', 8],
  ['yu', 'ゆ', 'ユ', 'yu', 'ю', 'y', 'u', 8],
  ['yo', 'よ', 'ヨ', 'yo', 'ё', 'y', 'o', 8],

  ['ra', 'ら', 'ラ', 'ra', 'ра', 'r', 'a', 9],
  ['ri', 'り', 'リ', 'ri', 'ри', 'r', 'i', 9],
  ['ru', 'る', 'ル', 'ru', 'ру', 'r', 'u', 9],
  ['re', 'れ', 'レ', 're', 'рэ', 'r', 'e', 9],
  ['ro', 'ろ', 'ロ', 'ro', 'ро', 'r', 'o', 9],

  ['wa', 'わ', 'ワ', 'wa', 'ва', 'w', 'a', 10],
  ['wo', 'を', 'ヲ', 'wo', 'о', 'w', 'o', 10],
  ['n', 'ん', 'ン', 'n', 'н', '', 'n', 10],
]

/**
 * Voiced and semi-voiced forms.
 * Tuple: [id, hiragana, katakana, romaji, cyrillic, row, vowel, kind, base]
 */
const VOICED: ReadonlyArray<
  readonly [string, string, string, string, string, string, Vowel, KanaKind, string]
> = [
  ['ga', 'が', 'ガ', 'ga', 'га', 'g', 'a', 'dakuten', 'ka'],
  ['gi', 'ぎ', 'ギ', 'gi', 'ги', 'g', 'i', 'dakuten', 'ki'],
  ['gu', 'ぐ', 'グ', 'gu', 'гу', 'g', 'u', 'dakuten', 'ku'],
  ['ge', 'げ', 'ゲ', 'ge', 'гэ', 'g', 'e', 'dakuten', 'ke'],
  ['go', 'ご', 'ゴ', 'go', 'го', 'g', 'o', 'dakuten', 'ko'],

  ['za', 'ざ', 'ザ', 'za', 'дза', 'z', 'a', 'dakuten', 'sa'],
  ['ji', 'じ', 'ジ', 'ji', 'жи', 'z', 'i', 'dakuten', 'shi'],
  ['zu', 'ず', 'ズ', 'zu', 'дзу', 'z', 'u', 'dakuten', 'su'],
  ['ze', 'ぜ', 'ゼ', 'ze', 'дзэ', 'z', 'e', 'dakuten', 'se'],
  ['zo', 'ぞ', 'ゾ', 'zo', 'дзо', 'z', 'o', 'dakuten', 'so'],

  ['da', 'だ', 'ダ', 'da', 'да', 'd', 'a', 'dakuten', 'ta'],
  ['dji', 'ぢ', 'ヂ', 'ji', 'жи', 'd', 'i', 'dakuten', 'chi'],
  ['dzu', 'づ', 'ヅ', 'zu', 'дзу', 'd', 'u', 'dakuten', 'tsu'],
  ['de', 'で', 'デ', 'de', 'дэ', 'd', 'e', 'dakuten', 'te'],
  ['do', 'ど', 'ド', 'do', 'до', 'd', 'o', 'dakuten', 'to'],

  ['ba', 'ば', 'バ', 'ba', 'ба', 'b', 'a', 'dakuten', 'ha'],
  ['bi', 'び', 'ビ', 'bi', 'би', 'b', 'i', 'dakuten', 'hi'],
  ['bu', 'ぶ', 'ブ', 'bu', 'бу', 'b', 'u', 'dakuten', 'fu'],
  ['be', 'べ', 'ベ', 'be', 'бэ', 'b', 'e', 'dakuten', 'he'],
  ['bo', 'ぼ', 'ボ', 'bo', 'бо', 'b', 'o', 'dakuten', 'ho'],

  ['pa', 'ぱ', 'パ', 'pa', 'па', 'p', 'a', 'handakuten', 'ha'],
  ['pi', 'ぴ', 'ピ', 'pi', 'пи', 'p', 'i', 'handakuten', 'hi'],
  ['pu', 'ぷ', 'プ', 'pu', 'пу', 'p', 'u', 'handakuten', 'fu'],
  ['pe', 'ぺ', 'ペ', 'pe', 'пэ', 'p', 'e', 'handakuten', 'he'],
  ['po', 'ぽ', 'ポ', 'po', 'по', 'p', 'o', 'handakuten', 'ho'],
]

/**
 * Yōon — a consonant kana in the -i column contracted with small ゃ/ゅ/ょ.
 * Tuple: [id, hiragana, katakana, romaji, cyrillic, row, vowel, base]
 */
const YOUON: ReadonlyArray<
  readonly [string, string, string, string, string, string, Vowel, string]
> = [
  ['kya', 'きゃ', 'キャ', 'kya', 'кя', 'k', 'a', 'ki'],
  ['kyu', 'きゅ', 'キュ', 'kyu', 'кю', 'k', 'u', 'ki'],
  ['kyo', 'きょ', 'キョ', 'kyo', 'кё', 'k', 'o', 'ki'],

  ['sha', 'しゃ', 'シャ', 'sha', 'ша', 's', 'a', 'shi'],
  ['shu', 'しゅ', 'シュ', 'shu', 'шу', 's', 'u', 'shi'],
  ['sho', 'しょ', 'ショ', 'sho', 'шо', 's', 'o', 'shi'],

  ['cha', 'ちゃ', 'チャ', 'cha', 'ча', 't', 'a', 'chi'],
  ['chu', 'ちゅ', 'チュ', 'chu', 'чу', 't', 'u', 'chi'],
  ['cho', 'ちょ', 'チョ', 'cho', 'чо', 't', 'o', 'chi'],

  ['nya', 'にゃ', 'ニャ', 'nya', 'ня', 'n', 'a', 'ni'],
  ['nyu', 'にゅ', 'ニュ', 'nyu', 'ню', 'n', 'u', 'ni'],
  ['nyo', 'にょ', 'ニョ', 'nyo', 'нё', 'n', 'o', 'ni'],

  ['hya', 'ひゃ', 'ヒャ', 'hya', 'хя', 'h', 'a', 'hi'],
  ['hyu', 'ひゅ', 'ヒュ', 'hyu', 'хю', 'h', 'u', 'hi'],
  ['hyo', 'ひょ', 'ヒョ', 'hyo', 'хё', 'h', 'o', 'hi'],

  ['mya', 'みゃ', 'ミャ', 'mya', 'мя', 'm', 'a', 'mi'],
  ['myu', 'みゅ', 'ミュ', 'myu', 'мю', 'm', 'u', 'mi'],
  ['myo', 'みょ', 'ミョ', 'myo', 'мё', 'm', 'o', 'mi'],

  ['rya', 'りゃ', 'リャ', 'rya', 'ря', 'r', 'a', 'ri'],
  ['ryu', 'りゅ', 'リュ', 'ryu', 'рю', 'r', 'u', 'ri'],
  ['ryo', 'りょ', 'リョ', 'ryo', 'рё', 'r', 'o', 'ri'],

  ['gya', 'ぎゃ', 'ギャ', 'gya', 'гя', 'g', 'a', 'gi'],
  ['gyu', 'ぎゅ', 'ギュ', 'gyu', 'гю', 'g', 'u', 'gi'],
  ['gyo', 'ぎょ', 'ギョ', 'gyo', 'гё', 'g', 'o', 'gi'],

  ['ja', 'じゃ', 'ジャ', 'ja', 'жа', 'z', 'a', 'ji'],
  ['ju', 'じゅ', 'ジュ', 'ju', 'жу', 'z', 'u', 'ji'],
  ['jo', 'じょ', 'ジョ', 'jo', 'жо', 'z', 'o', 'ji'],

  ['bya', 'びゃ', 'ビャ', 'bya', 'бя', 'b', 'a', 'bi'],
  ['byu', 'びゅ', 'ビュ', 'byu', 'бю', 'b', 'u', 'bi'],
  ['byo', 'びょ', 'ビョ', 'byo', 'бё', 'b', 'o', 'bi'],

  ['pya', 'ぴゃ', 'ピャ', 'pya', 'пя', 'p', 'a', 'pi'],
  ['pyu', 'ぴゅ', 'ピュ', 'pyu', 'пю', 'p', 'u', 'pi'],
  ['pyo', 'ぴょ', 'ピョ', 'pyo', 'пё', 'p', 'o', 'pi'],
]

/**
 * Small kana and the katakana長音 mark. These are not syllables in their own
 * right — they modify the syllable before them — so they carry no audio and
 * are taught as rules rather than as flashcards.
 * Tuple: [id, hiragana, katakana, romaji, cyrillic]
 */
const SMALL: ReadonlyArray<
  readonly [string, string | null, string | null, string, string]
> = [
  ['small-tsu', 'っ', 'ッ', '(sokuon)', 'давхар гийгүүлэгч'],
  ['small-ya', 'ゃ', 'ャ', 'ya', 'я'],
  ['small-yu', 'ゅ', 'ュ', 'yu', 'ю'],
  ['small-yo', 'ょ', 'ョ', 'yo', 'ё'],
  ['small-a', 'ぁ', 'ァ', 'a', 'а'],
  ['small-i', 'ぃ', 'ィ', 'i', 'и'],
  ['small-u', 'ぅ', 'ゥ', 'u', 'у'],
  ['small-e', 'ぇ', 'ェ', 'e', 'э'],
  ['small-o', 'ぉ', 'ォ', 'o', 'о'],
  ['chouon', null, 'ー', '(chōon)', 'сунгах тэмдэг'],
]

/**
 * Katakana-only spellings invented to write sounds Japanese does not natively
 * have. Learners meet these the moment they read a menu or a brand name, so
 * they ship as their own group rather than being left out.
 * Tuple: [id, katakana, romaji, cyrillic, example]
 */
const EXTENDED: ReadonlyArray<
  readonly [string, string, string, string, string]
> = [
  ['ext-fa', 'ファ', 'fa', 'фа', 'ファミリー'],
  ['ext-fi', 'フィ', 'fi', 'фи', 'フィルム'],
  ['ext-fe', 'フェ', 'fe', 'фэ', 'カフェ'],
  ['ext-fo', 'フォ', 'fo', 'фо', 'フォーク'],
  ['ext-vu', 'ヴ', 'vu', 'ву', 'ヴァイオリン'],
  ['ext-va', 'ヴァ', 'va', 'ва', 'ヴァニラ'],
  ['ext-ti', 'ティ', 'ti', 'ти', 'パーティー'],
  ['ext-di', 'ディ', 'di', 'ди', 'ディスク'],
  ['ext-tu', 'トゥ', 'tu', 'ту', 'トゥース'],
  ['ext-du', 'ドゥ', 'du', 'ду', 'ドゥ'],
  ['ext-she', 'シェ', 'she', 'шэ', 'シェフ'],
  ['ext-je', 'ジェ', 'je', 'жэ', 'ジェット'],
  ['ext-che', 'チェ', 'che', 'чэ', 'チェック'],
  ['ext-wi', 'ウィ', 'wi', 'ви', 'ウィスキー'],
  ['ext-we', 'ウェ', 'we', 'вэ', 'ウェブ'],
  ['ext-wo', 'ウォ', 'wo', 'во', 'ウォーター'],
]

function buildKana(): KanaEntry[] {
  const out: KanaEntry[] = []

  for (const [id, hiragana, katakana, romaji, cyrillic, row, vowel, group] of BASE) {
    out.push({ id, hiragana, katakana, romaji, cyrillic, kind: 'base', row, vowel, group })
  }
  for (const [id, hiragana, katakana, romaji, cyrillic, row, vowel, kind, base] of VOICED) {
    out.push({
      id,
      hiragana,
      katakana,
      romaji,
      cyrillic,
      kind,
      row,
      vowel,
      group: kind === 'handakuten' ? 12 : 11,
      base,
    })
  }
  for (const [id, hiragana, katakana, romaji, cyrillic, row, vowel, base] of YOUON) {
    out.push({ id, hiragana, katakana, romaji, cyrillic, kind: 'youon', row, vowel, group: 13, base })
  }
  for (const [id, hiragana, katakana, romaji, cyrillic] of SMALL) {
    out.push({
      id,
      hiragana,
      katakana,
      romaji,
      cyrillic,
      kind: 'small',
      row: '',
      vowel: 'a',
      group: 14,
    })
  }
  for (const [id, katakana, romaji, cyrillic] of EXTENDED) {
    out.push({
      id,
      hiragana: null,
      katakana,
      romaji,
      cyrillic,
      kind: 'extended',
      row: '',
      vowel: 'a',
      group: 15,
    })
  }

  return out
}

export const KANA: readonly KanaEntry[] = Object.freeze(buildKana())

/** Example loanword for each extended-katakana entry, keyed by entry id. */
export const EXTENDED_EXAMPLES: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(EXTENDED.map(([id, , , , example]) => [id, example])),
)

export const KANA_BY_ID: ReadonlyMap<string, KanaEntry> = new Map(KANA.map((k) => [k.id, k]))

/** Lookup by the literal character, for tokenising and for grading writing input. */
export const KANA_BY_CHAR: ReadonlyMap<string, KanaEntry> = new Map(
  KANA.flatMap((k) => {
    const pairs: Array<[string, KanaEntry]> = []
    if (k.hiragana) pairs.push([k.hiragana, k])
    if (k.katakana) pairs.push([k.katakana, k])
    return pairs
  }),
)

/** The 46 basic syllables only — what a beginner's first ten lessons cover. */
export const GOJUON: readonly KanaEntry[] = KANA.filter((k) => k.kind === 'base')

/**
 * Cards a learner actually studies. Small kana and the長音 mark are excluded:
 * they are rules, not syllables, and are taught inside the lesson that needs
 * them rather than drilled on their own.
 */
export const STUDIABLE_KANA: readonly KanaEntry[] = KANA.filter((k) => k.kind !== 'small')

export function kanaForScript(script: KanaScript): readonly KanaEntry[] {
  return KANA.filter((k) => (script === 'hiragana' ? k.hiragana : k.katakana) !== null)
}

/** The character a given entry is written with in the requested script. */
export function charOf(entry: KanaEntry, script: KanaScript): string | null {
  return script === 'hiragana' ? entry.hiragana : entry.katakana
}
