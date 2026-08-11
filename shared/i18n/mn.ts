/**
 * Mongolian (Cyrillic) message catalogue — the app's only shipping locale.
 *
 * Every user-visible string in the app comes from here. Nothing is hard-coded
 * in a component, so a second locale is a new file rather than a rewrite.
 *
 * Conventions:
 *  - Japanese terms keep their Japanese name transliterated into Cyrillic
 *    (хирагана, катакана, ханз, кана) — that is how they are taught in
 *    Mongolian classrooms.
 *  - Placeholders use {braces} and are substituted by `t()`.
 */
export const mn = {
  'app.name': 'Нихонго',
  'app.tagline': 'Япон хэлийг үнэгүй, эхнээс нь эмх цэгцтэй сур',
  'app.free': '100% үнэгүй',

  // ---- Navigation ----------------------------------------------------------
  'nav.home': 'Нүүр',
  'nav.learn': 'Суралцах',
  'nav.review': 'Давтлага',
  'nav.kana': 'Кана',
  'nav.vocabulary': 'Үгсийн сан',
  'nav.kanji': 'Ханз',
  'nav.stories': 'Өгүүллэг',
  'nav.progress': 'Ахиц',
  'nav.settings': 'Тохиргоо',
  'nav.about': 'Тухай',

  // ---- Shared controls -----------------------------------------------------
  'common.continue': 'Үргэлжлүүлэх',
  'common.back': 'Буцах',
  'common.next': 'Дараах',
  'common.previous': 'Өмнөх',
  'common.start': 'Эхлэх',
  'common.finish': 'Дуусгах',
  'common.retry': 'Дахин оролдох',
  'common.skip': 'Алгасах',
  'common.close': 'Хаах',
  'common.save': 'Хадгалах',
  'common.cancel': 'Цуцлах',
  'common.delete': 'Устгах',
  'common.loading': 'Ачааллаж байна…',
  'common.play': 'Сонсох',
  'common.replay': 'Дахин сонсох',
  'common.showAnswer': 'Хариуг харах',
  'common.dontKnow': 'Мэдэхгүй',
  'common.correct': 'Зөв',
  'common.incorrect': 'Буруу',
  'common.of': '{current} / {total}',

  // ---- Onboarding ----------------------------------------------------------
  'onboarding.welcome': 'Тавтай морил!',
  'onboarding.intro':
    'Хэдхэн асуултад хариулснаар бид танд тохирсон сургалтын замыг бэлдэнэ. Бүртгүүлэх шаардлагагүй — яг одоо эхэлж болно.',
  'onboarding.q.level': 'Та япон хэлний ямар түвшинд байна вэ?',
  'onboarding.level.zero': 'Огт мэдэхгүй',
  'onboarding.level.zeroHint': 'Хирагана-аас эхэлнэ',
  'onboarding.level.kana': 'Кана уншиж чадна',
  'onboarding.level.kanaHint': 'Үгсийн сан руу шууд шилжинэ',
  'onboarding.level.some': 'Зарим үг, ханз мэднэ',
  'onboarding.level.someHint': 'Түвшин тогтоох сорил өгнө',
  'onboarding.q.goal': 'Зорилго тань юу вэ?',
  'onboarding.goal.jlpt': 'JLPT шалгалт өгөх',
  'onboarding.goal.travel': 'Аялал, өдөр тутмын харилцаа',
  'onboarding.goal.work': 'Япон улсад ажиллах, суралцах',
  'onboarding.goal.media': 'Аниме, ном, кино ойлгох',
  'onboarding.q.pace': 'Өдөрт хэр их цаг гаргах вэ?',
  'onboarding.pace.light': 'Өдөрт 5–10 минут',
  'onboarding.pace.normal': 'Өдөрт 15–20 минут',
  'onboarding.pace.serious': 'Өдөрт 30-аас дээш минут',
  'onboarding.done': 'Бэлэн боллоо. Эхэлцгээе!',

  // ---- Kana ----------------------------------------------------------------
  'kana.hiragana': 'Хирагана',
  'kana.katakana': 'Катакана',
  'kana.chart': 'Кана хүснэгт',
  'kana.gojuon': 'Годзюон',
  'kana.strokeOrder': 'Бичих дараалал',
  'kana.writeIt': 'Бичиж дасгал хийх',
  'kana.listen': 'Сонсох дасгал',
  'kana.romaji': 'Ромажи',
  'kana.cyrillic': 'Кирилл галиг',
  'kana.reading': 'Дуудлага',
  'kana.kind.base': 'Үндсэн',
  'kana.kind.dakuten': 'Дакүтэн ゛',
  'kana.kind.handakuten': 'Хандакүтэн ゜',
  'kana.kind.youon': 'Ёо-он',
  'kana.kind.small': 'Жижиг кана',
  'kana.kind.extended': 'Зээлдмэл үгийн кана',
  'kana.whichScript': 'Аль үсгээр дасгал хийх вэ?',

  // ---- Lessons -------------------------------------------------------------
  'lesson.newCharacters': '{count} шинэ тэмдэгт',
  'lesson.newWords': '{count} шинэ үг',
  'lesson.complete': 'Хичээл дууслаа!',
  'lesson.completeBody': 'Та {count} зүйлийг үзлээ. Тэдгээр нь давтлагын жагсаалтад нэмэгдэв.',
  'lesson.locked': 'Түгжээтэй',
  'lesson.lockedHint': 'Өмнөх хичээлээ дуусгасны дараа нээгдэнэ',

  // ---- Review / SRS --------------------------------------------------------
  'review.title': 'Өнөөдрийн давтлага',
  'review.due': 'Давтах хугацаа болсон: {count}',
  'review.none': 'Одоогоор давтах зүйл алга. Сайн байна!',
  'review.nextDue': 'Дараагийн давтлага: {when}',
  'review.again': 'Дахин',
  'review.hard': 'Хэцүү',
  'review.good': 'Сайн',
  'review.easy': 'Амархан',
  'review.againHint': 'Огт санасангүй',
  'review.hardHint': 'Санахад хэцүү байсан',
  'review.goodHint': 'Санаж чадсан',
  'review.easyHint': 'Шууд санасан',
  'review.sessionDone': 'Давтлага дууслаа',
  'review.accuracy': 'Нарийвчлал: {percent}%',

  // ---- Writing practice ----------------------------------------------------
  'writing.clear': 'Арилгах',
  'writing.undo': 'Нэг зурлага буцаах',
  'writing.check': 'Шалгах',
  'writing.showHint': 'Заавар харуулах',
  'writing.hideHint': 'Заавар нуух',
  'writing.traceMode': 'Дагаж зурах',
  'writing.freeMode': 'Бие даан бичих',
  'writing.strokeCount': 'Зурлагын тоо: {count}',
  'writing.strokeOf': '{current}-р зурлага / нийт {total}',
  'writing.wrongStroke': 'Энэ зурлага таарахгүй байна. Дахин оролдоно уу.',
  'writing.wrongOrder': 'Зурлагын дараалал буруу байна.',
  'writing.wrongDirection': 'Зурлагыг эсрэг чиглэлд зуржээ.',
  'writing.tooShort': 'Зурлага хэтэрхий богино байна.',
  'writing.good': 'Сайн бичлээ!',
  'writing.perfect': 'Төгс!',

  // ---- Quiz / exercises ----------------------------------------------------
  'quiz.chooseReading': 'Энэ тэмдэгт хэрхэн дуудагдах вэ?',
  'quiz.chooseCharacter': '«{reading}» гэж дуудагддаг тэмдэгтийг сонго',
  'quiz.chooseMeaning': 'Энэ үгийн утга юу вэ?',
  'quiz.typeReading': 'Дуудлагыг нь бичнэ үү',
  'quiz.typePlaceholder': 'Ромажи эсвэл кана-аар бичнэ үү',
  'quiz.listenAndType': 'Сонсоод бичнэ үү',
  'quiz.fillBlank': 'Хоосон зайг нөх',
  'quiz.answerWas': 'Зөв хариу: {answer}',

  // ---- Progress ------------------------------------------------------------
  'progress.title': 'Таны ахиц',
  'progress.streak': '{count} өдрийн цуваа',
  'progress.streakToday': 'Өнөөдрийн зорилтоо биелүүл!',
  'progress.learned': 'Сурсан',
  'progress.learning': 'Сурч байгаа',
  'progress.notStarted': 'Эхлээгүй',
  'progress.mastered': 'Эзэмшсэн',
  'progress.dailyGoal': 'Өдрийн зорилт: {done} / {goal}',
  'progress.totalReviews': 'Нийт давталт: {count}',

  // ---- Settings ------------------------------------------------------------
  'settings.title': 'Тохиргоо',
  'settings.script': 'Аль үсгээр сурах вэ',
  'settings.showRomaji': 'Ромажи харуулах',
  'settings.showCyrillic': 'Кирилл галиг харуулах',
  'settings.autoplayAudio': 'Дууг автоматаар тоглуулах',
  'settings.dailyGoal': 'Өдрийн зорилт',
  'settings.newPerDay': 'Өдөрт үзэх шинэ зүйлийн тоо',
  'settings.resetProgress': 'Ахицыг устгах',
  'settings.resetConfirm': 'Таны бүх ахиц устана. Энэ үйлдлийг буцаах боломжгүй. Итгэлтэй байна уу?',
  'settings.exportData': 'Өгөгдлөө татах',
  'settings.deleteAccount': 'Бүртгэлээ устгах',

  // ---- Account -------------------------------------------------------------
  'account.anonymous': 'Зочин',
  'account.signUpPrompt':
    'Ахицаа бусад төхөөрөмж дээрээ үргэлжлүүлэхийг хүсвэл бүртгүүлээрэй. Заавал биш — одоо байгаа ахиц тань хадгалагдана.',
  'account.signUp': 'Бүртгүүлэх',
  'account.signIn': 'Нэвтрэх',
  'account.signOut': 'Гарах',
  'account.email': 'И-мэйл',
  'account.password': 'Нууц үг',
  'account.syncing': 'Синк хийж байна…',
  'account.syncedAt': 'Сүүлд синк хийсэн: {when}',

  // ---- Connectivity & errors ----------------------------------------------
  'offline.title': 'Интернэт холболт алга',
  'offline.body':
    'Санаа зоволтгүй — сурсан зүйлээ офлайн үргэлжлүүлэн давтаж болно. Холбогдмогц ахиц тань автоматаар синк болно.',
  'offline.badge': 'Офлайн',
  'error.generic': 'Алдаа гарлаа. Дахин оролдоно уу.',
  'error.notFound': 'Хуудас олдсонгүй.',
  'error.audioFailed': 'Дууг тоглуулж чадсангүй.',

  // ---- About / attribution -------------------------------------------------
  'about.title': 'Тухай',
  'about.mission':
    'Энэ платформ нь япон хэл сурахыг хүсэж байгаа ч хаанаас эхлэхээ мэдэхгүй байгаа хүмүүст зориулагдсан. Сурагчдаас хэзээ ч төлбөр авахгүй.',
  'attribution.title': 'Эх сурвалж ба лиценз',
  'attribution.intro': 'Энэ платформ дараах нээлттэй өгөгдлийн сан дээр тулгуурладаг:',
} as const

export type MessageKey = keyof typeof mn
