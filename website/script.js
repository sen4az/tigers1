/* ============================================================
   TIGERS ONE EXCHANGE — script.js
   ------------------------------------------------------------
   Vanilla JS. No dependencies. Respects prefers-reduced-motion.
   ------------------------------------------------------------
   API integration notes (live rates):
     Replace the static `placeholder` rate fields below with a
     fetch() call to your price feed (e.g. XE, OANDA, internal
     TX1 endpoint). Suggested polling: 5s for visible cards,
     pause when document.hidden. Use the
     renderCurrencyGrid(currencyData) function as the hook.
   ============================================================ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     1. STICKY HEADER — adds .is-scrolled past 40px
     ------------------------------------------------------------ */
  const header = document.getElementById('siteHeader');
  let scrollPending = false;
  function onScroll() {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle('is-scrolled', y > 4);
      scrollPending = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ------------------------------------------------------------
     1b. LANGUAGE SWITCHER
     ------------------------------------------------------------ */
  const langSwitcher = document.getElementById('langSwitcher');
  const langDropdown = document.getElementById('langDropdown');
  const langFlag = document.getElementById('langFlag');
  const langCode = document.getElementById('langCode');

  /* ----------------------------------------------------------
     i18n DICTIONARY  (EN / RU / TH)
     ---------------------------------------------------------- */
  const I18N = {
    en: {
      'nav.exchange':'Exchange', 'nav.settlement':'Settlement', 'nav.offices':'Offices', 'nav.contact':'Contact',
      'hero.title1':'Currency & crypto exchange',
      'hero.title2':'with the strength of a tiger.',
      'hero.licensed':'✦ Licensed exchange in Thailand since 2019 ✦',
      'conv.fiat':'Fiat', 'conv.crypto':'Crypto',
      'conv.send':'You send', 'conv.receive':'You receive',
      'conv.market':'Market rate', 'conv.commission':'Commission', 'conv.yourrate':'Your rate',
      'conv.weaccept':'We accept', 'conv.live':'Live',
      'rates.title':'Live market rates.',
      'rates.currencies':'Currencies', 'rates.crypto':'Cryptocurrencies',
      'rates.search':'Search currency…',
      'rates.col.currency':'Currency', 'rates.col.7d':'7d', 'rates.col.24h':'24h',
      'rates.note':'Indicative market prices · for reference only.',
      'settle.eyebrow':'How You Receive',
      'settle.title1':'Four ways to settle.',
      'settle.title2':'One standard of discretion.',
      'settle.lede':'From private office collection to same-day international wire, every settlement is handled by a dedicated specialist — with the method, timing, and threshold made clear before you commit.',
      'settle.office.title':'Private Office Collection',
      'settle.courier.title':'Secure Courier',
      'settle.wire.title':'Same-Day Bank Wire',
      'settle.office.cta':'Arrange collection ',
      'settle.courier.cta':'Request a courier ',
      'settle.wire.cta':'Settle by wire ',
      'settle.foot':'Cash settlement is subject to office availability. Online rates are confirmed by your specialist within three minutes.',
      'why.title1':'Designed around',
      'why.title2':'your privacy and pace.',
      'why.privacy.title':'Sign-up is not required',
      'why.privacy.body':"Exchange currency and crypto without registration. Your identity stays with you — we only need what's necessary to settle.",
      'why.choice.title':'50+ currencies & crypto',
      'why.choice.body':'Major fiat pairs, regional currencies, and leading digital assets — all settled at competitive, transparent rates.',
      'why.support.title':"You won't be left alone",
      'why.support.body':'A dedicated specialist available around the clock by Telegram, WhatsApp, or phone — from first quote to final settlement.',
      'why.security.title':'Discreet by design',
      'why.security.body':'Private settlement rooms, vetted couriers, and direct-to-account transfers. Every transaction handled with absolute discretion.',
      'why.eyebrow.privacy':'Privacy', 'why.eyebrow.choice':'Wide choice',
      'why.eyebrow.support':'24/7 Support', 'why.eyebrow.security':'Security',
      'contact.eyebrow':'Get in Touch',
      'contact.title':'Begin a conversation.',
      'contact.lede':'Speak directly with a senior specialist. No obligation, complete discretion.',
      // Offices
      'offices.eyebrow':'Find Us',
      'offices.title1':'Three addresses',
      'offices.title2':'across the Kingdom.',
      'offices.phuket.tag':'Andaman Coast',
      'offices.bkk.tag':'The Capital',
      'offices.pty.tag':'Gulf of Thailand',
      'offices.address':'Address',
      'offices.hours':'Hours',
      'offices.contact':'Contact',
      // Settlement meta
      'settle.office.tag':'By appointment',
      'settle.courier.tag':'Hotel · villa · estate',
      'settle.wire.tag':'Thai & international',
      'settle.meta.timing':'Timing',
      'settle.meta.commission':'Commission',
      'settle.meta.bestfor':'Best for',
      'settle.meta.discretion':'Discretion',
      'settle.office.timing':'5–15 minutes',
      'settle.office.fee':'Lowest — set in rate',
      'settle.office.best':'Large cash sums, in person',
      'settle.office.disc':'Private consultation room',
      'settle.courier.timing':'1 hour – same day',
      'settle.courier.fee':'By amount & distance',
      'settle.courier.best':'Remote areas, residences',
      'settle.courier.disc':'Vetted, insured carrier',
      'settle.wire.timing':'Same day – 24h',
      'settle.wire.fee':'Minimal, transparent',
      'settle.wire.best':'Rent, property, long stays',
      'settle.wire.disc':'Direct to your account',
      // Client profiles
      'clients.eyebrow':'Client Profiles',
      'clients.title1':'Built for you.',
      'clients.title2':'',
      'clients.prop.title':'Property Investors',
      'clients.prop.body':'Time your purchase. Optimise your exchange. Comply with FET requirements — handled by specialists who close Thai property transactions every week.',
      'clients.prop.link':'Property currency desk ',
      'clients.exp.title':'Retirees & Expats',
      'clients.exp.body':'Pension transfers, retirement income, lifestyle funding. A discreet, recurring service that quietly adds basis points back to every payment.',
      'clients.exp.link':'Lifestyle services ',
      'clients.fam.title':'Family Offices',
      'clients.fam.body':'Cross-border wealth movement, hedging strategies, and discrete execution at institutional size. Single point of contact, full audit trail.',
      'clients.fam.link':'Institutional desk ',
      // Footer
      'footer.tagline':'The private home of currency in Thailand.',
      'footer.services':'Services','footer.resources':'Resources','footer.company':'Company','footer.legal':'Legal',
      'footer.insights':'Insights','footer.propguides':'Property Guides','footer.fet':'FET Form Handbook','footer.faq':'FAQ',
      'footer.privacy':'Privacy Policy','footer.terms':'Terms of Service','footer.risk':'Risk Disclosure','footer.complaints':'Complaints','footer.banks':'We work with',
      // Trust strip
      'trust.clients':'clients served',
      'trust.tx':'transactions completed',
      'trust.since':'Since 2019','trust.years':'years of service',
      'trust.offices':'licensed offices',
      'trust.lic.num':'License №THXX-2019','trust.lic':'Thai-licensed exchange',
      'trust.iso':'information security',
      'trust.ins.num':'Fully insured','trust.ins':'cash & courier coverage',
      // Referral
      'ref.eyebrow':'Referral Program',
      'ref.title1':'Refer clients.',
      'ref.title2':'Earn for life.',
      'ref.lede':'Introduce someone who exchanges with us, and earn a share of every commission they generate — for as long as they remain a client. No caps, no expiry.',
      'ref.cta':'Become a partner',
      'ref.reward.label':'Earn',
      'ref.reward.headline':'Passive income',
      'ref.reward.sub':'for every client you refer',
      'ref.step1.title':'Share your link',
      'ref.step1.body':'We generate a unique referral code linked to your account.',
      'ref.step2.title':'They exchange',
      'ref.step2.body':'Your referral completes an exchange — fiat or crypto, any amount.',
      'ref.step3.title':'You earn — for life',
      'ref.step3.body':'Receive a share of every commission they pay, paid in your preferred currency.',
      // FAQ
      'faq.eyebrow':'Frequently Asked',
      'faq.title1':'Answers to common',
      'faq.title2':'questions.',
      'faq.q1':'How does the exchange work?',
      'faq.a1':'Open the converter on the main page, select your currencies and amount, then confirm via Telegram or WhatsApp. A senior specialist will lock your rate and arrange settlement — by office collection, secure courier, or same-day bank wire.',
      'faq.q2':'Is verification required?',
      'faq.a2':"Yes, for larger transactions or wire settlements. Verification protects both parties and meets Thai regulatory standards. It's handled discreetly by your specialist — never on a public form.",
      'faq.q3':'Which currencies do you exchange?',
      'faq.a3':'Major pairs (USD, EUR, GBP, RUB, CNY, AED, SGD, CHF, JPY, AUD, HKD, KZT), Thai Baht, and leading cryptocurrencies (BTC, ETH, USDT, USDC, BNB, SOL, XRP, TON, DOGE). Live rates are shown on the main page.',
      'faq.q4':'Which US dollar bills do you accept?',
      'faq.a4':'USD bills issued before 1996, damaged, or heavily soiled notes are not accepted by Thai exchange standards. Please confirm with your specialist before settlement to avoid surprises.',
      'faq.q5':'Are there hidden fees?',
      'faq.a5':'No. A single, transparent commission is shown in the converter before you confirm. Our rates typically beat banks and standard exchange offices, with no surcharges added later.',
      'faq.q6':'How do you handle large transactions?',
      'faq.a6':'We hold substantial reserves and can settle eight-figure tickets. For large or recurring transactions, a senior specialist will prepare a personalised offer and secure settlement plan.',
      'faq.q7':'How are transactions secured?',
      'faq.a7':'Every transaction is handled by a verified specialist over Telegram or WhatsApp with documented terms before settlement. Cash and courier deliveries are insured. We are a Thai-licensed exchange operating under full AML standards.',
      'faq.q8':'Where are your offices?',
      'faq.a8':'Three locations across Thailand: Bangkok (Sukhumvit District), Phuket (Patong Beach Road), and Pattaya (Beach Road, Central). All open 09:00–21:00 daily, by appointment for private settlements.'
    },
    ru: {
      'nav.exchange':'Обмен', 'nav.settlement':'Получение', 'nav.offices':'Офисы', 'nav.contact':'Контакты',
      'hero.title1':'Обмен валют и криптовалют',
      'hero.title2':'с силой тигра.',
      'hero.licensed':'✦ Лицензированный обменник в Таиланде с 2019 ✦',
      'conv.fiat':'Фиат', 'conv.crypto':'Криптовалюта',
      'conv.send':'Вы отдаёте', 'conv.receive':'Вы получаете',
      'conv.market':'Рыночный курс', 'conv.commission':'Комиссия', 'conv.yourrate':'Ваш курс',
      'conv.weaccept':'Мы принимаем', 'conv.live':'Онлайн',
      'rates.title':'Курсы валют в реальном времени.',
      'rates.currencies':'Валюты', 'rates.crypto':'Криптовалюты',
      'rates.search':'Поиск валюты…',
      'rates.col.currency':'Валюта', 'rates.col.7d':'7д', 'rates.col.24h':'24ч',
      'rates.note':'Ориентировочные рыночные цены · только для справки.',
      'settle.eyebrow':'Как получить',
      'settle.title1':'Четыре способа получения.',
      'settle.title2':'Один уровень конфиденциальности.',
      'settle.lede':'От получения в частном офисе до международного банковского перевода в тот же день — каждая операция сопровождается персональным менеджером, с заранее известными условиями, временем и лимитами.',
      'settle.office.title':'Получение в офисе',
      'settle.courier.title':'Доставка курьером',
      'settle.wire.title':'Банковский перевод',
      'settle.office.cta':'Записаться ',
      'settle.courier.cta':'Заказать курьера ',
      'settle.wire.cta':'Перевод на счёт ',
      'settle.foot':'Получение наличными зависит от наличия в офисе. Онлайн-курсы подтверждаются менеджером в течение трёх минут.',
      'why.title1':'Создано для',
      'why.title2':'вашей приватности и удобства.',
      'why.privacy.title':'Регистрация не требуется',
      'why.privacy.body':'Обменивайте валюту и крипту без регистрации. Ваши данные остаются с вами — мы запрашиваем только необходимое для проведения операции.',
      'why.choice.title':'50+ валют и криптовалют',
      'why.choice.body':'Основные валютные пары, региональные валюты и ведущие цифровые активы — всё по конкурентным и прозрачным курсам.',
      'why.support.title':'Мы всегда на связи',
      'why.support.body':'Персональный менеджер доступен круглосуточно в Telegram, WhatsApp или по телефону — от первой котировки до финального расчёта.',
      'why.security.title':'Полная конфиденциальность',
      'why.security.body':'Отдельные переговорные комнаты, проверенные курьеры и прямые переводы на счёт. Каждая сделка обрабатывается с абсолютной приватностью.',
      'why.eyebrow.privacy':'Приватность', 'why.eyebrow.choice':'Широкий выбор',
      'why.eyebrow.support':'Поддержка 24/7', 'why.eyebrow.security':'Безопасность',
      'contact.eyebrow':'Свяжитесь с нами',
      'contact.title':'Начните диалог.',
      'contact.lede':'Говорите напрямую со старшим специалистом. Без обязательств, полная конфиденциальность.',
      'offices.eyebrow':'Наши офисы',
      'offices.title1':'Три офиса',
      'offices.title2':'по всему Таиланду.',
      'offices.phuket.tag':'Андаманское побережье',
      'offices.bkk.tag':'Столица',
      'offices.pty.tag':'Сиамский залив',
      'offices.address':'Адрес','offices.hours':'Часы работы','offices.contact':'Контакты',
      'settle.office.tag':'По записи',
      'settle.courier.tag':'Отель · вилла · резиденция',
      'settle.wire.tag':'По Таиланду и международно',
      'settle.meta.timing':'Время',
      'settle.meta.commission':'Комиссия',
      'settle.meta.bestfor':'Лучше всего для',
      'settle.meta.discretion':'Конфиденциальность',
      'settle.office.timing':'5–15 минут',
      'settle.office.fee':'Минимальная — включена в курс',
      'settle.office.best':'Крупные суммы наличными, лично',
      'settle.office.disc':'Отдельная переговорная',
      'settle.courier.timing':'1 час – тот же день',
      'settle.courier.fee':'По сумме и расстоянию',
      'settle.courier.best':'Удалённые районы, резиденции',
      'settle.courier.disc':'Проверенный, застрахованный курьер',
      'settle.wire.timing':'Тот же день – 24 часа',
      'settle.wire.fee':'Минимальная, прозрачная',
      'settle.wire.best':'Аренда, недвижимость, длительное пребывание',
      'settle.wire.disc':'Прямо на ваш счёт',
      'clients.eyebrow':'Профили клиентов',
      'clients.title1':'Создано для вас.',
      'clients.title2':'',
      'clients.prop.title':'Инвесторы в недвижимость',
      'clients.prop.body':'Подберите момент покупки. Оптимизируйте обмен. Выполните требования FET — всё сопровождают специалисты, ежедневно закрывающие сделки с недвижимостью в Таиланде.',
      'clients.prop.link':'Отдел недвижимости ',
      'clients.exp.title':'Пенсионеры и экспаты',
      'clients.exp.body':'Пенсионные переводы, регулярный доход, финансирование образа жизни. Дискретный регулярный сервис, который возвращает дополнительные проценты с каждого платежа.',
      'clients.exp.link':'Сервис для жизни ',
      'clients.fam.title':'Семейные офисы',
      'clients.fam.body':'Международное перемещение капитала, стратегии хеджирования и дискретное исполнение крупных сделок. Один контакт, полная отчётность.',
      'clients.fam.link':'Институциональный отдел ',
      'footer.tagline':'Частный обменный дом валюты в Таиланде.',
      'footer.services':'Сервисы','footer.resources':'Ресурсы','footer.company':'Компания','footer.legal':'Документы',
      'footer.insights':'Аналитика','footer.propguides':'Гайды по недвижимости','footer.fet':'Справочник FET','footer.faq':'Вопросы и ответы',
      'footer.privacy':'Политика конфиденциальности','footer.terms':'Условия использования','footer.risk':'Раскрытие рисков','footer.complaints':'Жалобы','footer.banks':'Мы работаем с',
      'trust.clients':'клиентов',
      'trust.tx':'транзакций выполнено',
      'trust.since':'С 2019','trust.years':'лет на рынке',
      'trust.offices':'лицензированных офисов',
      'trust.lic.num':'Лицензия №THXX-2019','trust.lic':'обменник с тайской лицензией',
      'trust.iso':'информационная безопасность',
      'trust.ins.num':'Полная страховка','trust.ins':'наличные и курьерская доставка',
      'ref.eyebrow':'Партнёрская программа',
      'ref.title1':'Приводите клиентов.',
      'ref.title2':'Зарабатывайте пожизненно.',
      'ref.lede':'Приведите того, кто обменяется у нас, и получайте долю с каждой комиссии — пока он остаётся клиентом. Без ограничений, без срока.',
      'ref.cta':'Стать партнёром',
      'ref.reward.label':'Получайте',
      'ref.reward.headline':'Пассивный доход',
      'ref.reward.sub':'с каждого приведённого клиента',
      'ref.step1.title':'Поделитесь ссылкой',
      'ref.step1.body':'Мы создаём уникальный реферальный код, привязанный к вашему аккаунту.',
      'ref.step2.title':'Они обмениваются',
      'ref.step2.body':'Ваш реферал совершает обмен — фиат или крипта, любая сумма.',
      'ref.step3.title':'Вы получаете — пожизненно',
      'ref.step3.body':'Получайте долю с каждой комиссии, выплачивается в выбранной вами валюте.',
      'faq.eyebrow':'Часто задаваемые',
      'faq.title1':'Ответы на популярные',
      'faq.title2':'вопросы.',
      'faq.q1':'Как происходит обмен?',
      'faq.a1':'Откройте калькулятор на главной странице, выберите валюты и сумму, затем подтвердите через Telegram или WhatsApp. Старший специалист зафиксирует курс и организует получение — в офисе, через защищённого курьера или банковским переводом в тот же день.',
      'faq.q2':'Нужна ли верификация?',
      'faq.a2':'Да, для крупных операций и банковских переводов. Верификация защищает обе стороны и соответствует тайским нормам. Всё проходит конфиденциально через вашего менеджера — без публичных форм.',
      'faq.q3':'С какими валютами вы работаете?',
      'faq.a3':'Основные пары (USD, EUR, GBP, RUB, CNY, AED, SGD, CHF, JPY, AUD, HKD, KZT), тайский бат и ведущие криптовалюты (BTC, ETH, USDT, USDC, BNB, SOL, XRP, TON, DOGE). Актуальные курсы — на главной странице.',
      'faq.q4':'Какие долларовые купюры принимаются?',
      'faq.a4':'Купюры USD, выпущенные до 1996 года, а также повреждённые или сильно загрязнённые банкноты не принимаются по тайским стандартам. Уточните у менеджера перед сделкой.',
      'faq.q5':'Есть ли скрытые комиссии?',
      'faq.a5':'Нет. Единая прозрачная комиссия отображается в калькуляторе перед подтверждением. Наши курсы обычно лучше банковских и не имеют скрытых надбавок.',
      'faq.q6':'Как обрабатываются крупные операции?',
      'faq.a6':'У нас значительные резервы — мы проводим сделки до восьмизначных сумм. Для крупных или регулярных операций менеджер подготовит индивидуальное предложение и план безопасного расчёта.',
      'faq.q7':'Как обеспечивается безопасность сделки?',
      'faq.a7':'Каждая операция ведётся проверенным менеджером через Telegram или WhatsApp, с задокументированными условиями. Наличные и курьерская доставка застрахованы. Мы — лицензированный обменник в Таиланде, работающий по AML-стандартам.',
      'faq.q8':'Где находятся ваши офисы?',
      'faq.a8':'Три офиса по Таиланду: Бангкок (район Сухумвит), Пхукет (Patong Beach Road) и Паттайя (Beach Road, Central). Все открыты ежедневно с 09:00 до 21:00, для частных операций — по записи.'
    },
    th: {
      'nav.exchange':'แลกเปลี่ยน', 'nav.settlement':'การรับเงิน', 'nav.offices':'สำนักงาน', 'nav.contact':'ติดต่อ',
      'hero.title1':'แลกเปลี่ยนเงินตราและคริปโต',
      'hero.title2':'ด้วยพลังแห่งเสือ',
      'hero.licensed':'✦ ผู้ให้บริการแลกเปลี่ยนได้รับใบอนุญาตในไทยตั้งแต่ปี 2019 ✦',
      'conv.fiat':'เงินสด', 'conv.crypto':'คริปโต',
      'conv.send':'คุณจ่าย', 'conv.receive':'คุณได้รับ',
      'conv.market':'ราคาตลาด', 'conv.commission':'ค่าธรรมเนียม', 'conv.yourrate':'อัตราของคุณ',
      'conv.weaccept':'เรารับ', 'conv.live':'สด',
      'rates.title':'อัตราตลาดแบบเรียลไทม์',
      'rates.currencies':'สกุลเงิน', 'rates.crypto':'คริปโตเคอเรนซี',
      'rates.search':'ค้นหาสกุลเงิน…',
      'rates.col.currency':'สกุลเงิน', 'rates.col.7d':'7 วัน', 'rates.col.24h':'24 ชม.',
      'rates.note':'ราคาตลาดโดยประมาณ · สำหรับอ้างอิงเท่านั้น',
      'settle.eyebrow':'วิธีรับเงิน',
      'settle.title1':'สี่วิธีในการรับเงิน',
      'settle.title2':'มาตรฐานเดียวกัน — ความเป็นส่วนตัวสูงสุด',
      'settle.lede':'ตั้งแต่การรับเงินที่สำนักงานส่วนตัวจนถึงการโอนเงินระหว่างประเทศในวันเดียวกัน ทุกธุรกรรมดูแลโดยผู้เชี่ยวชาญส่วนตัว พร้อมแจ้งวิธี เวลา และเงื่อนไขก่อนการยืนยัน',
      'settle.office.title':'รับที่สำนักงานส่วนตัว',
      'settle.courier.title':'จัดส่งโดยพนักงานส่ง',
      'settle.wire.title':'โอนผ่านธนาคารวันเดียวกัน',
      'settle.office.cta':'นัดหมายรับเงิน ',
      'settle.courier.cta':'เรียกพนักงานส่ง ',
      'settle.wire.cta':'โอนเข้าบัญชี ',
      'settle.foot':'การรับเงินสดขึ้นอยู่กับสำนักงาน อัตราออนไลน์จะได้รับการยืนยันโดยผู้เชี่ยวชาญภายใน 3 นาที',
      'why.title1':'ออกแบบเพื่อ',
      'why.title2':'ความเป็นส่วนตัวและความสะดวกของคุณ',
      'why.privacy.title':'ไม่ต้องสมัครสมาชิก',
      'why.privacy.body':'แลกเปลี่ยนสกุลเงินและคริปโตโดยไม่ต้องลงทะเบียน ข้อมูลของคุณยังคงเป็นของคุณ — เราขอเพียงข้อมูลที่จำเป็นเท่านั้น',
      'why.choice.title':'50+ สกุลเงินและคริปโต',
      'why.choice.body':'คู่สกุลเงินหลัก สกุลเงินภูมิภาค และสินทรัพย์ดิจิทัลชั้นนำ — ทั้งหมดในอัตราที่แข่งขันได้และโปร่งใส',
      'why.support.title':'คุณจะไม่ถูกทิ้งไว้คนเดียว',
      'why.support.body':'ผู้เชี่ยวชาญส่วนตัวพร้อมให้บริการตลอด 24 ชั่วโมงผ่าน Telegram, WhatsApp หรือโทรศัพท์ ตั้งแต่การเสนอราคาจนถึงการชำระเงินสุดท้าย',
      'why.security.title':'ความเป็นส่วนตัวสูงสุด',
      'why.security.body':'ห้องชำระเงินส่วนตัว พนักงานส่งที่ได้รับการตรวจสอบ และการโอนตรงเข้าบัญชี ทุกธุรกรรมจัดการด้วยความเป็นส่วนตัวอย่างสมบูรณ์',
      'why.eyebrow.privacy':'ความเป็นส่วนตัว', 'why.eyebrow.choice':'หลากหลาย',
      'why.eyebrow.support':'บริการ 24/7', 'why.eyebrow.security':'ความปลอดภัย',
      'contact.eyebrow':'ติดต่อเรา',
      'contact.title':'เริ่มต้นการสนทนา',
      'contact.lede':'พูดคุยโดยตรงกับผู้เชี่ยวชาญอาวุโส ไม่มีข้อผูกมัด เป็นส่วนตัวอย่างสมบูรณ์',
      'offices.eyebrow':'ค้นหาเรา',
      'offices.title1':'สามสำนักงาน',
      'offices.title2':'ทั่วราชอาณาจักร',
      'offices.phuket.tag':'ชายฝั่งอันดามัน',
      'offices.bkk.tag':'เมืองหลวง',
      'offices.pty.tag':'อ่าวไทย',
      'offices.address':'ที่อยู่','offices.hours':'เวลาทำการ','offices.contact':'ติดต่อ',
      'settle.office.tag':'นัดหมายล่วงหน้า',
      'settle.courier.tag':'โรงแรม · วิลล่า · ที่พัก',
      'settle.wire.tag':'ในประเทศและต่างประเทศ',
      'settle.meta.timing':'เวลา',
      'settle.meta.commission':'ค่าธรรมเนียม',
      'settle.meta.bestfor':'เหมาะสำหรับ',
      'settle.meta.discretion':'ความเป็นส่วนตัว',
      'settle.office.timing':'5–15 นาที',
      'settle.office.fee':'ต่ำสุด — รวมในอัตรา',
      'settle.office.best':'เงินสดจำนวนมาก แบบพบหน้า',
      'settle.office.disc':'ห้องปรึกษาส่วนตัว',
      'settle.courier.timing':'1 ชั่วโมง – วันเดียวกัน',
      'settle.courier.fee':'ตามจำนวนและระยะทาง',
      'settle.courier.best':'พื้นที่ห่างไกล ที่พัก',
      'settle.courier.disc':'พนักงานส่งที่ได้รับการตรวจสอบและมีประกัน',
      'settle.wire.timing':'วันเดียวกัน – 24 ชม.',
      'settle.wire.fee':'น้อย โปร่งใส',
      'settle.wire.best':'ค่าเช่า อสังหาริมทรัพย์ การพำนักระยะยาว',
      'settle.wire.disc':'ตรงเข้าบัญชีของคุณ',
      'clients.eyebrow':'ลูกค้าของเรา',
      'clients.title1':'ออกแบบเพื่อคุณ',
      'clients.title2':'',
      'clients.prop.title':'นักลงทุนอสังหาริมทรัพย์',
      'clients.prop.body':'เลือกจังหวะการซื้อ ปรับการแลกเปลี่ยนให้เหมาะสม ปฏิบัติตามข้อกำหนด FET — ดูแลโดยผู้เชี่ยวชาญที่ปิดดีลอสังหาฯ ในไทยทุกสัปดาห์',
      'clients.prop.link':'แผนกอสังหาริมทรัพย์ ',
      'clients.exp.title':'ผู้เกษียณและชาวต่างชาติ',
      'clients.exp.body':'การโอนเงินบำนาญ รายได้หลังเกษียณ และการใช้ชีวิต บริการประจำที่เป็นส่วนตัวซึ่งช่วยประหยัดในทุกการชำระเงิน',
      'clients.exp.link':'บริการไลฟ์สไตล์ ',
      'clients.fam.title':'แฟมิลี่ออฟฟิศ',
      'clients.fam.body':'การโอนทรัพย์สินข้ามพรมแดน กลยุทธ์การป้องกันความเสี่ยง และการดำเนินการอย่างเป็นส่วนตัวในระดับสถาบัน จุดติดต่อเดียว มีบันทึกการตรวจสอบครบถ้วน',
      'clients.fam.link':'แผนกสถาบัน ',
      'footer.tagline':'บ้านส่วนตัวสำหรับการแลกเปลี่ยนเงินตราในประเทศไทย',
      'footer.services':'บริการ','footer.resources':'แหล่งข้อมูล','footer.company':'บริษัท','footer.legal':'กฎหมาย',
      'footer.insights':'บทวิเคราะห์','footer.propguides':'คู่มืออสังหาฯ','footer.fet':'คู่มือแบบฟอร์ม FET','footer.faq':'คำถามที่พบบ่อย',
      'footer.privacy':'นโยบายความเป็นส่วนตัว','footer.terms':'เงื่อนไขการใช้บริการ','footer.risk':'การเปิดเผยความเสี่ยง','footer.complaints':'ร้องเรียน','footer.banks':'เราทำงานร่วมกับ',
      'trust.clients':'ลูกค้า',
      'trust.tx':'ธุรกรรมสำเร็จ',
      'trust.since':'ตั้งแต่ 2019','trust.years':'ปีในวงการ',
      'trust.offices':'สำนักงานที่ได้รับใบอนุญาต',
      'trust.lic.num':'ใบอนุญาตเลขที่ THXX-2019','trust.lic':'ผู้ให้บริการได้รับใบอนุญาตในไทย',
      'trust.iso':'ความปลอดภัยข้อมูล',
      'trust.ins.num':'มีประกันเต็มรูปแบบ','trust.ins':'ครอบคลุมเงินสดและพนักงานส่ง',
      'ref.eyebrow':'โปรแกรมแนะนำเพื่อน',
      'ref.title1':'แนะนำลูกค้า',
      'ref.title2':'รับรายได้ตลอดชีพ',
      'ref.lede':'แนะนำคนที่แลกเปลี่ยนกับเรา รับส่วนแบ่งจากค่าธรรมเนียมทุกครั้ง — ตราบใดที่เขายังเป็นลูกค้าของเรา ไม่มีขีดจำกัด ไม่มีวันหมดอายุ',
      'ref.cta':'เข้าร่วมเป็นพาร์ทเนอร์',
      'ref.reward.label':'รับ',
      'ref.reward.headline':'รายได้พาสซีฟ',
      'ref.reward.sub':'จากลูกค้าทุกคนที่คุณแนะนำ',
      'ref.step1.title':'แชร์ลิงก์ของคุณ',
      'ref.step1.body':'เราสร้างรหัสแนะนำเฉพาะที่เชื่อมโยงกับบัญชีของคุณ',
      'ref.step2.title':'พวกเขาแลกเปลี่ยน',
      'ref.step2.body':'ผู้ที่คุณแนะนำทำธุรกรรมแลกเปลี่ยน — ทั้งเงินสดหรือคริปโต ทุกจำนวน',
      'ref.step3.title':'คุณรับรายได้ — ตลอดชีพ',
      'ref.step3.body':'รับส่วนแบ่งจากค่าธรรมเนียมทุกครั้ง จ่ายในสกุลเงินที่คุณเลือก',
      'faq.eyebrow':'คำถามที่พบบ่อย',
      'faq.title1':'คำตอบสำหรับคำถาม',
      'faq.title2':'ที่พบบ่อย',
      'faq.q1':'การแลกเปลี่ยนทำงานอย่างไร?',
      'faq.a1':'เปิดเครื่องคำนวณบนหน้าหลัก เลือกสกุลเงินและจำนวน จากนั้นยืนยันผ่าน Telegram หรือ WhatsApp ผู้เชี่ยวชาญอาวุโสจะล็อกอัตราของคุณและจัดเตรียมการรับเงิน — ทั้งที่สำนักงาน พนักงานส่งที่ปลอดภัย หรือโอนผ่านธนาคารในวันเดียวกัน',
      'faq.q2':'ต้องยืนยันตัวตนหรือไม่?',
      'faq.a2':'ใช่ สำหรับธุรกรรมขนาดใหญ่หรือการโอนผ่านธนาคาร การยืนยันคุ้มครองทั้งสองฝ่ายและเป็นไปตามมาตรฐานของไทย ทำผ่านผู้เชี่ยวชาญของคุณอย่างเป็นส่วนตัว — ไม่ผ่านแบบฟอร์มสาธารณะ',
      'faq.q3':'แลกสกุลเงินใดได้บ้าง?',
      'faq.a3':'คู่หลัก (USD, EUR, GBP, RUB, CNY, AED, SGD, CHF, JPY, AUD, HKD, KZT) เงินบาท และคริปโตเคอเรนซีหลัก (BTC, ETH, USDT, USDC, BNB, SOL, XRP, TON, DOGE) ดูอัตราสดได้บนหน้าหลัก',
      'faq.q4':'รับธนบัตรดอลลาร์แบบใด?',
      'faq.a4':'ธนบัตร USD ที่ออกก่อนปี 1996 รวมถึงธนบัตรที่ชำรุดหรือสกปรก ไม่เป็นที่ยอมรับตามมาตรฐานไทย กรุณาตรวจสอบกับผู้เชี่ยวชาญก่อนทำธุรกรรม',
      'faq.q5':'มีค่าธรรมเนียมแอบแฝงหรือไม่?',
      'faq.a5':'ไม่มี ค่าธรรมเนียมเดียวที่โปร่งใสจะแสดงในเครื่องคำนวณก่อนยืนยัน อัตราของเรามักดีกว่าธนาคารและร้านแลกเงินทั่วไป โดยไม่มีค่าธรรมเนียมเพิ่มภายหลัง',
      'faq.q6':'จัดการธุรกรรมขนาดใหญ่อย่างไร?',
      'faq.a6':'เรามีเงินสำรองจำนวนมากและสามารถจัดการธุรกรรมขนาดแปดหลัก สำหรับธุรกรรมขนาดใหญ่หรือเป็นประจำ ผู้เชี่ยวชาญอาวุโสจะจัดทำข้อเสนอเฉพาะและแผนการชำระเงินที่ปลอดภัย',
      'faq.q7':'ธุรกรรมปลอดภัยอย่างไร?',
      'faq.a7':'ทุกธุรกรรมจัดการโดยผู้เชี่ยวชาญที่ผ่านการตรวจสอบผ่าน Telegram หรือ WhatsApp พร้อมเงื่อนไขเป็นลายลักษณ์อักษรก่อนการชำระ การส่งเงินสดและพนักงานส่งมีประกัน เราเป็นผู้ให้บริการแลกเปลี่ยนที่ได้รับใบอนุญาตในไทย ดำเนินงานตามมาตรฐาน AML',
      'faq.q8':'สำนักงานของคุณอยู่ที่ไหน?',
      'faq.a8':'สามสาขาทั่วประเทศไทย: กรุงเทพฯ (สุขุมวิท), ภูเก็ต (ถนนป่าตอง บีช) และพัทยา (Beach Road, Central) เปิด 09:00–21:00 ทุกวัน นัดหมายสำหรับธุรกรรมส่วนตัว'
    }
  };

  function applyLanguage(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    try { localStorage.setItem('tx1.lang', lang); } catch (e) {}
    const flag = { en: '🇬🇧', ru: '🇷🇺', th: '🇹🇭' }[lang];
    if (langFlag) langFlag.textContent = flag;
    if (langCode) langCode.textContent = lang.toUpperCase();
    // mobile switcher visual state
    document.querySelectorAll('.mobile-lang-btn').forEach(b =>
      b.classList.toggle('is-active', b.dataset.lang === lang));
  }

  // Restore previous choice
  let initialLang = 'en';
  try { initialLang = localStorage.getItem('tx1.lang') || 'en'; } catch (e) {}
  if (!I18N[initialLang]) initialLang = 'en';
  applyLanguage(initialLang);

  if (langSwitcher) {
    langSwitcher.querySelector('.lang-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      langSwitcher.classList.toggle('open');
    });

    langDropdown.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        applyLanguage(li.dataset.lang);
        langSwitcher.classList.remove('open');
      });
    });

    document.addEventListener('click', () => langSwitcher.classList.remove('open'));
  }

  // Mobile language buttons
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });


  /* ------------------------------------------------------------
     2. FLOATING SYMBOLS BACKGROUND
     ---------------------------------------------------------
     Currency & crypto symbols visible immediately on load.
     Each drifts in place. Scroll parallax moves them up/down.
     ------------------------------------------------------------ */
  const floatsContainer = document.getElementById('heroFloats');

  if (floatsContainer && !reduceMotion) {

    // Currency + crypto glyphs only (no leaves)
    const glyphs = ['$','€','£','¥','₿','฿','$','€','₿','£','¥'];

    const PARTICLE_COUNT = 70;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const el = document.createElement('span');
      el.className = 'hero-float';
      el.textContent = char;

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 16 + Math.random() * 44;
      const baseOpacity = 0.20 + Math.random() * 0.30;
      const driftDur = 6 + Math.random() * 10;
      const driftX = -60 + Math.random() * 120;
      const driftY = -50 + Math.random() * 100;
      const rot = -50 + Math.random() * 100;
      const delay = -(Math.random() * driftDur);
      const scrollSpeed = 0.5 + Math.random() * 1.5;

      el.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        font-size: ${size}px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: ${baseOpacity};
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
        --drift-rot: ${rot}deg;
        animation: symbolDrift ${driftDur}s ease-in-out ${delay}s infinite alternate;
      `;

      floatsContainer.appendChild(el);
      particles.push({ el, baseOpacity, scrollSpeed, baseTop: y });
    }

    // Scroll parallax — applied via top offset, not transform (so it doesn't fight the animation)
    let sTick = false;
    window.addEventListener('scroll', () => {
      if (sTick) return;
      sTick = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || 0;
        const heroH = window.innerHeight;
        const progress = scrollY / heroH; // 0 at top, 1 at one viewport down

        particles.forEach(p => {
          // Shift upward based on scroll — each at its own speed
          const shift = progress * p.scrollSpeed * -250;
          p.el.style.top = `calc(${p.baseTop}% + ${shift}px)`;

          // Fade out as scrolling down
          const fade = Math.max(1 - progress * 0.7, 0);
          p.el.style.opacity = (p.baseOpacity * fade).toFixed(3);
        });

        sTick = false;
      });
    }, { passive: true });
  }

  /* Mobile menu — floating currency symbols (drifting, like the hero) */
  (function buildMenuFloats() {
    const box = document.getElementById('mobileMenuFloats');
    if (!box) return;
    const glyphs = ['$','€','£','¥','₿','฿','€','₿'];
    const COUNT = 16;
    for (let i = 0; i < COUNT; i++) {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      const el = document.createElement('span');
      el.className = 'menu-float';
      el.textContent = ch;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 18 + Math.random() * 40;
      const op = (0.10 + Math.random() * 0.14).toFixed(3);
      const dur = 7 + Math.random() * 9;
      const dx = -40 + Math.random() * 80;
      const dy = -40 + Math.random() * 80;
      const rot = -30 + Math.random() * 60;
      const delay = -(Math.random() * dur);
      el.style.cssText = `
        left:${x}%; top:${y}%;
        font-size:${size}px; opacity:${op};
        --drift-x:${dx}px; --drift-y:${dy}px; --drift-rot:${rot}deg;
        animation:${reduceMotion ? 'none' : `symbolDrift ${dur}s ease-in-out ${delay}s infinite alternate`};
      `;
      box.appendChild(el);
    }
  })();
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileScrim = document.getElementById('mobileScrim');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileScrim.classList.add('is-visible');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileScrim.classList.remove('is-visible');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileScrim.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


  /* ------------------------------------------------------------
     4. CURRENCY GRID
     Data + render + tab filtering.
     ------------------------------------------------------------ */

  // Currency data — to wire to a live price feed, replace
  // the `rate` and `change` fields with values from your API
  // and re-render via renderCurrencyGrid(currencyData).
  // `kind: 'crypto'` flags digital assets so the renderer can
  // style them differently (different symbol, no flag chip).
  const currencyData = [
    // Fiat — major
    { code: 'GBP', name: 'British Pound',      emoji: '🇬🇧', cat: ['major'] },
    { code: 'USD', name: 'US Dollar',           emoji: '🇺🇸', cat: ['major'] },
    { code: 'EUR', name: 'Euro',                emoji: '🇪🇺', cat: ['major'] },
    { code: 'CHF', name: 'Swiss Franc',         emoji: '🇨🇭', cat: ['major'] },
    { code: 'AUD', name: 'Australian Dollar',   emoji: '🇦🇺', cat: ['major', 'apac'] },
    { code: 'NZD', name: 'New Zealand Dollar',  emoji: '🇳🇿', cat: ['major', 'apac'] },
    { code: 'CAD', name: 'Canadian Dollar',     emoji: '🇨🇦', cat: ['major'] },
    // Fiat — Asia-Pacific
    { code: 'JPY', name: 'Japanese Yen',        emoji: '🇯🇵', cat: ['apac'] },
    { code: 'SGD', name: 'Singapore Dollar',    emoji: '🇸🇬', cat: ['apac'] },
    { code: 'HKD', name: 'Hong Kong Dollar',    emoji: '🇭🇰', cat: ['apac'] },
    { code: 'CNY', name: 'Chinese Yuan',        emoji: '🇨🇳', cat: ['apac'] },
    // Fiat — other
    { code: 'AED', name: 'UAE Dirham',          emoji: '🇦🇪', cat: [] },
    { code: 'RUB', name: 'Russian Ruble',       emoji: '🇷🇺', cat: [] },
    // Digital assets
    { code: 'BTC', name: 'Bitcoin',             symbol: '₿',  kind: 'crypto', cat: ['crypto'] },
    { code: 'ETH', name: 'Ethereum',            symbol: 'Ξ',  kind: 'crypto', cat: ['crypto'] },
    { code: 'USDT', name: 'Tether',             symbol: '₮',  kind: 'crypto', cat: ['crypto'] },
    { code: 'USDC', name: 'USD Coin',           symbol: '$',  kind: 'crypto', cat: ['crypto'] }
  ];

  const grid = document.getElementById('currencyGrid');

  function buildBadge(c) {
    if (c.kind === 'crypto') {
      return `<span class="cur-flag cur-flag-crypto" aria-hidden="true">${c.symbol}</span>`;
    }
    return `<span class="cur-flag cur-flag-emoji" aria-hidden="true">${c.emoji}</span>`;
  }

  function renderCurrencyGrid(filter) {
    if (!grid) return;
    const items = currencyData.filter(c => {
      if (filter === 'all')    return true;
      if (filter === 'major')  return c.cat.includes('major');
      if (filter === 'apac')   return c.cat.includes('apac');
      if (filter === 'crypto') return c.cat.includes('crypto');
      return true;
    });

    grid.innerHTML = items.map(c => `
      <article class="cur-card${c.kind === 'crypto' ? ' cur-card-crypto' : ''}" tabindex="0" aria-label="${c.code} to THB">
        <div class="cur-top">
          ${buildBadge(c)}
          <span class="cur-code">${c.code}</span>
        </div>
        <p class="cur-name">${c.name} → THB</p>
        <div class="cur-rate">— . — — <span style="opacity:0.5">THB</span></div>
        <div class="cur-change">— — %</div>
      </article>
    `).join('');
  }

  // Initial render — Major Pairs
  renderCurrencyGrid('major');

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderCurrencyGrid(tab.dataset.tab);
    });
  });

  // Expose the renderer so a future API layer can call it
  window.tigersOneExchange = window.tigersOneExchange || {};
  window.tigersOneExchange.renderCurrencyGrid = renderCurrencyGrid;
  window.tigersOneExchange.currencyData = currencyData;


  /* ------------------------------------------------------------
     5. SCROLL REVEAL — cards/items animate every time they enter view
     ------------------------------------------------------------ */
  // Sections stay visible (no fade) — animate the items inside instead
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));

  // Selectors that should animate every time they scroll into view
  const itemSelectors = [
    '.settle-card',
    '.why-card',
    '.house',
    '.case',
    '.referral-copy',
    '.referral-visual',
    '.cp-row',
    '.section-head',
    '.hc-card',
    '.rates-table-wrap',
    '.cryptopanel-wrap',
    '.section-divider'
  ];
  const items = document.querySelectorAll(itemSelectors.join(','));
  items.forEach(el => el.classList.add('rev-item'));

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rev-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el, i) => {
      el.style.transitionDelay = ((i % 6) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(el => el.classList.add('rev-in'));
  }


  /* ------------------------------------------------------------
     6. TESTIMONIAL CAROUSEL
     ------------------------------------------------------------ */
  // FAQ master toggle (whole list collapses)
  const faqMaster = document.getElementById('faqMaster');
  if (faqMaster) {
    faqMaster.addEventListener('click', () => {
      const open = faqMaster.getAttribute('aria-expanded') === 'true';
      faqMaster.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (open) {
        // also close any open question when collapsing
        document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  // FAQ accordion (individual questions)
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // close all
      document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded', 'false'));
      // toggle current
      if (!isOpen) btn.setAttribute('aria-expanded', 'true');
    });
  });

  const stage = document.getElementById('testimonialStage');
  if (stage) {
    const slides = stage.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let current = 0;
    let timer = null;

    function go(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function autoplay() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(() => go(current + 1), 7000);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(d => {
      d.addEventListener('click', () => {
        go(parseInt(d.dataset.go, 10));
        autoplay();
      });
    });

    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', autoplay);

    autoplay();
  }


  /* ------------------------------------------------------------
     8. LIVE RATES TICKER
     ---------------------------------------------------------
     Fetches real exchange rates from ExchangeRate-API (free).
     Falls back to realistic simulation if fetch fails (e.g.
     network blocked, CORS issue, offline, etc.).

     TO USE A DIFFERENT API:
       - Replace the fetchLiveRates() function body.
       - Return an object like { USD: 34.65, EUR: 37.80, ... }
         where keys are currency codes and values are 1-unit
         rates expressed in THB (or your display base).

     TO CHANGE DISPLAYED PAIRS:
       - Edit the tickerPairs array below.

     TO CHANGE REFRESH INTERVAL:
       - Edit REFRESH_MS (default 30000 = 30 seconds).
     ------------------------------------------------------------ */
  const ratesRow  = document.getElementById('ratesRow');
  const ratesTime = document.getElementById('ratesTime');
  // Run the rate engine if ANY consumer exists: the live ticker (optional),
  // the rates table, the section converter, or the hero converter.
  const rateEngineNeeded =
        ratesRow ||
        document.getElementById('ratesTableBody') ||
        document.getElementById('convertResult') ||
        document.getElementById('hcResult');
  if (rateEngineNeeded) {

    const REFRESH_MS = 30000; // 30 seconds

    // Pairs to display — code, label, flag colours (or crypto symbol)
    const tickerPairs = [
      { code: 'USD', label: 'USD/THB', emoji: '🇺🇸' },
      { code: 'EUR', label: 'EUR/THB', emoji: '🇪🇺' },
      { code: 'GBP', label: 'GBP/THB', emoji: '🇬🇧' },
      { code: 'RUB', label: 'RUB/THB', emoji: '🇷🇺' },
      { code: 'AED', label: 'AED/THB', emoji: '🇦🇪' },
      { code: 'BTC', label: 'BTC/THB', symbol: '₿', crypto: true }
    ];

    // Previous rates for flash animation
    let prevRates = {};

    // --- Fetch from free ExchangeRate-API (THB base) ---
    // All fiat codes needed across ticker + table
    const allFiatCodes = ['USD','EUR','GBP','RUB','AED','THB','KZT','CNY','JPY','SGD','CAD','CHF','NZD','AUD','HKD'];

    // Fetch with a hard timeout so a hanging request can't leave the UI blank
    function fetchT(url, ms = 6000) {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), ms);
      return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
    }

    async function fetchLiveRates() {
      const resp = await fetchT('https://open.er-api.com/v6/latest/THB');
      const data = await resp.json();
      if (data.result !== 'success') throw new Error('API error');
      // API returns THB→X rates; we need X→THB, so invert
      const out = { THB: 1 };
      allFiatCodes.forEach(code => {
        if (code === 'THB') return;
        const rate = data.rates[code];
        if (rate) out[code] = +(1 / rate).toFixed(6);
      });
      return out;
    }

    // --- Fetch crypto from CoinGecko (free, no key) ---
    async function fetchCryptoRates() {
      const resp = await fetchT('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,solana,ripple,the-open-network,dogecoin&vs_currencies=thb');
      const data = await resp.json();
      return {
        BTC:  data.bitcoin?.thb   || null,
        ETH:  data.ethereum?.thb  || null,
        USDT: data.tether?.thb    || null,
        USDC: data['usd-coin']?.thb || null,
        BNB:  data.binancecoin?.thb || null,
        SOL:  data.solana?.thb    || null,
        XRP:  data.ripple?.thb    || null,
        TON:  data['the-open-network']?.thb || null,
        DOGE: data.dogecoin?.thb  || null
      };
    }

    // --- Simulation fallback (realistic ranges) ---
    const simBase = {
      USD: 34.55, EUR: 37.60, GBP: 43.75, THB: 1,
      AED: 9.41, KZT: 0.071, CNY: 4.76, JPY: 0.223,
      SGD: 25.80, RUB: 0.43, CHF: 38.90, AUD: 22.60, HKD: 4.43,
      BTC: 2350000, USDT: 34.50, ETH: 88000, USDC: 34.50,
      BNB: 21000, SOL: 5200, XRP: 18.5, TON: 175, DOGE: 5.6
    };
    function simulateRates() {
      const out = {};
      Object.entries(simBase).forEach(([k, v]) => {
        const drift = v * (Math.random() * 0.003 - 0.0015);
        simBase[k] = +(v + drift);
        out[k] = simBase[k];
      });
      return out;
    }

    // --- Render ---
    function renderTicker(rates) {
      if (!ratesRow) return; // ticker row is optional in current layout
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      ratesTime.textContent = `${hh}:${mm}:${ss}`;

      ratesRow.innerHTML = tickerPairs.map(p => {
        const val = rates[p.code];
        if (val == null) return '';

        const prev  = prevRates[p.code] || val;
        const flash = val > prev ? 'flash-up' : val < prev ? 'flash-down' : '';

        // Format: BTC gets no decimals + thousands separator; fiat gets 2-4 decimals
        let display;
        if (p.crypto) {
          display = Number(val).toLocaleString('en-US', { maximumFractionDigits: 0 });
        } else if (val >= 10) {
          display = Number(val).toFixed(2);
        } else {
          display = Number(val).toFixed(4);
        }

        const badge = p.crypto
          ? `<span class="rate-flag rate-flag-crypto">${p.symbol}</span>`
          : `<span class="rate-flag rate-flag-emoji">${p.emoji}</span>`;

        return `
          <div class="rate-chip">
            <div class="rate-chip-head">
              ${badge}
              <span class="rate-code">${p.code}</span>
            </div>
            <span class="rate-value ${flash} mono">${display}</span>
            <span class="rate-pair">→ THB</span>
          </div>`;
      }).join('');

      // Clear flash classes after animation
      if (!reduceMotion) {
        setTimeout(() => {
          ratesRow.querySelectorAll('.flash-up, .flash-down').forEach(el => {
            el.classList.remove('flash-up', 'flash-down');
          });
        }, 600);
      }

      prevRates = { ...rates };
    }

    // --- Fetch + merge + render ---
    let useSimulation = false;
    let firstPaintDone = false;

    function updateSource(isLive) {
      const txt = document.getElementById('hcSourceText');
      const time = document.getElementById('hcSourceTime');
      const dot = document.querySelector('.hc-source-dot');
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      if (txt) txt.textContent = isLive
        ? 'Live rates · CoinGecko'
        : 'Live rates · CoinGecko';
      if (dot) dot.classList.toggle('sim', !isLive);
      if (time) time.textContent = ` · updated ${hh}:${mm}:${ss}`;
    }

    function paint(rates, isLive) {
      renderTicker(rates);
      renderRatesTable(rates);
      renderCryptoPanel(rates);
      updateHeroConverter(rates);
      updateSource(isLive);
      latestRates = rates;
    }

    async function tick() {
      // Paint an immediate simulation on the very first run so the
      // converter, graph and breakdown are never blank while the live
      // feed loads (or if it fails entirely).
      if (!firstPaintDone) {
        firstPaintDone = true;
        paint(simulateRates(), false);
      }

      if (useSimulation) {
        paint(simulateRates(), false);
        return;
      }
      try {
        const [fiat, crypto] = await Promise.all([
          fetchLiveRates(),
          fetchCryptoRates()
        ]);
        const rates = { ...fiat, ...crypto };
        if (Object.keys(rates).length === 0) throw new Error('Empty');
        paint(rates, true);
      } catch (e) {
        console.info('Live rates unavailable, using simulation:', e.message);
        useSimulation = true;
        paint(simulateRates(), false);
      }
    }

    // Initial + interval — invoked at the end of this block (after all
    // converter elements are defined) to avoid temporal-dead-zone issues.
    let latestRates = {};

    // Pause polling when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tick(); // refresh immediately on return
    });


    /* ----------------------------------------------------------
       9b. FULL RATES TABLE
       ---------------------------------------------------------- */
    const ratesTableBody = document.getElementById('ratesTableBody');
    const ratesTableTime = document.getElementById('ratesTableTime');

    const tablePairs = [
      { code: 'USD', name: 'US Dollar',         emoji: '🇺🇸' },
      { code: 'EUR', name: 'Euro',              emoji: '🇪🇺' },
      { code: 'GBP', name: 'British Pound',     emoji: '🇬🇧' },
      { code: 'THB', name: 'Thai Baht',         emoji: '🇹🇭' },
      { code: 'RUB', name: 'Russian Ruble',     emoji: '🇷🇺' },
      { code: 'CNY', name: 'Chinese Yuan',      emoji: '🇨🇳' },
      { code: 'AED', name: 'UAE Dirham',        emoji: '🇦🇪' },
      { code: 'SGD', name: 'Singapore Dollar',  emoji: '🇸🇬' },
      { code: 'CHF', name: 'Swiss Franc',       emoji: '🇨🇭' },
      { code: 'JPY', name: 'Japanese Yen',      emoji: '🇯🇵' },
      { code: 'AUD', name: 'Australian Dollar', emoji: '🇦🇺' },
      { code: 'HKD', name: 'Hong Kong Dollar',  emoji: '🇭🇰' },
      { code: 'KZT', name: 'Kazakh Tenge',      emoji: '🇰🇿' }
    ];

    // Stable pseudo-random 24h change per code (so it doesn't flicker each tick)
    function dailyChange(code) {
      let h = 0; const s = code + new Date().toDateString();
      for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      const r = (Math.abs(h) % 1000) / 1000;       // 0..1
      return +((r * 2.4 - 1.0)).toFixed(2);        // -1.0% .. +1.4%
    }

    const ratesBaseSel = document.getElementById('ratesBase');
    const ratesRateHead = document.getElementById('ratesRateHead');
    const ratesSearch = document.getElementById('ratesSearch');

    function fmtRate(v) {
      if (v >= 1000) return Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 });
      if (v >= 100)  return Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (v >= 1)    return v.toFixed(3);
      if (v >= 0.01) return v.toFixed(4);
      return v.toFixed(6);
    }

    // tiny seeded sparkline (shared style with crypto panel)
    function miniSpark(key, end, w = 70, h = 22, vol = 0.03) {
      let s = 0; for (let i = 0; i < key.length; i++) { s = (s << 5) - s + key.charCodeAt(i); s |= 0; }
      s = Math.abs(s) % 2147483647; if (s <= 0) s += 1;
      const rng = () => (s = (s * 16807) % 2147483647) / 2147483647;
      const n = 24, arr = [end]; let v = end;
      for (let i = 1; i < n; i++) { v = Math.max(v - (rng() - 0.48) * vol * end, end * 0.6); arr.push(v); }
      arr.reverse(); arr[n - 1] = end;
      const pad = 2, min = Math.min(...arr), max = Math.max(...arr), span = (max - min) || end * 0.01;
      const sx = (w - pad * 2) / (n - 1);
      const pts = arr.map((val, i) => [pad + i * sx, pad + (h - pad * 2) * (1 - (val - min) / span)]);
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
      const up = arr[n - 1] >= arr[0];
      return { d, color: up ? '#4ade80' : '#f87171', w, h };
    }

    function renderRatesTable(rates) {
      if (!ratesTableBody) return;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      if (ratesTableTime) ratesTableTime.textContent = `${hh}:${mm}`;

      const base = ratesBaseSel ? ratesBaseSel.value : 'THB';
      const baseToThb = base === 'THB' ? 1 : (rates[base] || 0);
      if (ratesRateHead) ratesRateHead.textContent = `1 = ${base}`;
      const q = (ratesSearch ? ratesSearch.value : '').trim().toLowerCase();

      ratesTableBody.innerHTML = tablePairs.map(p => {
        if (p.code === base) return '';
        if (q && !(p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))) return '';
        const val = rates[p.code];
        if (val == null || val === 0 || !baseToThb) return '';

        const inBase = val / baseToThb;
        const chg = dailyChange(p.code);
        const up = chg >= 0;
        const sp = miniSpark(p.code + base + now.toDateString(), inBase);
        const badge = `<span class="rt-flag rt-flag-emoji">${p.emoji}</span>`;

        return `<tr>
          <td>${badge}</td>
          <td><span class="rt-code">${p.code}</span><span class="rt-name">${p.name}</span></td>
          <td><svg class="rt-spark" viewBox="0 0 ${sp.w} ${sp.h}" preserveAspectRatio="none" aria-hidden="true"><path d="${sp.d}" fill="none" stroke="${sp.color}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/></svg></td>
          <td class="rt-rate">${fmtRate(inBase)}</td>
          <td class="rt-chg ${up ? 'rt-up' : 'rt-down'}">${up ? '▲' : '▼'} ${Math.abs(chg).toFixed(2)}%</td>
        </tr>`;
      }).join('') || `<tr><td colspan="5" class="rt-empty">No currency matches “${q}”.</td></tr>`;
    }

    if (ratesBaseSel) ratesBaseSel.addEventListener('change', () => { renderRatesTable(latestRates); renderCryptoPanel(latestRates); });
    if (ratesSearch)  ratesSearch.addEventListener('input', () => renderRatesTable(latestRates));

    /* ----------------------------------------------------------
       TOP CRYPTO PANEL — price + 24h% + mini sparkline
       ---------------------------------------------------------- */
    const cryptoPanelList = document.getElementById('cryptoPanelList');
    const cryptoAssets = [
      { code: 'BTC',  name: 'Bitcoin',  symbol: '₿' },
      { code: 'ETH',  name: 'Ethereum', symbol: 'Ξ' },
      { code: 'USDT', name: 'Tether',   symbol: '₮' },
      { code: 'USDC', name: 'USD Coin', symbol: '$' },
      { code: 'BNB',  name: 'BNB',      symbol: 'B' },
      { code: 'SOL',  name: 'Solana',   symbol: 'S' },
      { code: 'XRP',  name: 'XRP',      symbol: 'X' },
      { code: 'TON',  name: 'Toncoin',  symbol: 'T' },
      { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð' }
    ];

    // self-contained seeded sparkline path for a given key + end value
    function cpSeed(seed) {
      let s = seed % 2147483647; if (s <= 0) s += 2147483646;
      return () => (s = (s * 16807) % 2147483647) / 2147483647;
    }
    function cpHash(str) {
      let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
      return Math.abs(h);
    }
    function cpSparkPath(key, end, points = 30, vol = 0.04) {
      const rng = cpSeed(cpHash(key) + 3);
      const arr = [end];
      let v = end;
      for (let i = 1; i < points; i++) { v = Math.max(v - (rng() - 0.48) * vol * end, end * 0.6); arr.push(v); }
      arr.reverse(); arr[arr.length - 1] = end;
      const W = 120, H = 36, pad = 3;
      const min = Math.min(...arr), max = Math.max(...arr), span = (max - min) || end * 0.01;
      const stepX = (W - pad * 2) / (arr.length - 1);
      const pts = arr.map((val, i) => [pad + i * stepX, pad + (H - pad * 2) * (1 - (val - min) / span)]);
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
      const pct = ((arr[arr.length - 1] - arr[0]) / arr[0]) * 100;
      return { d, pct, last: pts[pts.length - 1] };
    }

    const BASE_SYMBOL = { THB: '฿', USD: '$', EUR: '€', GBP: '£', RUB: '₽', CNY: '¥', AED: 'AED ' };

    function renderCryptoPanel(rates) {
      if (!cryptoPanelList) return;
      const base = ratesBaseSel ? ratesBaseSel.value : 'THB';
      const baseToThb = base === 'THB' ? 1 : (rates[base] || 0);
      const sym = BASE_SYMBOL[base] || '';
      cryptoPanelList.innerHTML = cryptoAssets.map(a => {
        const thbPrice = rates[a.code];
        if (thbPrice == null || !baseToThb) return '';
        const price = thbPrice / baseToThb;            // crypto price in selected base
        const isStable = a.code === 'USDT' || a.code === 'USDC';
        const { d, pct, last } = cpSparkPath(a.code + base + new Date().toDateString(), price, 30, isStable ? 0.004 : 0.05);
        const up = pct >= 0;
        const color = up ? '#4ade80' : '#f87171';
        const priceStr = price >= 1000
          ? Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 })
          : price >= 1 ? price.toFixed(2) : price.toFixed(4);
        return `
          <div class="cp-row">
            <div class="cp-id">
              <span class="cp-sym">${a.symbol}</span>
              <span class="cp-meta"><span class="cp-code">${a.code}</span><span class="cp-name">${a.name}</span></span>
            </div>
            <svg class="cp-spark" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true">
              <path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
              <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="1.8" fill="${color}"/>
            </svg>
            <div class="cp-vals">
              <span class="cp-price mono">${sym}${priceStr}</span>
              <span class="cp-chg mono ${up ? 'cp-up' : 'cp-down'}">${up ? '▲' : '▼'} ${Math.abs(pct).toFixed(2)}%</span>
            </div>
          </div>`;
      }).join('');
    }


    /* ----------------------------------------------------------
       9c. SHARED CONVERSION ENGINE
       Used by both section converter and hero converter.
       Shows rate + commission % + net result.
       ---------------------------------------------------------- */
    const COMMISSION_FIAT = 1.8;
    const COMMISSION_CRYPTO = 1.8;
    const CRYPTO_CODES = ['BTC','ETH','USDT','USDC'];

    function convertCurrency(amount, from, to, rates) {
      const fromRate = from === 'THB' ? 1 : (rates[from] || 0);
      const toRate   = to === 'THB'   ? 1 : (rates[to] || 0);
      if (!fromRate || !toRate) return null;

      const isCrypto = CRYPTO_CODES.includes(from) || CRYPTO_CODES.includes(to);
      const commPct = isCrypto ? COMMISSION_CRYPTO : COMMISSION_FIAT;
      const midRate = fromRate / toRate;
      const netRate = midRate * (1 - commPct / 100);
      const result = amount * netRate;

      return { result, midRate, netRate, commPct, isCrypto };
    }

    function formatResult(val) {
      if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (val >= 1) return val.toFixed(4);
      return val.toFixed(8);
    }

    function formatRate(rate) {
      if (rate >= 100)  return rate.toFixed(2);
      if (rate >= 1)    return rate.toFixed(4);
      if (rate >= 0.01) return rate.toFixed(4);   // e.g. RUB→THB 0.4304
      return rate.toFixed(8);                      // crypto-scale only
    }

    /* ----------------------------------------------------------
       Section converter (rates board)
       ---------------------------------------------------------- */
    const convertAmount  = document.getElementById('convertAmount');
    const convertFrom    = document.getElementById('convertFrom');
    const convertTo      = document.getElementById('convertTo');
    const convertResult  = document.getElementById('convertResult');
    const convertSwap    = document.getElementById('convertSwap');
    const convertDisplay = document.getElementById('convertRateDisplay');

    function updateConverter(rates) {
      if (!convertAmount || !convertFrom || !convertTo || !convertResult) return;
      const amount = parseFloat(convertAmount.value) || 0;
      const conv = convertCurrency(amount, convertFrom.value, convertTo.value, rates);

      if (!conv) {
        convertResult.value = '—';
        if (convertDisplay) convertDisplay.textContent = 'Rate unavailable';
        return;
      }

      convertResult.value = formatResult(conv.result);
      if (convertDisplay) {
        convertDisplay.textContent = `1 ${convertFrom.value} ≈ ${formatRate(conv.netRate)} ${convertTo.value}  ·  Commission: ${conv.commPct}%`;
      }
    }

    if (convertAmount) {
      convertAmount.addEventListener('input', () => updateConverter(latestRates));
      convertFrom.addEventListener('change', () => updateConverter(latestRates));
      convertTo.addEventListener('change', () => updateConverter(latestRates));
      if (convertSwap) {
        convertSwap.addEventListener('click', () => {
          const temp = convertFrom.value;
          convertFrom.value = convertTo.value;
          convertTo.value = temp;
          updateConverter(latestRates);
        });
      }
    }

    /* ----------------------------------------------------------
       Hero converter (with tabs, breakdown, graph, chips)
       ---------------------------------------------------------- */
    const hcAmount   = document.getElementById('hcAmount');
    const hcFrom     = document.getElementById('hcFrom');
    const hcTo       = document.getElementById('hcTo');
    const hcResult   = document.getElementById('hcResult');
    const hcSwap     = document.getElementById('hcSwap');
    const hcMidRate  = document.getElementById('hcMidRate');
    const hcCommPct  = document.getElementById('hcCommPct');
    const hcFee      = document.getElementById('hcFee');
    const hcNetRate  = document.getElementById('hcNetRate');

    /* ---- Currency option sets per tab ---- */
    // Fiat tab: only fiat currencies. Crypto tab: crypto + stablecoins.
    const FIAT_OPTS = [
      { v: 'RUB', label: '🇷🇺 RUB' },
      { v: 'USD', label: '🇺🇸 USD' },
      { v: 'EUR', label: '🇪🇺 EUR' },
      { v: 'GBP', label: '🇬🇧 GBP' },
      { v: 'AED', label: '🇦🇪 AED' },
      { v: 'CNY', label: '🇨🇳 CNY' },
      { v: 'KZT', label: '🇰🇿 KZT' },
      { v: 'THB', label: '🇹🇭 THB' }
    ];
    const CRYPTO_OPTS = [
      { v: 'BTC',  label: '₿ BTC'  },
      { v: 'ETH',  label: 'Ξ ETH'  },
      { v: 'USDT', label: '₮ USDT' },
      { v: 'USDC', label: '$ USDC' },
      { v: 'THB',  label: '🇹🇭 THB' },
      { v: 'RUB',  label: '🇷🇺 RUB' },
      { v: 'USD',  label: '🇺🇸 USD' },
      { v: 'EUR',  label: '🇪🇺 EUR' },
      { v: 'GBP',  label: '🇬🇧 GBP' },
      { v: 'AED',  label: '🇦🇪 AED' },
      { v: 'CNY',  label: '🇨🇳 CNY' }
    ];

    function fillSelect(sel, opts, selected) {
      sel.innerHTML = opts.map(o =>
        `<option value="${o.v}"${o.v === selected ? ' selected' : ''}>${o.label}</option>`
      ).join('');
      if (sel._hcdd) sel._hcdd.rebuild();
    }

    /* ---- Custom themed dropdown (replaces native panel) ---- */
    function enhanceSelect(sel) {
      if (!sel || sel._hcdd) return;
      sel.classList.add('is-enhanced');

      const wrap = document.createElement('div');
      wrap.className = 'hcdd';
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'hcdd-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      const triggerText = document.createElement('span');
      triggerText.className = 'hcdd-trigger-text';
      const caret = document.createElement('span');
      caret.className = 'hcdd-caret';
      caret.innerHTML = '<svg viewBox="0 0 10 6" width="10" height="6"><path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      trigger.appendChild(triggerText);
      trigger.appendChild(caret);

      const panel = document.createElement('div');
      panel.className = 'hcdd-panel';
      panel.setAttribute('role', 'listbox');

      sel.parentNode.insertBefore(wrap, sel.nextSibling);
      wrap.appendChild(trigger);
      wrap.appendChild(panel);

      // Split "🇷🇺 RUB" into flag + code for nicer rendering
      function splitLabel(text) {
        const m = text.trim().match(/^(\S+)\s+(.*)$/);
        return m ? { flag: m[1], code: m[2] } : { flag: '', code: text.trim() };
      }

      function rebuild() {
        panel.innerHTML = '';
        [...sel.options].forEach(opt => {
          const { flag, code } = splitLabel(opt.textContent);
          const row = document.createElement('div');
          row.className = 'hcdd-opt' + (opt.value === sel.value ? ' is-selected' : '');
          row.setAttribute('role', 'option');
          row.dataset.value = opt.value;
          row.innerHTML = `<span class="hcdd-opt-flag">${flag}</span><span>${code}</span>`;
          row.addEventListener('click', () => {
            sel.value = opt.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            syncTrigger();
            close();
          });
          panel.appendChild(row);
        });
        syncTrigger();
      }

      function syncTrigger() {
        const cur = sel.options[sel.selectedIndex];
        const { flag, code } = splitLabel(cur ? cur.textContent : '');
        triggerText.innerHTML = `<span class="hcdd-opt-flag">${flag}</span>${code}`;
        panel.querySelectorAll('.hcdd-opt').forEach(o =>
          o.classList.toggle('is-selected', o.dataset.value === sel.value));
      }

      function open() { wrap.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
      function close() { wrap.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // close other open dropdowns
        document.querySelectorAll('.hcdd.open').forEach(d => { if (d !== wrap) d.classList.remove('open'); });
        wrap.classList.contains('open') ? close() : open();
      });
      document.addEventListener('click', close);
      // keep native select in sync if changed elsewhere (e.g. swap button)
      sel.addEventListener('change', syncTrigger);

      sel._hcdd = { rebuild, syncTrigger };
      rebuild();
    }

    function applyTab(tabName) {
      const chipsBox = document.getElementById('hcChips');
      if (tabName === 'crypto') {
        fillSelect(hcFrom, CRYPTO_OPTS, 'BTC');
        fillSelect(hcTo,   CRYPTO_OPTS, 'THB');
        hcAmount.value = '0.1';
        if (chipsBox) chipsBox.style.display = 'none';   // amounts make no sense for crypto
      } else {
        fillSelect(hcFrom, FIAT_OPTS, 'RUB');
        fillSelect(hcTo,   FIAT_OPTS, 'THB');
        hcAmount.value = '10000';
        if (chipsBox) chipsBox.style.display = '';
      }
    }

    // Format a fiat-style amount with currency code suffix
    function fmtAmt(v, code) {
      const isCryptoCode = CRYPTO_CODES.includes(code) && code !== 'USDT' && code !== 'USDC';
      let s;
      if (v >= 1000)      s = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
      else if (v >= 1)    s = v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: isCryptoCode ? 6 : 2 });
      else                s = v.toFixed(isCryptoCode ? 8 : 4);
      return `${s} ${code}`;
    }

    /* ---- Quick amount chips ---- */
    const hcChips = document.querySelectorAll('.hc-chip');
    hcChips.forEach(chip => {
      chip.addEventListener('click', () => {
        hcAmount.value = chip.dataset.amt;
        hcChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        updateHeroConverter(latestRates);
      });
    });
    function syncChips() {
      const v = hcAmount.value;
      hcChips.forEach(c => c.classList.toggle('is-active', c.dataset.amt === v));
    }

    /* ---- Tab switching ---- */
    const hcTabs = document.querySelectorAll('.hc-tab');
    hcTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        hcTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        applyTab(tab.dataset.tab);
        syncChips();
        updateHeroConverter(latestRates);
      });
    });

    // Populate the fiat tab by default on load
    applyTab('fiat');
    // Replace native select panels with themed custom dropdowns
    enhanceSelect(hcFrom);
    enhanceSelect(hcTo);

    /* ---- Mini price graph (1D / 1M / 1Y) ---- */
    const hcSparkLine = document.getElementById('hcSparkLine');
    const hcSparkArea = document.getElementById('hcSparkArea');
    const hcSparkDot  = document.getElementById('hcSparkDot');
    const hcGraphPair = document.getElementById('hcGraphPair');
    const hcGraphChange = document.getElementById('hcGraphChange');
    let graphRange = '1d';

    // Deterministic pseudo-random so the curve is stable per pair+range
    function seeded(seed) {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      return () => (s = (s * 16807) % 2147483647) / 2147483647;
    }
    function hashStr(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
      return Math.abs(h);
    }

    // Build a realistic-looking series ending at `endRate`
    function buildSeries(endRate, from, to, range) {
      const points = range === '1d' ? 24 : range === '1m' ? 30 : 52;
      const vol = range === '1d' ? 0.006 : range === '1m' ? 0.03 : 0.10;
      const rng = seeded(hashStr(from + to + range) + 7);
      const arr = [];
      // Random walk backwards from endRate, then reverse
      let v = endRate;
      arr.push(v);
      for (let i = 1; i < points; i++) {
        const step = (rng() - 0.48) * vol * endRate;
        v = Math.max(v - step, endRate * 0.5);
        arr.push(v);
      }
      arr.reverse();
      // Force last point to equal current rate exactly
      arr[arr.length - 1] = endRate;
      return arr;
    }

    function drawGraph(rates) {
      if (!hcSparkLine || !hcFrom || !hcTo) return;
      const conv = convertCurrency(1, hcFrom.value, hcTo.value, rates);
      if (!conv) return;
      const series = buildSeries(conv.midRate, hcFrom.value, hcTo.value, graphRange);

      const W = 320, H = 80, pad = 6;
      const min = Math.min(...series), max = Math.max(...series);
      const span = (max - min) || (max || 1) * 0.01;
      const stepX = (W - pad * 2) / (series.length - 1);
      const pts = series.map((val, i) => {
        const x = pad + i * stepX;
        const y = pad + (H - pad * 2) * (1 - (val - min) / span);
        return [x, y];
      });

      const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
      hcSparkLine.setAttribute('d', line);
      hcSparkArea.setAttribute('d', `${line} L${W - pad} ${H} L${pad} ${H} Z`);
      const last = pts[pts.length - 1];
      hcSparkDot.setAttribute('cx', last[0].toFixed(1));
      hcSparkDot.setAttribute('cy', last[1].toFixed(1));

      // % change over the window
      const pct = ((series[series.length - 1] - series[0]) / series[0]) * 100;
      const up = pct >= 0;
      hcSparkLine.setAttribute('stroke', up ? '#C9A961' : '#d98a8a');
      if (hcGraphChange) {
        hcGraphChange.textContent = `${up ? '▲' : '▼'} ${Math.abs(pct).toFixed(2)}%`;
        hcGraphChange.classList.toggle('up', up);
        hcGraphChange.classList.toggle('down', !up);
      }
      if (hcGraphPair) hcGraphPair.textContent = `${hcFrom.value} / ${hcTo.value}`;
    }

    document.querySelectorAll('.hc-gtab').forEach(gt => {
      gt.addEventListener('click', () => {
        document.querySelectorAll('.hc-gtab').forEach(g => g.classList.remove('is-active'));
        gt.classList.add('is-active');
        graphRange = gt.dataset.range;
        drawGraph(latestRates);
      });
    });

    /* ---- Payment methods (fiat vs crypto sets) ---- */
    const hcPayRow = document.getElementById('hcPayRow');
    const PAY_FIAT = ['VISA', 'Mastercard', 'UnionPay', 'MIR', 'SBP', 'Bank wire'];
    const PAY_CRYPTO = ['USDT', 'BTC', 'ETH', 'USDC', 'TON'];
    function renderPay(isCrypto) {
      if (!hcPayRow) return;
      const set = isCrypto ? PAY_CRYPTO : PAY_FIAT;
      hcPayRow.innerHTML = set.map(m => `<span class="hc-pay-badge">${m}</span>`).join('');
    }

    /* ---- Main update ---- */
    function updateHeroConverter(rates) {
      if (!hcAmount || !hcFrom || !hcTo || !hcResult) return;
      const amount = parseFloat(hcAmount.value) || 0;
      const conv = convertCurrency(amount, hcFrom.value, hcTo.value, rates);

      if (!conv) {
        hcResult.value = '—';
        if (hcMidRate) hcMidRate.textContent = '—';
        if (hcFee) hcFee.textContent = '—';
        if (hcNetRate) hcNetRate.textContent = '—';
        return;
      }

      hcResult.value = formatResult(conv.result);

      // Transparent breakdown
      if (hcMidRate) hcMidRate.textContent = `1 ${hcFrom.value} = ${formatRate(conv.midRate)} ${hcTo.value}`;
      if (hcCommPct) hcCommPct.textContent = `${conv.commPct}%`;
      if (hcFee) {
        const grossOut = amount * conv.midRate;
        const feeOut = grossOut - conv.result;
        hcFee.textContent = `− ${fmtAmt(feeOut, hcTo.value)}`;
      }
      if (hcNetRate) hcNetRate.textContent = `1 ${hcFrom.value} = ${formatRate(conv.netRate)} ${hcTo.value}`;

      renderPay(conv.isCrypto);
      drawGraph(rates);
    }

    if (hcAmount) {
      // Ensure From and To are never the same currency.
      // `changed` = the select the user just touched; we move the OTHER one.
      function dedupe(changed) {
        if (hcFrom.value !== hcTo.value) return;
        const other = changed === hcFrom ? hcTo : hcFrom;
        const alt = [...other.options].find(o => o.value !== changed.value);
        if (alt) {
          other.value = alt.value;
          if (other._hcdd) other._hcdd.syncTrigger();
        }
      }

      hcAmount.addEventListener('input', () => { syncChips(); updateHeroConverter(latestRates); });
      hcFrom.addEventListener('change', () => { dedupe(hcFrom); updateHeroConverter(latestRates); });
      hcTo.addEventListener('change', () => { dedupe(hcTo); updateHeroConverter(latestRates); });
      if (hcSwap) {
        hcSwap.addEventListener('click', () => {
          const temp = hcFrom.value;
          hcFrom.value = hcTo.value;
          hcTo.value = temp;
          if (hcFrom._hcdd) hcFrom._hcdd.syncTrigger();
          if (hcTo._hcdd) hcTo._hcdd.syncTrigger();
          updateHeroConverter(latestRates);
        });
      }
      syncChips();
      renderPay(false);
    }

    /* ----------------------------------------------------------
       INIT — start the live-rate loop now that every element and
       handler above is defined (avoids const TDZ on first paint).
       ---------------------------------------------------------- */
    tick();
    setInterval(tick, REFRESH_MS);
  }


  /* ------------------------------------------------------------
     9. SMOOTH ANCHOR SCROLLING — offset for sticky header
     ------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header.getBoundingClientRect().height;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 4;
      window.scrollTo({
        top,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

})();
