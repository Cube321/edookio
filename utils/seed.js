// seedContent.js  ────────────────────────────────────────────────────────────
const uuid = require("uuid");
const Category = require("../models/category");
const Section = require("../models/section");
const Card = require("../models/card");
const Question = require("../models/question");

/* -------------------------------------------------------------------------- */
/* 0.  SEED DATA – add/clone objects here to create more categories           */
/* -------------------------------------------------------------------------- */
const categoriesSeed = [
  {
    text: "Psychologie",
    icon: "subject_10.png",
    sections: [
      {
        name: "Obecné základy psychologie",
        dummyContent: [
          {
            pageA: "Definujte pojem psychologie a její hlavní úkol.",
            pageB: `<p>Psychologie je věda, jejímž předmětem je <b>psychika člověka</b>.</p>
      <p>Úkolem psychologie je popsat a vysvětlit zákonitosti a mechanismy vzniku, utváření a průběhu <b>lidské psychiky</b>.</p>`,
            question: "Co je hlavním úkolem psychologie?",
            correctAnswer:
              "Popis a vysvětlení zákonitostí a mechanismů lidské psychiky.",
            wrongAnswers: [
              "Léčení fyzických onemocnění.",
              "Studium anatomie lidského těla.",
            ],
          },
          {
            pageA: "Definujte pojem psychika a popište její základní dimenze.",
            pageB: `<p>Psychika je souhrn <b>duševních dění</b>.</p>
      <p>Dimenze psychiky jsou:</p>
      <ul>
      <li><b>prožívání</b> - vnitřní, subjektivní psychické procesy a stavy. prožívání se dělí na vědomé a nevědomé;</li>
      <li><b>chování</b> - vnější projevy, které jsou zpracováním a vyjádřením vnitřní situace člověka.</li>
      </ul>
      <p>Chování  se dělí na expresivní a adaptivní.</p>
      <p>Dimenze jsou základním východiskem k poznání osobnosti člověka.</p>`,
            question:
              "Které z následujících tvrzení správně popisuje dimenze psychiky?",
            correctAnswer: "Prožívání a chování",
            wrongAnswers: ["Vědomé a nevědomé", "Expresivní a adaptivní"],
          },
          {
            pageA: "Vyjmenujte základní psychologické směry.",
            pageB: `<p>Mezi <b>základní psychologické směry</b> řadíme:</p>
      <ul>
        <li>Experimentální psychologie</li>
        <li>Behaviorismus</li>
        <li>Psychoanalýza</li>
        <li>Analytická psychologie</li>
        <li>Tvarová psychologie (gestaltismus)</li>
        <li>Hlubinná psychologie</li>
        <li>Neobehavioralismus</li>
        <li>Kognitivní psychologie</li>
        <li>Humanistická psychologie</li>
        <li>Transpersonální psychologie</li>
      </ul>
      <p>Psychologické směry se začínají objevovat během 19. století, do té doby byla psychologie pouze součástí filozofie.</p>`,
            question:
              "Který z následujících směrů je základní psychologický směr?",
            correctAnswer: "Behaviorismus",
            wrongAnswers: ["Existencialismus", "Postmodernismus"],
          },
          {
            pageA:
              "Vyjmenujte několik příkladů aplikovaných psychologických disciplín.",
            pageB: `<p>Aplikované psychologické disciplíny se <b>věnují oblastem lidské činnosti z hlediska psychologie</b> a je jich nepřeberné množství, patří mezi ně například klinická psychologie, poradenská psychologi, pedagogická psychologie či soudní (forenzní) psychologie.</p>`,
            question:
              "Která z následujících disciplín patří mezi aplikované psychologické disciplíny?",
            correctAnswer: "Soudní (forenzní) psychologie",
            wrongAnswers: ["Historická psychologie", "Teoretická psychologie"],
          },
          {
            pageA: "Jaké znáte metody výzkumu v psychologii?",
            pageB: `<p>Psychologie se řadí mezi empirické vědy, využívá ke sběru empirických dat celou řadu výzkumných metod. Nejvýznamější metody jsou:</p>
      <p><i><b>Pozorování</b></i> - základní psychologická metoda, sleduje jedince a jeho projevy. Rozlišujeme dva typy pozorování, extrospekci a introspekci.</p>
      <p><i><b>Rozhovor</b></i> - velmi častá metoda, která se zakládá na dotazování. Rozhovor může být standardizovaný (otázky jsou dány předem) nebo nestandardizovaný (volné otázky).</p>
      <p><i><b>Experiment</b></i> - experimentátor záměrně zasahuje do podmínek a vlivů na zkoumanou osobu tak, aby všechny proměnné byly kontrolovány a ze změn se daly kvantitativně vyjádřit souvislosti.</p>
      <p><i>Další metody</i> - sociometrie, sémantický diferenciál, obsahová analýza a psychodiagnostické metody.</p>`,
            question:
              "Která z následujících metod výzkumu v psychologii umožňuje experimentátorovi záměrně zasahovat do podmínek a kontrolovat proměnné?",
            correctAnswer: "Experiment",
            wrongAnswers: ["Rozhovor", "Pozorování"],
          },
          {
            pageA: "Co jsou to psychické jevy a jak je lze dělit?",
            pageB: `<p><b>Psychické jevy</b> jsou funkcí mozku, které se zformovaly vlivem společnosti a výchovy. Díky psychickým jevům člověk poznává svět a působí na něj.</p>
      <p>Psychický jevy lze dělit na:</p>
      <ul>
        <li>A) <b>Psychické procesy</b>
          <ul>
            <li>Poznávací procesy – čití, vnímání, učení, představy, řeč, myšlení;</li>
            <li>Procesy paměti – zapamatování, uchování, vybavení;</li>
            <li>Motivační procesy – motivace, vůle, potřeby.</li>
          </ul>
        </li>
        <li>B) <b>Psychické stavy</b> - aktuální stav psychiky, citové stavy, stavy pozornosti.</li>
        <li>C) <b>Vlastnosti osobnosti</b> - dlouhodobé, stále znaky psychiky (charakter, temperament, schopnosti a dovednosti, zaměřenost).</li>
      </ul>`,
            question: "Jak se dělí psychické jevy?",
            correctAnswer:
              "Psychické procesy, psychické stavy, vlastnosti osobnosti.",
            wrongAnswers: [
              "Psychické procesy, fyziologické stavy, vlastnosti osobnosti.",
              "Psychické procesy, emocionální stavy, vlastnosti osobnosti.",
            ],
          },
        ],
      },
      {
        name: "Vnímání, myšlení, řeč, emoce",
        dummyContent: [
          {
            pageA: "Jaké jsou funkce řeči?",
            pageB: `<p><b>Funkce řeči</b> jsou označovací, výrazová a vybízecí.</p>`,
            question: "Jaké jsou funkce řeči?",
            correctAnswer: "označovací, výrazová a vybízecí",
            wrongAnswers: [
              "označovací, analytická a hodnotící",
              "analytická, výrazová a popisná",
            ],
          },
          {
            pageA: "Jaké znáte poruchy řečí?",
            pageB: `<p>Mezi <b>poruchy řeči</b> se řadí:</p>
      <ul>
        <li><b>Afázie</b> – částečná či úplná ztráta schopnosti verbálně komunikovat;</li>
        <li><b>Mutismus</b> – útlum schopnosti verbálně komunikovat. Jedinec mluvit umí, ale odmítá to;</li>
        <li><b>Koktavost</b> – porucha plynulosti řeči.</li>
      </ul>`,
            question:
              "Která z následujících možností je porucha řeči, která zahrnuje částečnou či úplnou ztrátu schopnosti verbálně komunikovat?",
            correctAnswer: "Afázie",
            wrongAnswers: ["Mutismus", "Koktavost"],
          },
          {
            pageA: "Který proces předchází vnímání?",
            pageB: `<p>Vnímání předchází proces <b>čití</b>, při kterém naše smyslové orgány přijímají informace z okolí. Tyto informace jsou zpracovány, roztřízeny a zorganizovány mozkem = vnímání.</p>`,
            question: "Který proces předchází vnímání?",
            correctAnswer: "čití",
            wrongAnswers: ["paměť", "pozornost"],
          },
          {
            pageA: "Vyjmenujte několik příkladů poruchy paměti.",
            pageB: `<p>Mezi <b>poruchy paměti</b> se řadí:</p>
      <ul>
        <li><b>Hypomnézie</b> – snížení výkonnosti paměti (např. únava, léky);</li>
        <li><b>Hypermnézie</b> – nadměrná výkonnost paměti;</li>
        <li><b>Amnézie</b> – úplná ztráta paměti, časově ohraničená porucha.</li>
      </ul>`,
            question:
              "Která z následujících možností je příkladem poruchy paměti?",
            correctAnswer: "Amnézie",
            wrongAnswers: ["Hypotenze", "Hyperglykémie"],
          },
          {
            pageA: "Vyjmenujte operace myšlení.",
            pageB: `<p><b>Operace myšlení</b> jsou analýza, abstrakce, indukce, dedukce, generalizace a srovnávání.</p>`,
            question:
              "Která z následujících operací není součástí operací myšlení?",
            correctAnswer: "Klasifikace",
            wrongAnswers: ["Indukce", "Generalizace"],
          },
          {
            pageA: "Co je to paměť a čemu slouží?",
            pageB: `<p><b>Paměť</b> je soubor procesů, které umožňují osvojení informací, jejich uchování a vybavení.</p>`,
            question: "Co je to paměť?",
            correctAnswer:
              "Soubor procesů, které umožňují osvojení informací, jejich uchování a vybavení.",
            wrongAnswers: [
              "Zařízení, ve kterém jsou uložena data.",
              "Metoda pro rychlé vyhledávání informací na internetu.",
            ],
          },
          {
            pageA: "Co je to myšlení?",
            pageB: `<p><b>Myšlení</b> je proces řešení problémů. Jde o proces, který pracuje s vjemy a představami a umožňuje zpracování a využívání informací.</p>`,
            question: "Co je to myšlení?",
            correctAnswer:
              "Proces řešení problémů, který pracuje s vjemy a představami.",
            wrongAnswers: [
              "Proces, který se zabývá pouze fyzickými aktivitami.",
              "Jednoduchý automatický proces bez účasti vědomí.",
            ],
          },
          {
            pageA: "Definujte proces vnímání.",
            pageB: `<p><b>Vnímání</b> je psychický projev, jehož prostřednictvím poznáváme, co v daném okamžiku působí na naše <b>smyslové orgány</b>.</p>
      <p>Vnímání je základem pro naše poznávání vnitřního a vnějšího světa.</p>`,
            question: "Co je proces vnímání?",
            correctAnswer:
              "Psychický projev, kterým poznáváme, co zrovna v daném okamžiku působí na naše smyslové orgány.",
            wrongAnswers: [
              "Proces, kterým rozumíme a zpracováváme abstraktní myšlenky.",
              "Biologický proces, kterým se náš mozek regeneruje během spánku.",
            ],
          },
          {
            pageA: "Jaké jsou formy myšlení?",
            pageB: `<p>Formy myšlení:</p>
      <ul>
        <li><b>Pojem</b> – vystižení obecných a podstatných znaků jevu/předmětu;</li>
        <li><b>Soud</b> – vyjadřuje vztah mezi jevy/předměty nebo jejich znaky;</li>
        <li><b>Úsudek</b> – sděluje vztah mezi dvěma či více soudy.</li>
      </ul>`,
            question: "Která z následujících možností není formou myšlení?",
            correctAnswer: "Hypotéza",
            wrongAnswers: ["Pojem", "Úsudek"],
          },
          {
            pageA: "Jaké jsou nejznámější poruchy myšlení?",
            pageB: `<p>Mezi <b>poruchy myšlení</b> řadíme:</p>
      <ul>
        <li><b>Bradypsychismus</b> – zpomalené myšlení (únavа, intoxikace apod.);</li>
        <li><b>Tachypsychismus</b> – zrychlené myšlení (manické stavy apod.);</li>
        <li><b>Bludy</b> – pevné, nesprávné přesvědčení, které nelze vyvrátit.</li>
      </ul>`,
            question:
              "Která z následujících možností je příkladem poruchy myšlení popsané jako zpomalené myšlení?",
            correctAnswer: "Bradypsychismus",
            wrongAnswers: ["Tachypsychismus", "Bludy"],
          },
          {
            pageA: "Jaký je rozdíl mezi počitkem a vjemem?",
            pageB: `<p><b>Počitek</b> je obraz některého jednotlivého znaku vnímaného předmětu. <b>Vjem</b> je obraz předmětu jako celku.</p>
      <p>Počitek a vjem jsou obojí výsledkem vnímání.</p>`,
            question: "Jaký je rozdíl mezi počitkem a vjemem?",
            correctAnswer:
              "Počitek je obraz jednotlivého znaku, zatímco vjem je obraz předmětu jako celku.",
            wrongAnswers: [
              "Počitek je obraz předmětu jako celku, zatímco vjem je obraz jednotlivého znaku.",
              "Počitek a vjem jsou totožné pojmy.",
            ],
          },
          {
            pageA: "Jaký je rozdíl mezi vnitřní a vnější řečí?",
            pageB: `<p><b>Vnitřní řeč</b> je řečí sama pro sebe, nevyslovuje se nahlas; člověk ji využívá např. při plánování činností. <b>Vnější řeč</b> se obrací ke svému okolí – je mluvená a psaná.</p>`,
            question: "Jaký je rozdíl mezi vnitřní a vnější řečí?",
            correctAnswer:
              "Vnitřní řeč je řečí sama pro sebe, zatímco vnější řeč je mluvená a psaná.",
            wrongAnswers: [
              "Vnitřní řeč je mluvená a psaná, zatímco vnější řeč je řečí sama pro sebe.",
              "Vnitřní řeč je určena pro komunikaci s okolím, zatímco vnější řeč je řečí sama pro sebe.",
            ],
          },
          {
            pageA: "Jaké druhy paměti rozlišujeme dle délky uchování obsahu?",
            pageB: `<p>Dle délky uchování obsahu rozlišujeme <b>krátkodobou</b> a <b>dlouhodobou</b> paměť.</p>
      <p>V krátkodobé paměti se informace udrží několik sekund až minut, v dlouhodobé dobu podstatně delší.</p>`,
            question:
              "Jaké druhy paměti rozlišujeme dle délky uchování obsahu?",
            correctAnswer: "Krátkodobou a dlouhodobou",
            wrongAnswers: [
              "Krátkodobou a střednědobou",
              "Dlouhodobou a permanentní",
            ],
          },
          {
            pageA: "Jaké jsou základní procesy paměti?",
            pageB: `<p>Základní <b>procesy paměti</b>:</p>
      <ul>
        <li><b>Kódování</b> – přeměna informace do formy, kterou paměť dokáže uchovat;</li>
        <li><b>Uchování</b> – informace přebývají v paměti;</li>
        <li><b>Vybavení</b> – znovupoznání a reprodukce uchovaných informací.</li>
      </ul>`,
            question:
              "Který z následujících procesů patří mezi základní procesy paměti?",
            correctAnswer: "Kódování",
            wrongAnswers: ["Zapomínání", "Vymazání"],
          },
          {
            pageA: "Jaký je rozdíl mezi představou a fantazií?",
            pageB: `<p><b>Představa</b> je schopnost vybavit si podnět, který právě nepůsobí na naše smyslové orgány (méně přesná než bezprostřední vjem).</p>
      <p><b>Fantazie</b> vytváří relativně nové představy na základě zkušeností a paměťových stop, které bývají pozměněné.</p>`,
            question:
              "Jaký je hlavní rozdíl mezi představou a fantazií podle textu?",
            correctAnswer:
              "Představa se zakládá na minulém vnímání, zatímco fantazie vytváří relativně nové představy.",
            wrongAnswers: [
              "Představa je přesnější a zřetelnější než bezprostřední vjem, zatímco fantazie je méně přesná.",
              "Fantazie je založena na minulém vnímání, zatímco představa vytváří nové představy.",
            ],
          },
          {
            pageA: "Jaký je rozdíl mezi induktivním a deduktivním úsudkem?",
            pageB: `<p><b>Induktivní úsudek</b> vyvozuje obecné tvrzení z jednotlivých případů, zatímco <b>deduktivní úsudek</b> uplatňuje obecný poznatek na konkrétní jev/předmět.</p>`,
            question: "Jaký je rozdíl mezi induktivním a deduktivním úsudkem?",
            correctAnswer:
              "Induktivní úsudek znamená vyvozování obecného tvrzení z jednotlivých případů, zatímco deduktivní úsudek uplatňuje obecný poznatek na konkrétní jev/předmět.",
            wrongAnswers: [
              "Induktivní úsudek uplatňuje obecný poznatek na konkrétní jev/předmět, zatímco deduktivní úsudek vyvozuje obecné tvrzení z jednotlivých případů.",
              "Induktivní a deduktivní úsudek jsou synonymní termíny bez rozdílu.",
            ],
          },
          {
            pageA: "Definujte řeč.",
            pageB: `<p><b>Řeč</b> je <b>nástrojem myšlení</b>, který umožňuje komunikaci mezi lidmi. Vyjadřuje myšlenky a umožňuje je sdílet.</p>`,
            question: "Co je řeč?",
            correctAnswer:
              "Nástroj myšlení, který umožňuje komunikaci mezi lidmi.",
            wrongAnswers: [
              "Soustava zvuků bez konkrétního významu.",
              "Metoda výuky jazyků pomocí paměťových karet.",
            ],
          },
          {
            pageA: "Definujte pojem emoce.",
            pageB: `<p><b>Emoce</b> jsou psychické jevy, které hodnotí různé skutečnosti a vyjadřují prožívání subjektivního stavu jedince a jeho vztah k podnětům.</p>`,
            question: "Co jsou emoce?",
            correctAnswer:
              "Jsou psychické jevy, které hodnotí různé skutečnosti a vyjadřují prožívání subjektivního stavu jedince.",
            wrongAnswers: [
              "Jsou to fyziologické reakce na vnější podněty.",
              "Jsou to racionální rozhodnutí založená na logických úvahách.",
            ],
          },
        ],
      },
      {
        name: "Motivace, vůle, osobní vlastnosti",
        dummyContent: [
          {
            pageA: "Jaké dva základní druhy inteligence rozlišujeme?",
            pageB: `<p><b>Rozlišujeme inteligenci</b>:</p>
      <ul>
        <li><i>Fluidní</i> – vrozená, neměnná, nezávislá na učení;</li>
        <li><i>Krystalická</i> – zakládá se na zkušenostech a vědomostech, které jedinec získá učením, a na schopnosti tyto znalosti využívat.</li>
      </ul>`,
            question: "Jaké dva základní druhy inteligence rozlišujeme?",
            correctAnswer: "Fluidní a krystalická",
            wrongAnswers: ["Fluidní a dynamická", "Krystalická a statická"],
          },
          {
            pageA: "Jaké základní typy konstituční typologie popisuje?",
            pageB: `<p>Kretschmer rozlišoval <b>tři základní typy</b>:</p>
      <ul>
        <li><i>Pyknický typ</i> – malý vzrůst, větší břicho, krátké končetiny; otevřený, přizpůsobivý;</li>
        <li><i>Astenický typ</i> – vyšší, štíhlý; uzavřený, obrácený do sebe;</li>
        <li><i>Atletický typ</i> – sportovní postava, silná kostra; důkladný, pomalejší.</li>
      </ul>`,
            question:
              "Kolik základních typů konstituční typologie popisuje Kretschmer?",
            correctAnswer: "Tři",
            wrongAnswers: ["Čtyři", "Dva"],
          },
          {
            pageA: "Kdo vymyslel konstituční typologii?",
            pageB: `<p><b>Konstituční typologii</b> vymyslel Ernst <b>Kretschmer</b>, který studoval vztah mezi temperamentem a tělesnou konstitucí.</p>`,
            question: "Kdo vymyslel konstituční typologii?",
            correctAnswer: "Ernst Kretschmer",
            wrongAnswers: ["Sigmund Freud", "Carl Jung"],
          },
          {
            pageA: "Popište čtyři kategorie temperamentu dle Hippokrata.",
            pageB: `<p><b>Hippokrates</b> vytvořil nejstarší <b>typologii temperamentu</b> (později doplněnou Galenem):</p>
      <ul>
        <li><b>Sangvinik</b> – čilý, veselý, společenský; převládá krev.</li>
        <li><b>Cholerik</b> – rychlý, dráždivý; převládá žluč.</li>
        <li><b>Flegmatik</b> – klidný, netečný, pomalý; převládá hlen.</li>
        <li><b>Melancholik</b> – vážný, svědomitý, bojácný; převládá černá žluč.</li>
      </ul>`,
            question:
              "Který temperament podle Hippokrata je popisován jako klidný, netečný a pomalý?",
            correctAnswer: "Flegmatik",
            wrongAnswers: ["Cholerik", "Sangvinik"],
          },
          {
            pageA: "Jaké dva typy temperamentu rozlišoval Carl Gustav Jung?",
            pageB: `<p>Carl Gustav <b>Jung</b> rozlišoval dva základní temperamenty:</p>
      <ul>
        <li><b>Introvert</b> – zaměřený do nitra, plachý, s hlubokým vnitřním životem;</li>
        <li><b>Extrovert</b> – zaměřený na vnější svět, společenský, aktivní.</li>
      </ul>`,
            question: "Jaké dva typy temperamentu rozlišoval Carl Gustav Jung?",
            correctAnswer: "Introvert a extrovert",
            wrongAnswers: ["Melancholik a cholerik", "Optimista a pesimista"],
          },
          {
            pageA: "Definujte tvořivost.",
            pageB: `<p><b>Tvořivost</b> je soubor schopností, které umožňují tvůrčí činnost, jejímž výsledkem je něco nového a originálního.</p>`,
            question: "Co je tvořivost?",
            correctAnswer:
              "Soubor schopností umožňující tvůrčí činnost, jejímž výsledkem je něco nového, originálního.",
            wrongAnswers: [
              "Schopnost logického myšlení a analýzy dat.",
              "Proces učení se novým dovednostem.",
            ],
          },
          {
            pageA: "Co je to charakter?",
            pageB: `<p><b>Charakter</b> je souhrn psychických vlastností, které se projevují v <b>mravní stránce</b> lidského chování a jednání.</p>`,
            question: "Co je to charakter?",
            correctAnswer:
              "Souhrn psychických vlastností, které se projevují v mravní stránce lidského chování a jednání.",
            wrongAnswers: [
              "Schopnost člověka řešit složité matematické problémy.",
              "Fyzické vlastnosti člověka, jako je síla a vytrvalost.",
            ],
          },
          {
            pageA: "Co je to temperament?",
            pageB: `<p><b>Temperament</b> je soubor <b>vrozených psychických vlastností</b>, které určují dynamiku prožívání a chování osobnosti. Projevuje se tím, jak snadno reakce vznikají, jak jsou silné a rychle se střídají.</p>`,
            question: "Co je to temperament?",
            correctAnswer:
              "Soubor vrozených psychických vlastností, které určují dynamiku prožívání a chování osobnosti.",
            wrongAnswers: [
              "Naučené chování a zvyky získané během života.",
              "Soubor fyzických vlastností a vzhledu člověka.",
            ],
          },
          {
            pageA: "Definujte pojem inteligence.",
            pageB: `<p><b>Inteligence</b> je schopnost učit se ze zkušenosti, přizpůsobovat se okolnímu prostředí a řešit problémy. Její rozvoj závisí na dědičnosti i prostředí.</p>`,
            question:
              "Co je definováno jako schopnost jedince učit se ze zkušenosti, přizpůsobovat se okolnímu prostředí a řešit problémy?",
            correctAnswer: "Inteligence",
            wrongAnswers: ["Paměť", "Kreativita"],
          },
          {
            pageA: "Definujte pojem vůle.",
            pageB: `<p><b>Vůle</b> je soubor psychických procesů a vlastností, které <b>zajišťují řízení lidské činnosti a dosahování cílů</b>, zejména při překonávání překážek a rozhodování.</p>`,
            question: "Co je definicí pojmu vůle?",
            correctAnswer:
              "Soubor psychických procesů a vlastností, které zajišťují řízení lidské činnosti a dosahování cílů.",
            wrongAnswers: [
              "Schopnost pamatovat si informace a vybavovat si je.",
              "Soubor fyzických schopností, které umožňují člověku vykonávat různé činnosti.",
            ],
          },
          {
            pageA: "Jaký způsobem na Junga navázal Hans Jürgen Eysenck?",
            pageB: `<p>Hans Jürgen <b>Eysenck</b> zkombinoval Jungovu introverzi a extroverzi s <b>labilitou a stabilitou</b>, čímž vytvořil dvourozměrnou typologii osobnosti.</p>`,
            question: "Jak Hans Jürgen Eysenck navázal na teorií Carla Junga?",
            correctAnswer:
              "Zkombinoval Jungovu introverzi a extroverzi s labilitou a stabilitou.",
            wrongAnswers: [
              "Rozšířil Jungovu teorii archetypů.",
              "Zaměřil se na analýzu snů podobně jako Jung.",
            ],
          },
          {
            pageA: "Co je to pozornost?",
            pageB: `<p><b>Pozornost</b> je psychický stav, který se projevuje <b>zaměřeností a soustředěností na jev či činnost</b>.</p>`,
            question: "Co je to pozornost?",
            correctAnswer:
              "Psychický stav zaměřenosti a soustředěnosti na jev či činnost.",
            wrongAnswers: [
              "Schopnost rychle se rozhodovat.",
              "Citlivost na vnější podněty.",
            ],
          },
          {
            pageA: "Který psycholog vymyslel hierarchické řazení potřeb?",
            pageB: `<p><b>Hierarchické řazení potřeb</b> vytvořil Abraham Harold <b>Maslow</b>. Jeho pyramida řadí potřeby od fyziologických (spodek) po seberealizaci (vrchol).</p>`,
            question: "Který psycholog vymyslel hierarchické řazení potřeb?",
            correctAnswer: "Abraham Harold Maslow",
            wrongAnswers: ["Sigmund Freud", "Carl Rogers"],
          },
          {
            pageA: "Jaký je rozdíl mezi motivací a motivem?",
            pageB: `<p><b>Motivace</b> je souborem psychických procesů, které jedince podporují nebo tlumí v jeho činnosti. <b>Motiv</b> je <b>pohnutka</b>, psychologická příčina jednání člověka.</p>`,
            question: "Jaký je rozdíl mezi motivací a motivem?",
            correctAnswer:
              "Motivace je souborem psychických procesů, které jedince podporují nebo tlumí v jeho činnosti, zatímco motiv je pohnutka, psychologická příčina jednání člověka.",
            wrongAnswers: [
              "Motivace je psychologická příčina jednání člověka, zatímco motiv je souborem psychických procesů.",
              "Motivace a motiv jsou synonymní a znamenají totéž.",
            ],
          },
          {
            pageA: "Definujte psychické vlastnosti a uveďte některé z nich.",
            pageB: `<p><b>Psychické vlastnosti</b> jsou <b>relativně trvalé charakteristiky jedince</b>.</p>
      <p>Patří mezi ně schopnosti, inteligence, temperament a charakter.</p>`,
            question:
              "Které z následujících tvrzení správně popisuje psychické vlastnosti?",
            correctAnswer: "Jsou to relativně trvalé charakteristiky jedince.",
            wrongAnswers: [
              "Jedná se o dočasné emocionální stavy jedince.",
              "Jsou to fyziologické procesy v mozku.",
            ],
          },
        ],
      },
      {
        name: "Učení, vývojová psychologie, duševní poruchy",
        dummyContent: [
          {
            pageA: "Definujte proces učení.",
            pageB: `<p><b>Učení</b> je proces, který <b>rozšiřuje vrozené předpoklady a možnosti jedince</b>. Naučené je opakem vrozeného.</p>`,
            question: "Co je proces učení?",
            correctAnswer:
              "Proces, který rozšiřuje vrozené předpoklady a možnosti jedince.",
            wrongAnswers: [
              "Proces, který omezuje vrozené předpoklady jedince.",
              "Proces, který nemá vliv na vrozené předpoklady jedince.",
            ],
          },
          {
            pageA: "Vyjmenuj několik příkladů poruch učení.",
            pageB: `<p><b>Poruchami učení</b> jsou například:</p>
      <ul>
        <li><b>Dyslexie</b> – porucha čtení; problémy se skládáním hlásek ve slabiky, přehazování písmen;</li>
        <li><b>Dysgrafie</b> – porucha psaní; potíže s napodobováním písmen, zapamatováním jejich tvaru;</li>
        <li><b>Dysortografie</b> – porucha pravopisu; obtížné osvojení gramatických pravidel.</li>
      </ul>`,
            question:
              "Která z následujících poruch učení se týká problémů s pravopisem?",
            correctAnswer: "Dysortografie",
            wrongAnswers: ["Dyslexie", "Dysgrafie"],
          },
          {
            pageA: "Definujte pojem postoje.",
            pageB: `<p><b>Postoje</b> jsou <b>sklony člověka reagovat ustáleným způsobem</b> na předměty, osoby či situace. Odrážejí hodnotící vztah člověka k určité skutečnosti a jsou produktem učení.</p>`,
            question: "Co jsou postoje?",
            correctAnswer:
              "Sklony člověka reagovat ustáleným způsobem na předměty, osoby, situace.",
            wrongAnswers: [
              "Náhodné reakce člověka na nové podněty.",
              "Geneticky dané návyky a chování.",
            ],
          },
          {
            pageA: "Jaké jsou základní složky vlastního “já”?",
            pageB: `<p>Vlastní <b>“já”</b> má <b>tři základní složky</b>, které se vyvíjejí po celý život:</p>
      <ul>
        <li><i>Tělesné “já”</i> – vnímání a prožívání vlastního těla;</li>
        <li><i>Psychické “já”</i> – uvědomění si vlastních pocitů a myšlenek;</li>
        <li><i>Sociální “já”</i> – uvědomění si názorů ostatních na vlastní osobu.</li>
      </ul>`,
            question: "Jaké jsou základní složky vlastního 'já'?",
            correctAnswer: "Tělesné 'já', Psychické 'já', Sociální 'já'",
            wrongAnswers: [
              "Fyzické 'já', Emocionální 'já', Kulturní 'já'",
              "Biologické 'já', Mentální 'já', Společenské 'já'",
            ],
          },
          {
            pageA: "Popište pojetí osobnosti podle Sigmunda Freuda.",
            pageB: `<p>Podle Sigmunda <b>Freuda</b> se osobnost skládá ze tří složek:</p>
      <p><i>Id</i> – pudová, nevědomá složka usilující o okamžité uspokojení potřeb;</p>
      <p><i>Ego</i> – řídí se principem reality, zvažuje činy a jejich následky;</p>
      <p><i>Superego</i> – morální instance, vzniká interiorizací společenských norem.</p>`,
            question:
              "Která složka osobnosti podle Sigmunda Freuda je zdrojem energie pro ostatní dvě složky a řídí se principem okamžitého uspokojení potřeb?",
            correctAnswer: "Id",
            wrongAnswers: ["Ego", "Superego"],
          },
          {
            pageA: "Čím se zabývá vývojová psychologie?",
            pageB: `<p><b>Vývojová psychologie</b> zkoumá <b>etapy vývoje</b> člověka a návaznost jejich charakteristik v průběhu života.</p>`,
            question: "Čím se zabývá vývojová psychologie?",
            correctAnswer: "Etapami vývoje.",
            wrongAnswers: ["Behaviorálními změnami.", "Psychickými poruchami."],
          },
          {
            pageA: "Popište stádia vývoje osobnosti podle Freuda.",
            pageB: `<p>Sigmund <b>Freud</b> rozlišil pět vývojových stádií na základě biologických zdrojů uspokojení:</p>
      <ul>
        <li><i>Orální stadium</i> (0–1 rok) – uspokojení orální stimulací;</li>
        <li><i>Anální stadium</i> (2–3 roky) – uspokojení zadržováním/vyprazdňováním;</li>
        <li><i>Falické stadium</i> (4–5 let) – zaměřeno na genitálie, Oidipův/Elektry komplex;</li>
        <li><i>Stadium latence</i> (6–11 let) – relativní stabilita;</li>
        <li><i>Genitální stadium</i> (od 11–12 let) – zralá sexualita, ukončení vývoje osobnosti.</li>
      </ul>`,
            question:
              "Které stadium podle Freuda je charakterizováno orální stimulací jako zdrojem uspokojení?",
            correctAnswer: "Orální stadium",
            wrongAnswers: ["Anální stadium", "Genitální stadium"],
          },
          {
            pageA: "Popište čtyři etapy vývoje člověka dle Jeana Piageta.",
            pageB: `<p>Jean <b>Piaget</b> rozlišil čtyři etapy kognitivního vývoje:</p>
      <ul>
        <li><i>Senzomotorické stadium</i> (0–2 roky) – poznávání světa skrze vnímání a pohyb;</li>
        <li><i>Předoperační stadium</i> (2–7 let)<br>
          – symbolické a předpojmové myšlení (2–4 roky),<br>
          – názorné myšlení (4–8 let);</li>
        <li><i>Stadium konkrétních operací</i> (8–12 let) – logické operace vázané na konkrétní situace;</li>
        <li><i>Stadium formálních operací</i> (od 11–12 let) – abstraktní a hypotetické myšlení.</li>
      </ul>`,
            question:
              "Která z následujících možností správně popisuje senzomotorické stadium dle Jeana Piageta?",
            correctAnswer:
              "Hlavní roli při poznávání světa hraje vnímání a pohyb, rozvíjí se záměrné jednání.",
            wrongAnswers: [
              "Dítě zvládá základní myšlenkové operace, které jsou vázané na názorné vnímání.",
              "Dítě dokáže využívat abstraktní myšlení.",
            ],
          },
          {
            pageA: "Vyjmenujte etapy vývoje podle Eriksona.",
            pageB: `<p>Erik H. <b>Erikson</b> rozdělil život člověka do devíti psychosociálních fází, v nichž se řeší specifické konflikty: prenatální fáze, kojenecký věk, batolecí věk, předškolní věk, mladší školní věk, období dospívání, mladá dospělost, střední dospělost, pozdní dospělost.</p>`,
            question:
              "Která z následujících fází není součástí Eriksonových etap vývoje?",
            correctAnswer: "Předškolní dospělost",
            wrongAnswers: ["Kojenecký věk", "Mladá dospělost"],
          },
          {
            pageA: "Co je to duševní porucha?",
            pageB: `<p><b>Duševní porucha</b> je <b>změna psychických jevů</b>, projevující se v chování a prožívání a způsobující sociální obtíže.</p>`,
            question: "Co je to duševní porucha?",
            correctAnswer:
              "Změna psychických jevů, které se projevují v chování a prožívání.",
            wrongAnswers: [
              "Nesprávná diagnóza lékaře.",
              "Nedostatek sociálních dovedností.",
            ],
          },
          {
            pageA: "Jak se duševní poruchy dělí?",
            pageB: `<p>Duševní poruchy se <b>dělí</b> na:</p>
      <ul>
        <li><b>Neurózy</b> – funkční poruchy, přechodnějšího rázu (např. fobie);</li>
        <li><b>Psychózy</b> – závažné poruchy narušující osobnost (např. schizofrenie, bipolární porucha).</li>
      </ul>`,
            question: "Jak se dělí duševní poruchy?",
            correctAnswer: "Na neurózy a psychózy.",
            wrongAnswers: [
              "Na bipolární poruchu a schizofrenii.",
              "Na fobie a neuropsychické poruchy.",
            ],
          },
        ],
      },
    ],
  },
  {
    text: "Filozofie",
    icon: "subject_11.png",
    sections: [
      {
        name: "Filozofie a kosmologické období",
        dummyContent: [
          {
            pageA:
              "Co považovali eleaté za pralátku? Vyjmenujte některé zástupce této školy.",
            pageB: `<p>Navazují na myšlenku Anaximandra a za pralátku považují <b>apeiron</b>. Apeiron plně vyplňuje světový prostor, tudíž na zemi není prázdný prostor, kde by byl možný pohyb.</p>
      <p>Mezi zástupce se řadí Zenón z Eleje, Xenofanés a Parmenidés.</p>`,
            question: "Jakou pralátku považovali eleaté za základ světa?",
            correctAnswer: "Apeiron",
            wrongAnswers: ["Vodu", "Vzduch"],
          },
          {
            pageA:
              "Popište základní myšlenku mladších fyziků a jmenujete některé zástupce této školy.",
            pageB: `<p>Hlavní myšlenkou <b>mladších fyziků</b> je, že podstata bytí není jednotná, ale skládá se z více částí.</p>
      <p>Mezi zástupce se řadí <i>Empedoklés</i> a <i>Anaxagorás</i>.</p>`,
            question: "Kdo patří mezi zástupce mladších fyziků?",
            correctAnswer: "Empedoklés",
            wrongAnswers: ["Aristotelés", "Platón"],
          },
          {
            pageA: "Popište arché dle Pythagora.",
            pageB: `<p>Dle <b>Pythagora</b> je <b>arché logos</b>, tedy číslo a matematické vztahy.</p>
      <p>Svět i vesmír se řídí matematickými vztahy; tělesa ve vesmíru při svém pohybu vydávají zvuky – tzv. <b>harmonii sfér</b>.</p>`,
            question: "Co je dle Pythagora arché?",
            correctAnswer: "Číslo a matematické vztahy",
            wrongAnswers: ["Oheň", "Voda"],
          },
          {
            pageA: "Co je to kosmologické období?",
            pageB: `<p><b>Kosmologické období</b> (předsokratovské) trvalo zhruba od 6. do 5. století př. n. l. Mezi nejznámější školy patří Milétská škola, Pythagorejská škola, Eleáté, mladší fyzikové a atomisté.</p>`,
            question: "Jaké období je také známé jako předsokratovské období?",
            correctAnswer: "Kosmologické období",
            wrongAnswers: ["Renesanční období", "Středověké období"],
          },
          {
            pageA:
              "Co za arché považovali filozofové Milétské školy Thálet, Anaximandros a Anaximenés?",
            pageB: `<p>Podle <b>Tháleta</b> bylo <b>arché voda</b>.</p>
      <p><b>Anaximandros</b> pokládal za <b>arché apeiron</b> – neomezené, nekonečné.</p>
      <p><b>Anaximenés</b> tvrdil, že <b>arché je vzduch</b>; z něj zředěním vzniká oheň a zhušťováním voda, země, kamení.</p>`,
            question:
              "Co za arché považoval Anaximandros, filozof Milétské školy?",
            correctAnswer: "Apeiron",
            wrongAnswers: ["Voda", "Vzduch"],
          },
          {
            pageA:
              "Z čeho se svět skládá podle atomistů? Jmenujte zástupce tohoto směru.",
            pageB: `<p><b>Atomisté</b> tvrdí, že svět se skládá z prázdného (prostor) a plného – nedělitelných částic (<b>atomů</b>). Atomy jsou kvalitativně stejné, liší se kvantitou; věci vznikají jejich slučováním a zanikají rozpadem.</p>
      <p>Zakladatelem byl <b>Leukippos</b> (zákon kauzality), dalším představitelem <b>Démokritos</b>.</p>`,
            question: "Kdo byl zakladatelem atomistů?",
            correctAnswer: "Leukippos",
            wrongAnswers: ["Démokritos", "Epikuros"],
          },
          {
            pageA: "Co za arché považoval Hérakleitos?",
            pageB: `<p><b>Hérakleitos</b> z Efesu považoval za <b>arché oheň</b>, protože oheň dává věcem život a symbolizuje neustálou proměnu.</p>`,
            question: "Co za arché považoval Hérakleitos?",
            correctAnswer: "oheň",
            wrongAnswers: ["voda", "vzduch"],
          },
          {
            pageA: "Definujte výraz arché.",
            pageB: `<p><b>Arché</b> označuje <b>pralátku</b>, podstatu světa, z níž všechno vzniklo. Je klíčovým pojmem filozofů kosmologického období.</p>`,
            question:
              "Co znamená výraz arché v kontextu filozofie kosmologického období?",
            correctAnswer:
              "Pralátku, podstatu světa, ze které všechno vzniklo.",
            wrongAnswers: [
              "Způsob, jakým lidé komunikovali ve starověkém Řecku.",
              "Nástroj používaný k měření času v antickém období.",
            ],
          },
          {
            pageA: "Vyjmenujte filozofické disciplíny",
            pageB: `<p>Mezi <b>filozofické disciplíny</b> patří:</p>
      <ul>
        <li>Ontologie (metafyzika)</li>
        <li>Gnoseologie (epistemologie)</li>
        <li>Logika</li>
        <li>Filozofická antropologie</li>
        <li>Etika</li>
        <li>Estetika</li>
        <li>Filozofie jazyka</li>
        <li>Axiologie</li>
        <li>Filozofie náboženství</li>
        <li>Politická filozofie</li>
      </ul>`,
            question:
              "Která z následujících disciplín se zabývá původem, podstatou člověka a jeho existencí?",
            correctAnswer: "Filozofická antropologie",
            wrongAnswers: ["Logika", "Estetika"],
          },
          {
            pageA: "Co je to filozofie? Čeho se filozofie snaží dosáhnout?",
            pageB: `<p><b>Filozofie</b> zkoumá rozum a realitu z různých pohledů, klade otázky o podstatě skutečnosti a o možnostech jejího poznání.</p>
      <p><b>Filozofické tázání</b> začíná, když svět vytvořený míněním ztrácí samozřejmost. Filozof – „hledač moudrosti“ – hledá řešení aktuálních problémů.</p>`,
            question: "Čím se zabývá filozofie?",
            correctAnswer:
              "Rozumem a realitou z různých druhů pohledů, klade si otázky o podstatě skutečnosti a o možnostech jejího poznání.",
            wrongAnswers: [
              "Zkoumáním chemických procesů v živých organismech.",
              "Analýzou ekonomických teorií a trhů.",
            ],
          },
          {
            pageA:
              "Popište aporie (argumentační příklady) Zenóna z Eleje o Achillovy a želvě a o letícím šípu.",
            pageB: `<p><b>Aporie</b> Zenóna z Eleje <b>o Achillovi a želvě</b>: želvu s jakýmkoli náskokem nemůže Achilles dohonit, protože když doběhne na její původní místo, želva je už dále.</p>
      <p>V aporii <b>o letícím šípu</b> se šíp v každém okamžiku nachází v klidu, takže je vlastně nehybný.</p>`,
            question:
              "Které z následujících tvrzení nejlépe popisuje aporii Zenóna z Eleje o Achillovi a želvě?",
            correctAnswer:
              "Achilles nikdy nedožene želvu, která má sebemenší náskok.",
            wrongAnswers: [
              "Achilles dožene želvu, pokud bude běžet dostatečně rychle.",
              "Achilles musí želvu předběhnout, protože je rychlejší.",
            ],
          },
        ],
      },
      {
        name: "Sokratikové a helénismus",
        dummyContent: [
          {
            pageA: "Co je podstatou sokratovské metody?",
            pageB: `<p><b>Sokratovská metoda</b> je zvláštní <b>druh rozhovoru</b>. Sokrates klade otázky žákovi, ten odpovídá a tím se učí. Sokrates svou metodu přirovnával k porodnictví – pomáhá „zrodit“ myšlenky druhých.</p>`,
            question: "Co je podstatou sokratovské metody?",
            correctAnswer:
              "Zvláštní druh rozhovoru, kde Sokrates klade otázky a žák odpovídá, čímž se učí.",
            wrongAnswers: [
              "Sokrates přednáší teoretické koncepty a žáci si dělají poznámky.",
              "Sokrates používá psané texty k vysvětlení složitých filozofických myšlenek.",
            ],
          },
          {
            pageA: "Vyjmenujte nejdůležitější Platónova díla.",
            pageB: `<p>Nejzásadnější Platónova díla:</p>
      <ul>
        <li><i>Obrana Sokratova</i></li>
        <li><i>Faidón</i></li>
        <li><i>Políteiá (Ústava)</i></li>
      </ul>`,
            question:
              "Které z následujících děl není mezi nejzásadnějšími Platónovými díly?",
            correctAnswer: "Euthyfrón",
            wrongAnswers: ["Obrana Sokratova", "Faidón"],
          },
          {
            pageA: "Jaké dva světy rozlišuje Platón dle své ontologie?",
            pageB: `<p>Platón rozlišuje <b>svět idejí</b> (neměnný, dokonalý, poznatelný rozumem) a <b>svět smyslový</b> (proměnlivý, hmotný, přístupný smyslům).</p>`,
            question: "Jaké dva světy rozlišuje Platón dle své ontologie?",
            correctAnswer: "svět idejí a svět smyslový",
            wrongAnswers: [
              "svět hmoty a svět energie",
              "svět duchovní a svět materiální",
            ],
          },
          {
            pageA: "Co je to idea podle Platóna?",
            pageB: `<p>Idea je stěžejní pojem Platónovy ontologie – <b>pravá metafyzická realita</b>. Nejvyšší je <b>idea dobra</b>, která umožňuje poznat všechny ostatní ideje.</p>`,
            question: "Co je podle Platóna nejvyšší idea?",
            correctAnswer: "idea dobra",
            wrongAnswers: ["idea pravdy", "idea krásy"],
          },
          {
            pageA: "Co jsou to stíny idejí podle Platóna?",
            pageB: `<p><b>Stíny idejí</b> tvoří náš <b>smyslový hmotný svět</b>; vnímáme jen nedokonalé odrazy skutečných idejí.</p>`,
            question: "Co jsou to stíny idejí podle Platóna?",
            correctAnswer: "Náš smyslový hmotný svět",
            wrongAnswers: [
              "Dokonalé ideje, které existují mimo náš svět",
              "Nedosažitelné myšlenky, které nikdy nemůžeme pochopit",
            ],
          },
          {
            pageA: "Popište teorii rozpomínání podle Platóna.",
            pageB: `<p>Podle <b>teorie rozpomínání</b> se duše během života jen smutně rozpomíná na svět idejí, odkud pochází; plně si vzpomene až po smrti.</p>`,
            question: "Co je to idea idejí?",
            correctAnswer: "Idea nejvyššího dobra",
            wrongAnswers: ["Idea krásy", "Idea pravdy"],
          },
          {
            pageA: "Vyjmenujte  Platónovy části duše a jejich ctnosti.",
            pageB: `<p>Tři části duše a jejich ctnosti podle Platóna:</p>
      <ul>
        <li><i>Rozumová</i> – moudrost</li>
        <li><i>Vznětlivá</i> – statečnost</li>
        <li><i>Žádostivá</i> – umírněnost</li>
      </ul>
      <p>V rovnováze dávají ctnost spravedlnost.</p>`,
            question:
              "Jaké jsou tři části duše podle Platóna a jejich ctnosti?",
            correctAnswer:
              "Rozumová - moudrost, Vznětlivá - statečnost, Žádostivá - umírněnost",
            wrongAnswers: [
              "Rozumová - statečnost, Vznětlivá - moudrost, Žádostivá - umírněnost",
              "Rozumová - umírněnost, Vznětlivá - moudrost, Žádostivá - statečnost",
            ],
          },
          {
            pageA: "Jaké 3 vrstvy obyvatel rozlišuje Platón?",
            pageB: `<p>Platón dělí společnost na <b>vládce</b> (filozofy), <b>strážce</b> (bojovníky) a <b>řemeslníky/obchodníky/zemědělce</b>.</p>`,
            question: "Které 3 vrstvy obyvatel rozlišuje Platón?",
            correctAnswer: "vládci, strážci, řemeslníci",
            wrongAnswers: [
              "vládci, obchodníci, zemědělci",
              "strážci, farmáři, filozofové",
            ],
          },
          {
            pageA: "Vyjmenujete základní elementy Aristotelovy logiky.",
            pageB: `<p>Aristotelés založil logiku a rozlišil pět elementů: <b>pojmy, kategorie, soudy, úsudky, důkazy</b>.</p>`,
            question: "Co je to sylogismus?",
            correctAnswer:
              "Druh logického tvrzení, který se skládá z premis a konkluze.",
            wrongAnswers: [
              "Matematická rovnice, která se používá v aritmetice.",
              "Historická událost, která se stala v antickém Řecku.",
            ],
          },
          {
            pageA:
              "Co je to entelechie? Jaké části duše rozlišuje Aristoteles?",
            pageB: `<p><b>Entelechie</b> = duše jako forma, která uvádí tělo do pohybu.</p>
      <p>Aristoteles rozlišuje tři části duše: rostlinnou, živočišnou a rozumovou.</p>`,
            question: "Kolik částí duše rozlišuje Aristoteles?",
            correctAnswer: "Tři",
            wrongAnswers: ["Dvě", "Čtyři"],
          },
          {
            pageA: "Jaké čtyři příčiny jsoucna rozlišuje Aristoteles?",
            pageB: `<p>Čtyři příčiny: <i>látková, formální, působící</i> a <i>cílová (účelová)</i>.</p>`,
            question:
              "Která z následujících příčin není jednou z čtyř příčin jsoucna podle Aristotela?",
            correctAnswer: "Příčina náhodná",
            wrongAnswers: ["Látková příčina", "Formální příčina"],
          },
          {
            pageA: "Jaká ctnost je podle Aristotela nejvyšším dobrem?",
            pageB: `<p>Pro Aristotela je nejvyšší ctností <b>blaženost (eudaimonia)</b>.</p>`,
            question: "Jaká ctnost je podle Aristotela nejvyšším dobrem?",
            correctAnswer: "blaženost",
            wrongAnswers: ["spravedlnost", "odvaha"],
          },
          {
            pageA: "Jaké druhy ctností rozlišuje Aristoteles?",
            pageB: `<p>Aristoteles rozlišuje tři druhy ctností:</p>
      <ul>
        <li><i>Etické</i> (morální)</li>
        <li><i>Dianoetické</i> (rozumové)</li>
        <li><i>Poietické</i> (praktické)</li>
      </ul>`,
            question: "Kolik druhů ctností rozlišuje Aristoteles?",
            correctAnswer: "Tři",
            wrongAnswers: ["Pět", "Čtyři"],
          },
          {
            pageA: "Jaká je nejlepší forma vlády podle Aristotela?",
            pageB: `<p>Aristoteles považuje za nejlepší formu vlády <b>monarchii</b>, pokud vládce vládne ve prospěch celku.</p>`,
            question: "Jaká je nejlepší forma vlády podle Aristotela?",
            correctAnswer: "Monarchie",
            wrongAnswers: ["Demokracie", "Oligarchie"],
          },
          {
            pageA: "Co Aristoteles považuje za základní jednotku státu?",
            pageB: `<p>Základní jednotkou státu je podle Aristotela <b>rodina</b>.</p>`,
            question: "Co považuje Aristoteles za základní jednotku státu?",
            correctAnswer: "Rodinu",
            wrongAnswers: ["Jednotlivce", "Obec"],
          },
          {
            pageA: "Definujte helénistické období filozofie.",
            pageB: `<p><b>Helénistické období</b> (od smrti Alexandra Velikého do počátku letopočtu) mísí řecké myšlení s orientálními prvky a soustředí se na etiku.</p>`,
            question: "Co charakterizuje helénistické období filozofie?",
            correctAnswer: "Obrat od přírody a člověka a zaměření na etiku.",
            wrongAnswers: [
              "Zaměření na přírodní vědy a matematiku.",
              "Pokračování v rozvoji politické filozofie a demokracie.",
            ],
          },
          {
            pageA: "Jaké školy řadíme k helénistickému období?",
            pageB: `<p>K helénistickým školám patří <b>skepticismus, eklekticismus, epikureismus, stoá a novoplatónismus</b>.</p>`,
            question: "Které školy řadíme k helénistickému období?",
            correctAnswer:
              "skepticismus, eklekticismus, epikureismus, stoia a novoplatónismus",
            wrongAnswers: [
              "sofismus, pythagoreismus, aristotelismus, scholastika",
              "stoicismus, cynismus, hedonismus, materialismus",
            ],
          },
          {
            pageA: "Co je to apatheia? K jaké škole se tento pojem řadí?",
            pageB: `<p><b>Apatheia</b> znamená stav, v němž jsou potlačeny všech­ny vášně a člověk se řídí pouze rozumem – ideál <b>stoické školy</b>.</p>`,
            question: "Která filozofická škola je spojená s pojmem apatheia?",
            correctAnswer: "Stoická škola",
            wrongAnswers: ["Epikurejská škola", "Platónská akademie"],
          },
          {
            pageA:
              "Co je to stav ataraxie? S jakou školou se tento pojem pojí?",
            pageB: `<p><b>Ataraxie</b> je stav vyváženého klidu ducha – ideál <b>epikurejské školy</b>.</p>`,
            question:
              "Co je to stav ataraxie a s jakou školou se tento pojem pojí?",
            correctAnswer: "Stav vyváženého klidu ducha; epikurejská škola",
            wrongAnswers: [
              "Stav fyzického zdraví; stoická škola",
              "Stav hluboké meditace; pythagorejská škola",
            ],
          },
        ],
      },
      {
        name: "Filozofie středověku",
        dummyContent: [
          {
            pageA: "Na jaká období rozdělujeme filozofie středověku?",
            pageB: `<p>Rozlišujeme dvě hlavní období středověké filozofie: <b>patristické</b> a <b>scholastické</b>.</p>`,
            question: "Na jaká období rozdělujeme filozofie středověku?",
            correctAnswer: "patristické a scholastické",
            wrongAnswers: ["antické a moderní", "renesanční a barokní"],
          },
          {
            pageA: "Co je to hereze?",
            pageB: `<p><b>Hereze</b> jsou v křesťanské nauce bludná učení, která se <b>odlišují od oficiálního učení církve</b>.</p>`,
            question: "Co jsou hereze v křesťanské nauce?",
            correctAnswer:
              "Bludná učení, která se odlišují od oficiálního učení církve.",
            wrongAnswers: [
              "Nauky, které jsou v souladu s oficiálním učením církve.",
              "Obřady a rituály, které se praktikují během bohoslužeb.",
            ],
          },
          {
            pageA: "Jmenujte několik děl svatého Augustina.",
            pageB: `<p>Mezi díla svatého Augustina patří <i>Vyznání</i>, <i>O Trojici</i>, <i>O obci boží</i> a další.</p>`,
            question: "Které z následujících děl je napsáno svatým Augustinem?",
            correctAnswer: "Vyznání",
            wrongAnswers: ["Divina Commedia", "Don Quijote"],
          },
          {
            pageA: "Co je to predestinace podle svatého Augustina?",
            pageB: `<p><b>Predestinace</b> znamená <b>božské předurčení</b>, kdo bude spasen a kdo zatracen.</p>`,
            question: "Co je to predestinace podle svatého Augustina?",
            correctAnswer:
              "Božské předurčení, kdo bude spasen a kdo odsouzen k zatracení.",
            wrongAnswers: [
              "Lidská schopnost rozhodovat o svém osudu.",
              "Nauka o tom, že všichni lidé jsou od narození hříšní.",
            ],
          },
          {
            pageA:
              "Jaký je podle svatého Augustina vztah mezi časem a vědomím?",
            pageB: `<p>Čas nelze oddělit od vědomí – minulost žije ve vzpomínce, budoucnost v očekávání, přítomnost neustále mizí do minulosti.</p>`,
            question:
              "Jaký je podle svatého Augustina vztah mezi časem a vědomím?",
            correctAnswer: "Čas nelze oddělit od našeho vědomí",
            wrongAnswers: [
              "Čas existuje nezávisle na našem vědomí",
              "Čas je iluze, která neexistuje",
            ],
          },
          {
            pageA: "Co je podle svatého Augustina nejvyšším principem?",
            pageB: `<p>Nejvyšším principem je <b>Bůh</b> – zdroj světla, pravdy a nejvyšší dobro.</p>`,
            question: "Co považuje svatý Augustin za nejvyšší princip?",
            correctAnswer: "Boha",
            wrongAnswers: ["Rozumové poznání", "Světské bohatství"],
          },
          {
            pageA: "Vyjmenujte složky duše podle svatého Augustina.",
            pageB: `<p>Augustin rozlišuje tři složky duše: <b>rozum, vůli a cit</b>.</p>`,
            question: "Které tři složky duše rozlišuje svatý Augustin?",
            correctAnswer: "rozum, vůli a cit",
            wrongAnswers: ["rozum, tělo a cit", "vůli, cit a tělo"],
          },
          {
            pageA:
              "Jaký je podle učení svatého Augustina rozdíl mezi obcí pozemskou a obcí boží?",
            pageB: `<p>Pozemská obec je nedokonalá a dočasná; obec boží je věčná a plná omilostněných.</p>`,
            question:
              "Jaký je podle učení svatého Augustina rozdíl mezi obcí pozemskou a obcí boží?",
            correctAnswer:
              "Pozemská obec je nedokonalá a plná hříšníků, zatímco v obci boží jsou všichni omilostněni.",
            wrongAnswers: [
              "Pozemská obec je věčná a nezměnitelná, zatímco obec boží je dočasná a plná hříšníků.",
              "Pozemská obec je ideální a bez hříšníků, zatímco v obci boží se odehrává zápas o pravé určení člověka.",
            ],
          },
          {
            pageA: "Co je to scholastika?",
            pageB: `<p><b>Scholastika</b> je systém nauk vyučovaných na středověkých školách, usilující o racionální uchopení víry.</p>`,
            question: "Co je to scholastika?",
            correctAnswer:
              "Systém nauk vyučovaných na středověkých školách, inspirovaný středověkou spekulací.",
            wrongAnswers: [
              "Systém právních předpisů používaných v antickém Římě.",
              "Moderní vzdělávací metoda využívající online platformy.",
            ],
          },
          {
            pageA: "Co je to scholastická metoda?",
            pageB: `<p>Spojuje <b>přednášku</b> (komentář autority) a <b>disputaci</b> (vědeckou rozpravu).</p>`,
            question: "Jaké jsou dva hlavní prvky scholastické metody?",
            correctAnswer: "Přednáška a disputace",
            wrongAnswers: [
              "Laboratorní experimenty a semináře",
              "Praktické cvičení a esej",
            ],
          },
          {
            pageA: "V čem spočívá spor o univerzálie?",
            pageB: `<p>Spor o to, zda obecné pojmy existují samostatně (realisté), jen v rozumu (konceptualisté), nebo jsou pouze jména (nominalisté).</p>`,
            question:
              "Které tři hlavní názorové proudy se postupně vykrystalizovaly ve sporu o univerzálie?",
            correctAnswer: "Realisté, konceptualisté a nominalisté",
            wrongAnswers: [
              "Realisté, idealisté a materialisté",
              "Nominalisté, empiristé a racionalisté",
            ],
          },
          {
            pageA: "Jaká jsou nejdůležitější díla Tomáše Akvinského?",
            pageB: `<p>Akvinského hlavní díla: <i>Suma proti pohanům</i>, <i>Suma teologická</i>, <i>Komentáře k Aristotelovi</i>.</p>`,
            question: "Které z následujících děl NENÍ dílem Tomáše Akvinského?",
            correctAnswer: "Kritika čistého rozumu",
            wrongAnswers: ["Suma teologická", "Suma proti pohanům"],
          },
          {
            pageA:
              "Vyjmenujte pět důkazu boží existence podle Tomáše Akvinského.",
            pageB: `<p>Pět cest: z pohybu, z řetězu příčin, z nahodilosti, ze stupňovitosti jsoucna a z účelnosti přírody.</p>`,
            question:
              "Který z následujících důkazů boží existence není součástí pěti důkazů podle Tomáše Akvinského?",
            correctAnswer: "Důkaz z pohybu a času",
            wrongAnswers: ["Důkaz z pohybu", "Důkaz z nahodilého"],
          },
          {
            pageA: "Jak lze podle Akvinského poznat Boha?",
            pageB: `<p>K poznání Boha vedou dvě cesty: <b>rozum</b> a <b>víra</b>.</p>`,
            question: "Jaké dvě cesty vedou k poznání Boha podle Akvinského?",
            correctAnswer: "Rozum a víra",
            wrongAnswers: ["Láska a modlitba", "Meditace a askeze"],
          },
          {
            pageA: "Může podle Akvinského existovat duše bez těla?",
            pageB: `<p>Duše je nesmrtelná a může <b>existovat samostatně</b> bez těla.</p>`,
            question: "Může podle Akvinského existovat duše bez těla?",
            correctAnswer:
              "Ano, duše je nesmrtelná a může existovat samostatně bez těla.",
            wrongAnswers: [
              "Ne, duše a tělo tvoří nedělitelnou jednotku.",
              "Ano, ale pouze na omezenou dobu.",
            ],
          },
          {
            pageA: "Co jsou tři základní křesťanské ctnosti?",
            pageB: `<p>Základní teologické ctnosti: <b>víra, naděje a láska</b>.</p>`,
            question:
              "Které z následujících jsou tři základní křesťanské ctnosti?",
            correctAnswer: "Láska, víra a naděje",
            wrongAnswers: [
              "Spravedlnost, moudrost a odvaha",
              "Mírnost, skromnost a pokora",
            ],
          },
          {
            pageA: "Definujte pojem Ockhamova břitva.",
            pageB: `<p><b>Ockhamova břitva</b>: k vysvětlení jevů nepřidávej zbytečné entity – postačí, co je nezbytné.</p>`,
            question: "Co znamená pojem Ockhamova břitva?",
            correctAnswer:
              "K vysvětlení hypotéz a argumentů není potřeba více, než je nutné k jejich pochopení.",
            wrongAnswers: [
              "Je to metoda pro přesné měření vzdáleností.",
              "Je to nástroj používaný ve středověké chirurgii.",
            ],
          },
        ],
      },
      {
        name: "Renesanční filozofie",
        dummyContent: [
          {
            pageA: "Co je to machiavelismus?",
            pageB: `<p><b>Machiavelismus</b> je politika prováděná bez ohledu na použité prostředky v zájmu vyššího cíle. Pojem je odvozen od florentského myslitele Niccola Machiavelliho (1469 – 1527).</p>
      <p>Podle Machiavelliho je oprávněné vše, co slouží k zachování státu a růstu jeho moci, i když to není morální.</p>`,
            question: "Co je to machiavelismus?",
            correctAnswer:
              "Politika prováděná bez ohledu na použité prostředky v zájmu vyššího cíle.",
            wrongAnswers: [
              "Filozofický směr zaměřený na harmonii a rovnováhu.",
              "Ekonomická teorie zaměřená na volný trh a kapitalismus.",
            ],
          },
          {
            pageA: "Jak se jmenuje nejznámější dílo Niccola Machiavelliho?",
            pageB: `<p>Nejznámějším dílem Niccola Machiavelliho je <b>Vladař</b>, vojensko-politický spis věnovaný Lorenzu Medicejskému.</p>`,
            question: "Jak se jmenuje nejznámější dílo Niccola Machiavelliho?",
            correctAnswer: "Vladař",
            wrongAnswers: ["Ústava", "Republika"],
          },
          {
            pageA: "Jaké je ideální státní zřízení podle Machiavelliho?",
            pageB: `<p>Za ideální státní zřízení považuje Machiavelli <b>republiku</b>.</p>`,
            question: "Jaké je ideální státní zřízení podle Machiavelliho?",
            correctAnswer: "republika",
            wrongAnswers: ["monarchie", "oligarchie"],
          },
          {
            pageA:
              "Který renesanční myslitel je považován za zakladatele mezinárodního práva?",
            pageB: `<p>Zakladatelem mezinárodního práva je <b>Hugo Grotius</b>. Tvrdil, že vedle boží vůle existuje přirozené právo závazné pro jednotlivce i státy.</p>`,
            question:
              "Který renesanční myslitel je považován za zakladatele mezinárodního práva?",
            correctAnswer: "Hugo Grotius",
            wrongAnswers: ["Niccolò Machiavelli", "Thomas More"],
          },
          {
            pageA: "Co je to podle Thomase Hobbese společenská smlouva?",
            pageB: `<p><b>Společenská smlouva</b> je podle <b>Thomase Hobbese</b> právní ochrana a jistota pro lidi vytvářející nadřazenou moc státu.</p>`,
            question: "Co je to podle Thomase Hobbese společenská smlouva?",
            correctAnswer:
              "Právní ochrana a jistota pro lidi, vytvářející nadřazenou moc státu.",
            wrongAnswers: [
              "Ekonomická dohoda mezi obchodníky a státem.",
              "Náboženský pakt mezi různými náboženskými komunitami.",
            ],
          },
          {
            pageA:
              "Proč podle Thomase Hobbese lidé potřebují společenskou smlouvu?",
            pageB: `<p>Hobbes soudil, že člověk je egoista usilující o vlastní prospěch, a v přírodním stavu proto vládne <b>válka všech proti všem</b>. Lidé tedy kvůli jistotě omezí svou svobodu a uzavřou smlouvu.</p>`,
            question:
              "Proč podle Thomase Hobbese lidé potřebují společenskou smlouvu?",
            correctAnswer:
              "Protože v přírodním stavu vládne válka všech proti všem.",
            wrongAnswers: [
              "Protože lidé přirozeně touží po kolektivní spolupráci.",
              "Protože společenská smlouva je nezbytná pro ekonomický rozvoj.",
            ],
          },
          {
            pageA:
              "Ve kterém díle Thomas Hobbes popsal teorii společenské smlouvy?",
            pageB: `<p>Hobbes formuloval teorii společenské smlouvy v díle <b>Leviathan</b> (1651).</p>`,
            question:
              "Ve kterém díle Thomas Hobbes popsal teorii společenské smlouvy?",
            correctAnswer: "Leviathan",
            wrongAnswers: ["Princ", "Druhá rozprava o vládě"],
          },
          {
            pageA:
              "Jak se jmenuje nejvýznamnější dílo Thomase Mora? Co v něm popisuje?",
            pageB: `<p>Nejvýznamnější dílo Thomase Mora je <b>Utopie</b>, kde líčí obraz ideální společnosti bez vykořisťování, s kolektivním vlastnictvím a volným přístupem ke vzdělání.</p>`,
            question:
              "Jak se jmenuje nejvýznamnější dílo Thomase Mora a co v něm popisuje?",
            correctAnswer: "Utopie - obraz ideálního společenství",
            wrongAnswers: [
              "Dystopie - popis zkažené společnosti",
              "Nový svět - cesta za objevováním neznámých zemí",
            ],
          },
          {
            pageA: "Jak se jmenuje nejznámější dílo Erasma Rotterdamského?",
            pageB: `<p>Nejznámějším dílem Erasma Rotterdamského je satira <b>Chvála bláznivosti</b>, kritizující nedostatky společnosti a církve.</p>`,
            question: "Jak se jmenuje nejznámější dílo Erasma Rotterdamského?",
            correctAnswer: "Chvála bláznivosti",
            wrongAnswers: ["Utopie", "Božská komedie"],
          },
          {
            pageA:
              "Jak by měl být podle Erasma Rotterdamského panovník přistupovat k vládnutí?",
            pageB: `<p>Panovník má být <b>milovaný, ne obávaný</b>; musí být vzdělaný, spravedlivý a shovívavý.</p>`,
            question:
              "Jak by měl být podle Erasma Rotterdamského panovník přistupovat k vládnutí?",
            correctAnswer: "Měl by být milovaný, ne obávaný.",
            wrongAnswers: [
              "Měl by být obávaný, ne milovaný.",
              "Měl by vládnout přísně a nekompromisně.",
            ],
          },
          {
            pageA: "Jak Erasmus Rotterdamský chápal svobodu vůle?",
            pageB: `<p>Erasmus vyzdvihoval <b>svobodnou vůli</b>; člověk se sám rozhoduje konat dobro či zlo a nese za své volby odpovědnost.</p>`,
            question: "Jak Erasmus Rotterdamský chápal svobodu vůle?",
            correctAnswer:
              "Člověk sám rozhoduje konat dobré skutky a nepodlehnout hříšnému životu.",
            wrongAnswers: [
              "Svobodná vůle je jen prázdné slovo.",
              "Svobodná vůle neexistuje, neboť všechny činy jsou předurčené.",
            ],
          },
          {
            pageA: "Kdo napsal dílo Nový organon? Čím se dílo zabývá?",
            pageB: `<p><b>Nový organon</b> je dílo <b>Francise Bacona</b>. Rozebírá klamné obrazy (idoly) lidského rozumu a prosazuje metodu indukce jako nový nástroj vědy.</p>`,
            question: "Kdo napsal dílo Nový organon a čím se dílo zabývá?",
            correctAnswer:
              "Francis Bacon; dílo se zabývá rozborem chyb lidského myšlení a navrhuje metodu indukce.",
            wrongAnswers: [
              "René Descartes; dílo se zabývá základy analytické geometrie a metodou dedukce.",
              "Immanuel Kant; dílo se zabývá kritikou čistého rozumu a kategoriemi poznání.",
            ],
          },
          {
            pageA: "Vyjmenujte idoly lidského rozumu podle Francise Bacona.",
            pageB: `<p>Bacon rozlišuje čtyři <b>idoly</b>: idoly rodu, jeskyně, tržiště a divadla.</p>`,
            question:
              "Který z následujících idolů se podle Francise Bacona týká jazyka?",
            correctAnswer: "Idoly tržiště",
            wrongAnswers: ["Idoly rodu", "Idoly jeskyně"],
          },
        ],
      },
      {
        name: "Novověká filozofie",
        dummyContent: [
          /*––– 1 –––*/
          {
            pageA: "Co je to racionalismus?",
            pageB: `<p><b>Racionalismus</b> je novověký filozofický směr, jenž zdůrazňuje <b>význam rozumové analýzy</b> a považuje smyslové poznání za omylné. V rozumu jsou vrozené ideje, které zaručují jistotu našeho poznání.</p>`,
            question: "Co je hlavním principem racionalismu?",
            correctAnswer: "Zdůrazňuje význam rozumové analýzy.",
            wrongAnswers: [
              "Zdůrazňuje význam smyslového poznání.",
              "Zdůrazňuje význam emocionálního poznání.",
            ],
          },

          /*––– 2 –––*/
          {
            pageA: "Co je to empirismus?",
            pageB: `<p><b>Empirismus</b> staví na <b>smyslové zkušenosti</b>; jediným pramenem poznání je to, co je dáno zkušeností, zatímco rozumovým konstrukcím je třeba být skeptický.</p>`,
            question: "Co zdůrazňuje filozofický směr zvaný empirismus?",
            correctAnswer: "Význam smyslového poznání",
            wrongAnswers: ["Schopnosti rozumu", "Význam logických argumentů"],
          },

          /*––– 4 –––*/
          {
            pageA: "Co znamená pojem tabula rasa?",
            pageB: `<p>Pojem <b>tabula rasa</b> (John Locke) vyjadřuje, že <b>lidská mysl je před zkušeností „prázdnou deskou“</b>; veškeré ideje pocházejí až ze smyslového poznání.</p>`,
            question: "Co znamená pojem tabula rasa?",
            correctAnswer:
              "Všechny naše zkušenosti a znalosti získáváme poznáním, před zkušeností není ve vědomí nic.",
            wrongAnswers: [
              "Naše vědomí je od narození naplněno vrozenými idejemi.",
              "Znamená to, že lidská mysl je od narození plně tvarovaná genetickými faktory.",
            ],
          },

          /*––– 5 –––*/
          {
            pageA: "Co je to agnosticismus?",
            pageB: `<p><b>Agnosticismus</b> tvrdí, že <i>to, co nelze ověřit zkušeností, nelze ani dokázat, ani vyvrátit</i>.</p>`,
            question: "Co je to agnosticismus?",
            correctAnswer:
              "Filozofický názor tvrdící, že existenci čehokoliv, co nelze poznat zkušeností nelze ani dokázat, ani vyvrátit.",
            wrongAnswers: [
              "Názor, který tvrdí, že všechny náboženské víry jsou pravdivé.",
              "Filozofie, která tvrdí, že existuje pouze materiální svět a nic jiného.",
            ],
          },

          /*––– 9 –––*/
          {
            pageA: "Vysvětlete citát “cogito ergo sum”.",
            pageB: `<p>René Descartes: <b>„Myslím, tedy jsem“.</b> O pochybování lze pochybovat, avšak samotný akt myšlení potvrzuje existenci myslícího já.</p>`,
            question: "Kdo je autorem citátu 'Cogito, ergo sum'?",
            correctAnswer: "René Descartes",
            wrongAnswers: ["Immanuel Kant", "Friedrich Nietzsche"],
          },

          /*––– 10 –––*/
          {
            pageA: "Co zkoumá transcendentální filozofie?",
            pageB: `<p><b>Transcendentální filozofie</b> (I. Kant) zkoumá <b>podmínky a možnosti lidského poznání</b> - tedy strukturu rozumu samotného.</p>`,
            question: "Kdo je hlavním zástupcem transcendentální filozofie?",
            correctAnswer: "Immanuel Kant",
            wrongAnswers: [
              "Georg Wilhelm Friedrich Hegel",
              "Friedrich Nietzsche",
            ],
          },

          /*––– 11 –––*/
          {
            pageA: "Jaké formy apriorního myšlení Kant rozlišuje?",
            pageB: `<p>Kant rozpoznal dvě univerzální apriorní formy smyslovosti: <b>prostor</b> a <b>čas</b>.</p>`,
            question: "Jaké dvě apriorní formy myšlení rozlišuje Kant?",
            correctAnswer: "Prostor a čas",
            wrongAnswers: ["Forma a podstata", "Příčina a následek"],
          },

          /*––– 12 –––*/
          {
            pageA: "Co je opakem apriorního poznání?",
            pageB: `<p>Proti <b>apriornímu</b> (před-zkušenostnímu) poznání stojí <b>aposteriorní</b>, tedy poznání <i>po</i> zkušenosti, empirické.</p>`,
            question: "Co je opakem apriorního poznání?",
            correctAnswer: "aposteriorní poznání",
            wrongAnswers: ["intuitivní poznání", "racionální poznání"],
          },

          /*––– 13 –––*/
          {
            pageA:
              "Co je to imperativ a jaký je rozdíl mezi hypotetickým a kategorickým imperativem?",
            pageB: `<p><b>Imperativ</b> je pravidlo určující vůli. <b>Hypotetický</b> platí podmíněně („chceš-li X, dělej Y“). <b>Kategorický</b> platí bezpodmínečně a stojí v základě morálky.</p>`,
            question:
              "Jaký je hlavní rozdíl mezi hypotetickým a kategorickým imperativem?",
            correctAnswer:
              "Hypotetický imperativ platí podmíněně, zatímco kategorický imperativ platí nepodmíněně.",
            wrongAnswers: [
              "Kategorický imperativ platí podmíněně, zatímco hypotetický imperativ platí nepodmíněně.",
              "Hypotetický imperativ je založen na etice, zatímco kategorický imperativ nikoliv.",
            ],
          },

          /*––– 14 –––*/
          {
            pageA: "Co je to maxima podle Kanta?",
            pageB: `<p><b>Maxima</b> je osobní pravidlo jednání, platné pouze pro konkrétního jednotlivce.</p>`,
            question: "Co je to maxima podle Kanta?",
            correctAnswer:
              "Zásada platná jen pro jednání jednotlivého člověka.",
            wrongAnswers: [
              "Zásada platná pro celou společnost.",
              "Zásada platná pouze v určité situaci.",
            ],
          },

          /*––– 15 –––*/
          {
            pageA:
              "Co znamená Kantovo rozlišení 'svět pro nás' a 'svět o sobě'?",
            pageB: `<p><b>Svět pro nás</b> (= fenomén) je realita, jak se jeví v našich apriorních formách prostoru a času. <b>Svět o sobě</b> (= noumen) existuje nezávisle na našem vnímání, ale je nepoznatelný.</p>`,
            question:
              "Jaký je podle Kanta rozdíl mezi světem pro nás a světem o sobě?",
            correctAnswer:
              "Svět pro nás je svět, jak se nám jeví, a svět o sobě existuje nezávisle na našem vnímání.",
            wrongAnswers: [
              "Svět pro nás je svět, který vnímáme smysly, a svět o sobě je svět, který můžeme plně poznat.",
              "Svět pro nás je svět fyzický, a svět o sobě je svět duchovní.",
            ],
          },

          /*––– 16 –––*/
          {
            pageA: "Co je to dialektická triáda?",
            pageB: `<p><b>Dialektika</b> (Hegel) vidí vývoj v logice <b>teze – antiteze – syntéza</b>; syntéza překonává protiklad a sama se stává novou tezí.</p>`,
            question: "Z čeho se skládá dialektická triáda?",
            correctAnswer: "Teze – antiteze – syntéza",
            wrongAnswers: [
              "Teze – analýza – syntéza",
              "Premisa – antiteze – závěr",
            ],
          },

          /*––– 17 –––*/
          {
            pageA: "S kterým filozofem se pojí 'filozofie ducha'?",
            pageB: `<p>Pojem <b>Filozofie ducha</b> je ústřední u <b>G. W. F. Hegela</b>.</p>`,
            question: "S kterým filozofem se pojí tzv. filozofie ducha?",
            correctAnswer: "Georg Wilhelm Friedrich Hegel",
            wrongAnswers: ["Immanuel Kant", "Friedrich Nietzsche"],
          },

          /*––– 18 –––*/
          {
            pageA: "V čem spočívá Hegelova filozofie dějin?",
            pageB: `<p>Dějiny jsou podle Hegela proces <b>seberozvíjení absolutního ducha</b>; jednotlivci jsou nástroji uskutečnění jeho racionního cíle.</p>`,
            question: "V čem spočívá Hegelova filozofie dějin?",
            correctAnswer: "Vývoj světa je procesem seberozvíjení ducha.",
            wrongAnswers: [
              "Dějiny jsou výsledkem svobodného jednání lidí.",
              "Pruský stát představuje začátek společenského vývoje.",
            ],
          },

          /*––– 19 –––*/
          {
            pageA: "Co je podle Hegela 'lest dějin'?",
            pageB: `<p><b>Lest dějin</b> znamená, že jednotlivci sledují vlastní cíle, ale ve skutečnosti uskutečňují záměr <b>světového ducha</b>.</p>`,
            question: "Co je to podle Hegela lest dějin?",
            correctAnswer:
              "Člověk je nástrojem ducha absolutního a pouze zdánlivě jedná svobodně.",
            wrongAnswers: [
              "Je to vědomé klamání dějepisců minulosti.",
              "Jde o omyl vzniklý chybami v historických dokumentech.",
            ],
          },

          /*––– 20 –––*/
          {
            pageA: "Co je to panská a otrocká morálka podle Nietzscheho?",
            pageB: `<p><b>Panská morálka</b> je aktivní morálka silných jedinců (hrdost, čest). <b>Otrocká morálka</b> je reaktivní morálka slabých, kteří se nechávají vést „jako stádo“.</p>`,
            question:
              "Jaké charakteristiky má podle Nietzscheho otrocká morálka?",
            correctAnswer:
              "Je reaktivní a jedná se o morálku slabých, kteří se nechávají vést jako stádo.",
            wrongAnswers: [
              "Je aktivní a zahrnuje hrdost a čest.",
              "Je určena pro silné tvůrčí jedince s vůlí k moci.",
            ],
          },

          /*––– 21 –––*/
          {
            pageA: "Co je podstatou světa podle Nietzscheho?",
            pageB: `<p>Nietzsche klade do základů reality <b>vůli k moci</b> – dynamickou, expanzivní sílu překonávání.</p>`,
            question: "Co je podstatou světa podle Nietzscheho?",
            correctAnswer: "Vůle k moci",
            wrongAnswers: ["Rozum", "Láska"],
          },

          /*––– 22 –––*/
          {
            pageA: "Co je nejvyšším cílem člověka podle Nietzscheho?",
            pageB: `<p>Nejvyšším cílem je <b>žít v souladu se svou vlastní přirozeností</b>, tedy s vůlí k moci, a tím uskutečnit sebe sama.</p>`,
            question: "Co je podle Nietzscheho nejvyšším cílem člověka?",
            correctAnswer: "Život v souladu s vlastní přirozeností",
            wrongAnswers: [
              "Podrobení se moci a konvencím",
              "Následování náboženských předsudků",
            ],
          },

          /*––– 23 –––*/
          {
            pageA: "Co Nietzsche myslel slovy “Bůh je mrtev”?",
            pageB: `<p>Výrok vyjadřuje <b>ztrátu platnosti tradičních metafyzických a náboženských jistot</b>; člověk má vytvářet vlastní hodnoty.</p>`,
            question: "Co Nietzsche myslel slovy 'Bůh je mrtev'?",
            correctAnswer:
              "Žádné věčné ideje, věc o sobě ani zásvětí neexistují.",
            wrongAnswers: [
              "Bůh fyzicky zemřel.",
              "Lidé již nevěří v existenci Boha.",
            ],
          },

          /*––– 24 –––*/
          {
            pageA: "Co je to pozitivismus?",
            pageB: `<p><b>Pozitivismus</b> (A. Comte) uznává za platné poznání jen to, co je <b>empiricky ověřitelné</b>; vše metafyzické odmítá.</p>`,
            question: "Co je to pozitivismus?",
            correctAnswer:
              "Filozofický směr, který omezuje platnost lidského poznání na to, co je pozitivně dáno a co je empiricky prokazatelné.",
            wrongAnswers: [
              "Umělecký směr zaměřený na pozitivní emoce.",
              "Politická ideologie podporující pozitivní diskriminaci.",
            ],
          },

          /*––– 25 –––*/
          {
            pageA: "Na jaké etapy Comte dělí vývoj společnosti?",
            pageB: `<p>Comte rozlišuje <b>teologickou</b>, <b>metafyzickou</b> a <b>pozitivní</b> epochu.</p>`,
            question: "Na jaké etapy Comte dělí vývoj společnosti?",
            correctAnswer:
              "Teologická epocha, Metafyzická epocha, Pozitivní epocha",
            wrongAnswers: [
              "Feudální epocha, Revoluční epocha, Moderní epocha",
              "Antická epocha, Středověká epocha, Renesanční epocha",
            ],
          },

          /*––– 26 –––*/
          {
            pageA: "Co je to materialismus?",
            pageB: `<p><b>Materialismus</b> tvrdí, že <b>hmota je jedinou podstatou skutečnosti</b>; myšlení je vlastnost hmoty.</p>`,
            question:
              "Který z následujících směrů materialismu hlásá vzájemné působení jevů?",
            correctAnswer: "Dialektický materialismus",
            wrongAnswers: [
              "Mechanický materialismus",
              "Historický materialismus",
            ],
          },

          /*––– 27 –––*/
          {
            pageA: "Co stojí podle Marxe nad ekonomickou základnou?",
            pageB: `<p>Nad <b>ekonomickou základnou</b> se tyčí <b>ideologická nadstavba</b> – právo, politika, náboženství, umění; změna základny mění i nadstavbu.</p>`,
            question: "Co podle Marxe stojí nad ekonomickou základnou?",
            correctAnswer: "Ideologická nadstavba",
            wrongAnswers: ["Pracovní síla", "Kapitalistický trh"],
          },

          /*––– 28 –––*/
          {
            pageA: "Prostřednictvím čeho je proletariát vykořisťován?",
            pageB: `<p>Proletariát je vykořisťován skrze <b>nadhodnotu</b> – část hodnoty vytvořené prací, kterou si přisvojuje kapitalista jako zisk.</p>`,
            question:
              "Prostřednictvím čeho je proletariát podle Marxe vykořisťován?",
            correctAnswer: "prostřednictvím nadhodnoty",
            wrongAnswers: [
              "prostřednictvím demokracie",
              "prostřednictvím vzdělání",
            ],
          },

          /*––– 29 –––*/
          {
            pageA: "Jaké dva faktory působí podle Marxe ve výrobě statků?",
            pageB: `<p>Marx rozlišuje <b>výrobní síly</b> (suroviny, nástroje, pracovní schopnosti) a <b>výrobní vztahy</b> (společenské vlastnické vztahy).</p>`,
            question: "Jaké dva faktory působí podle Marxe ve výrobě statků?",
            correctAnswer: "Výrobní síly a výrobní vztahy",
            wrongAnswers: [
              "Pracovní síly a vlastnické vztahy",
              "Suroviny a výrobní nástroje",
            ],
          },
        ],
      },
      {
        name: "Filozofie 20. století",
        dummyContent: [
          /*––– 1 –––*/
          {
            pageA: "Co je to subjektivní užitečnost?",
            pageB: `<p><b>Subjektivní užitečnost</b> označuje, že <i>užitečné = pravdivé</i> pouze pro daného jedince – pro ostatní to tak být nemusí.</p>`,
            question: "Co znamená subjektivní užitečnost?",
            correctAnswer:
              "Co je užitečné pro jednoho člověka, je pro něj pravdivé, i když to nemusí být pravdivé pro ostatní.",
            wrongAnswers: [
              "Co je užitečné pro jednoho, je užitečné i pro všechny ostatní.",
              "Subjektivní užitečnost popírá možnost osobní pravdy.",
            ],
          },

          /*––– 2 –––*/
          {
            pageA: "Existují podle pragmatiků obecné pravdy?",
            pageB: `<p>Pragmatismus tvrdí, že <b>obecné a nadčasové pravdy neexistují</b>; pravdivost je vždy vztahována k užitečnosti pro konkrétního člověka.</p>`,
            question: "Existují podle pragmatiků obecné pravdy?",
            correctAnswer: "Ne, dle pragmatiků obecné pravdy neexistují.",
            wrongAnswers: [
              "Ano, pragmatismus rozlišuje absolutní pravdy.",
              "Obecné pravdy existují, ale nejsou důležité.",
            ],
          },

          /*––– 3 –––*/
          {
            pageA: "Co je to instrumentalismus?",
            pageB: `<p><b>Instrumentalismus</b> (odnož pragmatismu) chápe <b>myšlení jako pouhý nástroj jednání</b> zaměřený na praktický prospěch.</p>`,
            question: "Co je to instrumentalismus?",
            correctAnswer:
              "Filozofický směr, který chápe myšlení pouze jako nástroj jednání.",
            wrongAnswers: [
              "Ekonomická teorie měnových nástrojů.",
              "Psychologická metoda měření kognice.",
            ],
          },

          /*––– 4 –––*/
          {
            pageA: "Do kterého směru patří William James a John Dewey?",
            pageB: `<p>William James i John Dewey jsou klíčovými představiteli <b>pragmatismu</b>.</p>`,
            question:
              "Do kterého filozofického směru se řadí William James a John Dewey?",
            correctAnswer: "pragmatiky",
            wrongAnswers: ["idealisty", "existencialisty"],
          },

          /*––– 5 –––*/
          {
            pageA: "Čím se zabývá fenomenologie?",
            pageB: `<p><b>Fenomenologie</b> zkoumá, jak se nám <i>jevy a zkušenosti</i> bezprostředně dávají ve vědomí – před jakoukoli teorií.</p>`,
            question: "Čím se zabývá filozofický směr fenomenologie?",
            correctAnswer:
              "Zkoumá, jak se jevy a zkušenosti člověku ukazují v jeho vědomí.",
            wrongAnswers: [
              "Studuje fyzikální vlastnosti objektů.",
              "Analyzuje společenské struktury na makroúrovni.",
            ],
          },

          /*––– 6 –––*/
          {
            pageA: "Kdo je zakladatelem fenomenologie?",
            pageB: `<p>Za otce fenomenologie se pokládá <b>Edmund Husserl</b>.</p>`,
            question: "Kdo je považován za zakladatele fenomenologie?",
            correctAnswer: "Edmund Husserl",
            wrongAnswers: ["Martin Heidegger", "Jean-Paul Sartre"],
          },

          /*––– 7 –––*/
          {
            pageA: "Co je to fenomén?",
            pageB: `<p><b>Fenomén</b> = jev – <i>individuální zkušenost</i> zcela před-teoretická, jak se bezprostředně ukazuje.</p>`,
            question: "Co je to fenomén?",
            correctAnswer:
              "Je to individuální zkušenost nezávislá na předem vypracovaných teoriích.",
            wrongAnswers: [
              "Teorie vysvětlující určité jevy.",
              "Předem vypracovaný model či plán.",
            ],
          },

          /*––– 8 –––*/
          {
            pageA: "Jak probíhá fenomenologická redukce?",
            pageB: `<p>Husserlova <b>fenomenologická redukce</b> má tři fáze: <br>
                     1) <i>Uzávorkování</i> předsudků; <br>
                     2) Popsání opodstatněných jsoucen; <br>
                     3) Zachycení <b>čistého fenoménu</b>.</p>`,
            question:
              "Který z následujících kroků není součástí fenomenologické redukce?",
            correctAnswer: "Spekulativní analýza",
            wrongAnswers: ["Uzávorkování", "Vznik čistého fenoménu"],
          },

          /*––– 9 –––*/
          {
            pageA: "Co je existencionalismus?",
            pageB: `<p><b>Existencionalismus</b> se soustředí na <b>jedince v konkrétní situaci</b>, na jeho svobodu, úzkost a odpovědnost v iracionálním světě.</p>`,
            question: "Na co se zaměřuje existencionalismus?",
            correctAnswer: "Na jedince a jeho konkrétní situaci.",
            wrongAnswers: [
              "Na experimentální přírodní vědy.",
              "Na technologický pokrok společnosti.",
            ],
          },

          /*––– 10 –––*/
          {
            pageA: "Sein – Zeit – Dasein",
            pageB: `<p>Pojmy <b>sein</b> (bytí), <b>zeit</b> (čas) a <b>dasein</b> (pobyt) jsou ústřední v díle <b>Martina Heideggera</b>.</p>`,
            question: "S kterým filozofem se pojí pojmy sein, zeit, dasein?",
            correctAnswer: "Martin Heidegger",
            wrongAnswers: ["Friedrich Nietzsche", "Karl Marx"],
          },

          /*––– 11 –––*/
          {
            pageA: "Co je to 'bytí ke smrti'?",
            pageB: `<p>Heideggerovo <b>bytí ke smrti</b> znamená, že si člověk existenciálně uvědomuje <b>svou konečnost</b> a tvoří své bytí ve vymezeném čase.</p>`,
            question: "Co znamená termín 'bytí ke smrti'?",
            correctAnswer: "Uvědomění si své časové omezenosti.",
            wrongAnswers: ["Život věčný", "Nepřetržitou existenci"],
          },

          /*––– 12 –––*/
          {
            pageA: "Camus – Mýtus o Sisyfovi",
            pageB: `<p>Camus v eseji přirovnává člověka k <b>Sisyfovi</b>: musí čelit <b>absurdnímu údělu</b> a osvobodit se přijetím této absurdity.</p>`,
            question:
              "Co představuje hlavní myšlenku Camusova 'Mýtu o Sisyfovi'?",
            correctAnswer:
              "Přijetí absurdit lidského údělu a osvobození se od iluzí.",
            wrongAnswers: [
              "Zaručenou naději na splnění lidských snů.",
              "Hledání smyslu života v náboženství.",
            ],
          },

          /*––– 13 –––*/
          {
            pageA: "Co je analytická filozofie?",
            pageB: `<p><b>Analytická filozofie</b> chápe filozofii jako <b>logickou analýzu jazyka</b>; pochopit jazyk = pochopit svět.</p>`,
            question: "Jaký je hlavní cíl analytické filozofie?",
            correctAnswer: "Pochopit svět prostřednictvím pochopení jazyka.",
            wrongAnswers: [
              "Provádět empirické experimenty.",
              "Reformovat politický systém.",
            ],
          },

          /*––– 14 –––*/
          {
            pageA: "Russellův logický atomismus",
            pageB: `<p><b>Logický atomismus</b> (B. Russell) tvrdí, že realitu tvoří <b>jednoduchá smyslová data</b> propojená logickou strukturou.</p>`,
            question:
              "Co je základem reality podle logického atomismu Rusella?",
            correctAnswer: "Jednotlivá smyslová data",
            wrongAnswers: ["Duch a hmota", "Složené struktury"],
          },

          /*––– 15 –––*/
          {
            pageA: "Kritický racionalismus",
            pageB: `<p><b>Kritický racionalismus</b> (K. Popper) nabádá učit se z chyb: poznání se zlepšuje <i>kritikou a vyvracením</i> dosavadních teorií.</p>`,
            question: "Co je dle Poppera kritériem vědeckosti?",
            correctAnswer: "Falzifikace",
            wrongAnswers: ["Verifikace", "Pouhá empirická ověřitelnost"],
          },

          /*––– 16 –––*/
          {
            pageA: "Popper – falzifikace",
            pageB: `<p>Teorie je <b>vědecká</b> pouze tehdy, pokud je <b>potenciálně vyvratitelná</b> (falzifikovatelná) budoucí zkušeností.</p>`,
            question: "Co je dle Poppera kritériem vědeckosti?",
            correctAnswer: "Falzifikace",
            wrongAnswers: ["Verifikace", "Empirická ověřitelnost"],
          },

          /*––– 17 –––*/
          {
            pageA: "Charakter postmoderny",
            pageB: `<p><b>Postmoderna</b> se vyznačuje <b>pluralitou rovnocenných perspektiv</b>, eklekticismem a odmítnutím velkých jednotících teorií.</p>`,
            question: "Jaké jsou charakteristické rysy postmoderny?",
            correctAnswer: "Pluralita názorů a jejich zrovnoprávnění",
            wrongAnswers: ["Hierarchizace názorů", "Jednotný pohled na svět"],
          },

          /*––– 18 –––*/
          {
            pageA: "Co je paradigma?",
            pageB: `<p><b>Paradigma</b> je převládající <b>vzorcový model</b> vědeckého myšlení; při hromadění anomálií může být vystřídán novým paradigmatem.</p>`,
            question: "Co je to paradigma?",
            correctAnswer: "Převládající model, který je považován za vzorový.",
            wrongAnswers: [
              "Teorie, která se nikdy nemění.",
              "Jedinečný případ bez následovníků.",
            ],
          },
        ],
      },
    ],
  },
  {
    text: "Sociologie",
    icon: "subject_12.png",
    sections: [
      {
        name: "Dějiny sociologie, kultura, komunikace",
        dummyContent: [
          /*––– 1 –––*/
          {
            pageA: "Čím se zabývá sociologie?",
            pageB: `<p><b>Sociologie</b> zkoumá <b>sociální dění</b> a chování člověka jako společenské bytosti.</p>`,
            question: "Čím se zabývá sociologie?",
            correctAnswer:
              "Zkoumáním sociálního dění a chování člověka jako společenské bytosti.",
            wrongAnswers: [
              "Zkoumáním přírodních jevů a biologických procesů.",
              "Zkoumáním ekonomických teorií a finančního trhu.",
            ],
          },

          /*––– 2 –––*/
          {
            pageA: "Kdo je považován za zakladatele sociologie?",
            pageB: `<p>Za zakladatele sociologie je považován <b>Auguste Comte</b>.</p>`,
            question: "Kdo je považován za zakladatele sociologie?",
            correctAnswer: "Auguste Comte",
            wrongAnswers: ["Karl Marx", "Émile Durkheim"],
          },

          /*––– 3 –––*/
          {
            pageA: "Co je základní jednotkou společnosti podle Comta?",
            pageB: `<p>Základní jednotkou společnosti je podle Comta <b>rodina</b>.</p>`,
            question: "Co je základní jednotkou společnosti podle Comta?",
            correctAnswer: "Rodina",
            wrongAnswers: ["Jedinec", "Stát"],
          },

          /*––– 4 –––*/
          {
            pageA:
              "Co je základní jednotkou společnosti podle Herberta Spencera?",
            pageB: `<p>Základní jednotkou společnosti je podle Spencera <b>jedinec</b>.</p>`,
            question:
              "Co je základní jednotkou společnosti podle Herberta Spencera?",
            correctAnswer: "Jedinec",
            wrongAnswers: ["Rodina", "Společenská skupina"],
          },

          /*––– 5 –––*/
          {
            pageA: "Co definuje pojem menšina?",
            pageB: `<p><b>Menšina</b> = skupina, která je znevýhodněna oproti většinové populaci a cítí sounáležitost.</p>`,
            question: "Co definuje pojem menšina?",
            correctAnswer:
              "Skupina, která je znevýhodněna oproti většinové populaci a má pocit sounáležitosti.",
            wrongAnswers: [
              "Skupina s větším počtem členů než většina.",
              "Skupina se stejnými výhodami jako většina.",
            ],
          },

          /*––– 6 –––*/
          {
            pageA: "Kdo je zakladatelem české sociologie?",
            pageB: `<p>Za zakladatele české sociologie je považován <b>T. G. Masaryk</b> – první profesor sociologie na UK; studoval <i>sebevražednost</i>.</p>`,
            question: "Kdo je považován za zakladatele české sociologie?",
            correctAnswer: "T. G. Masaryk",
            wrongAnswers: ["Max Weber", "Émile Durkheim"],
          },

          /*––– 7 –––*/
          {
            pageA: "Jaký je rozdíl mezi předsudky a diskriminací?",
            pageB: `<p><b>Předsudky</b> = postoje či názory (většinou negativní) vytvořené na základě neúplných informací.<br><b>Diskriminace</b> = konkrétní jednání, jímž jsou omezována práva určité skupiny.</p>`,
            question: "Jaký je rozdíl mezi předsudky a diskriminací?",
            correctAnswer:
              "Předsudky jsou názory nebo postoje, zatímco diskriminace je jednání.",
            wrongAnswers: [
              "Předsudky jsou jednání, diskriminace jen názory.",
              "Obojí jsou pouze názory bez dopadu.",
            ],
          },

          /*––– 8 –––*/
          {
            pageA: "Kultura (nejširší pojetí)",
            pageB: `<p>V sociologii je <b>kultura</b> v nejširším smyslu <b>vše, co vzniklo záměrnou lidskou činností</b>.</p>`,
            question:
              "Jak je definována kultura z hlediska sociologie v nejširším smyslu?",
            correctAnswer: "Vše, co bylo vytvořeno člověkem.",
            wrongAnswers: [
              "Pouze rysy, zvyky a tradice určitého společenství.",
              "Jen oblast umění.",
            ],
          },

          /*––– 9 –––*/
          {
            pageA: "Durkheim – kolektivní vědomí",
            pageB: `<p><b>Kolektivní vědomí</b> = souhrn norem a hodnot <i>předávaných z generace na generaci</i>.</p>`,
            question: "Co je to podle Durkheima kolektivní vědomí?",
            correctAnswer: "To, co je dodržováno po generace.",
            wrongAnswers: ["Individuální myšlení jedince.", "Osobní názory."],
          },

          /*––– 10 –––*/
          {
            pageA: "Etnicita",
            pageB: `<p><b>Etnicita</b> = <i>soubor znaků</i> (jazyk, oděv, náboženství…), jimiž se jedna skupina odlišuje od druhé.</p>`,
            question: "Co je etnicita?",
            correctAnswer:
              "Soubor znaků, kterými se jedna skupina odlišuje od druhé.",
            wrongAnswers: [
              "Systém vlády určitého regionu.",
              "Ekonomický status jednotlivce.",
            ],
          },

          /*––– 11 –––*/
          {
            pageA: "Merton – čtyři přístupy k menšinám",
            pageB: `<ul>
              <li><i>Neochvějný liberál</i> – bez předsudků, nediskriminuje.</li>
              <li><i>Přizpůsobivý liberál</i> – osobně bez předsudků, ale nepůjde „proti proudu“.</li>
              <li><i>Opatrný rasista</i> – předsudky má, ale zákon mu brání diskriminovat.</li>
              <li><i>Aktivní rasista</i> – má předsudky i diskriminuje.</li>
            </ul>`,
            question:
              "Který z následujících přístupů k menšinám podle Mertona nediskriminuje a nemá předsudky?",
            correctAnswer: "Neochvějný liberál",
            wrongAnswers: ["Přizpůsobivý liberál", "Opatrný rasista"],
          },

          /*––– 12 –––*/
          {
            pageA: "Metody sběru dat – rozhovor",
            pageB: `<p><i>Rozhovor</i> umožňuje zachytit i <b>neverbální komunikaci</b> respondentů.</p>`,
            question:
              "Která z následujících metod umožňuje sledovat neverbální komunikaci při sběru dat?",
            correctAnswer: "Rozhovor",
            wrongAnswers: ["Dotazník", "Anketa"],
          },

          /*––– 13 –––*/
          {
            pageA: "Durkheim – anomie",
            pageB: `<p><b>Anomie</b> = stav, v němž ve společnosti <b>přestávají platit pravidla</b> a normy.</p>`,
            question: "Co je to podle Durkheima anomie?",
            correctAnswer:
              "Stav ve společnosti, kdy přestávají platit pravidla.",
            wrongAnswers: [
              "Společnost s pevnou organizací.",
              "Silná sociální integrace.",
            ],
          },

          /*––– 14 –––*/
          {
            pageA: "Pareto – koloběh elit",
            pageB: `<p><b>Koloběh elit</b>: člověk se elitou <b>nestává dědičně, ale na základě schopností</b>; elity se tak cyklicky střídají.</p>`,
            question: "Co znamená tzv. koloběh elit podle Pareta?",
            correctAnswer:
              "Elitou se člověk nerodí, ale stává se jí na základě svých schopností.",
            wrongAnswers: [
              "Elita je pevně daná a neměnná skupina.",
              "Elity se střídají bez ohledu na schopnosti.",
            ],
          },

          /*––– 15 –––*/
          {
            pageA: "Kontrakultura",
            pageB: `<p><b>Kontrakultura</b> = skupina, která stojí v opozici k dominantní kultuře, <b>neuznává její hodnoty, ale je na ní závislá</b>.</p>`,
            question: "Co je kontrakultura?",
            correctAnswer:
              "Skupina, která je v opozici a neuznává hodnoty hlavní kultury, ale přitom je na ní závislá.",
            wrongAnswers: [
              "Skupina zcela nezávislá na hlavní kultuře.",
              "Skupina šířící hodnoty hlavní kultury.",
            ],
          },

          /*––– 16 –––*/
          {
            pageA: "Etnocentrismus",
            pageB: `<p><b>Etnocentrismus</b> = hodnocení jiné kultury <b>podle měřítek vlastní kultury</b>.</p>`,
            question: "Co znamená etnocentrismus?",
            correctAnswer:
              "Posuzování jiné kultury podle měřítek naší vlastní.",
            wrongAnswers: [
              "Bezvýhradné přijímání všech kultur.",
              "Úplné odmítání kontaktu s jinými kulturami.",
            ],
          },

          /*––– 17 –––*/
          {
            pageA: "Subkultura",
            pageB: `<p><b>Subkultura</b> = specifické hodnoty a vzorce chování určité <i>skupiny uvnitř širší společnosti</i>.</p>`,
            question: "Co rozumíme pod pojmem subkultura?",
            correctAnswer:
              "Hodnoty a vzorce chování typické pro určitou skupinu v rámci širšího společenství.",
            wrongAnswers: [
              "Hodnoty typické pro celou společnost.",
              "Chování specifické pouze pro jednotlivce.",
            ],
          },

          /*––– 18 –––*/
          {
            pageA: "Marx – etapy vývoje společnosti",
            pageB: `<ol>
              <li>Prvobytní pospolná společnost</li>
              <li>Otrokářství</li>
              <li>Feudalismus</li>
              <li>Kapitalismus</li>
              <li>Socialismus</li>
              <li>Komunismus</li>
            </ol>`,
            question:
              "Na jaké etapy dělí Marx vývoj společnosti podle způsobu výroby?",
            correctAnswer:
              "Prvobytní, pospolná společnost, Otrokářství, Feudalismus, Kapitalismus, Socialismus, Komunismus",
            wrongAnswers: [
              "Prvobytní, Otrokářství, Kapitalismus, Feudalismus, Komunismus",
              "Prvobytní, Otrokářství, Feudalismus, Kapitalismus, Liberalismus",
            ],
          },

          /*––– 19 –––*/
          {
            pageA: "Symetrická × asymetrická komunikace",
            pageB: `<p><b>Symetrická:</b> účastníci mají stejný podíl a postavení.<br>
                    <b>Asymetrická:</b> jeden z účastníků má <i>vyšší vliv / pozici</i> (věk, odbornost, hierarchie).</p>`,
            question:
              "Jaký je rozdíl mezi symetrickou a asymetrickou komunikací?",
            correctAnswer:
              "Při symetrické komunikaci mají účastníci stejný podíl a jsou na stejné úrovni, zatímco při asymetrické komunikaci jeden účastník stojí výše a má větší vliv.",
            wrongAnswers: [
              "Symetrická komunikace má nerovný vliv, asymetrická rovný.",
              "Symetrická závisí na věku, asymetrická na rovnoměrném vlivu.",
            ],
          },
        ],
      },
      {
        name: "Makrosociologie, třídy, sociální role",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Co je to deviantní jednání?",
            pageB: `<p><b>Deviantní jednání</b> = <i>opakované</i> odbočování od platných společenských norem.</p>`,
            question: "Co je to deviantní jednání?",
            correctAnswer: "Opakované odbočení od norem.",
            wrongAnswers: [
              "Dodržování všech společenských pravidel.",
              "Jednorázový přestupek bez opakování.",
            ],
          },

          /* ––– 2 ––– */
          {
            pageA: "Kdo je zakladatelem teorie tříd?",
            pageB: `<p>Zakladatelem teorie tříd je <b>Karel Marx</b>. Dělil společnost na <i>buržoazii</i> a <i>proletariát</i>.</p>`,
            question: "Kdo je zakladatelem teorie tříd?",
            correctAnswer: "Karel Marx",
            wrongAnswers: ["Friedrich Engels", "Max Weber"],
          },

          /* ––– 3 ––– */
          {
            pageA: "Kdy se objevuje pozitivní deviace?",
            pageB: `<p><b>Pozitivní deviace</b> nastává, když jsou existující normy <i>neoprávněné nebo nemorální</i>; deviant kritizuje normu (např. disidenti).</p>`,
            question: "Kdy se objevuje pozitivní deviace?",
            correctAnswer: "Když jsou společenské normy neoprávněné.",
            wrongAnswers: [
              "Když jsou normy příliš přísné.",
              "Když jsou normy ignorovány.",
            ],
          },

          /* ––– 4 ––– */
          {
            pageA: "Čím se zabývá makrosociologie?",
            pageB: `<p><b>Makrosociologie</b> zkoumá <b>velké sociální útvary</b> (národy, třídy, globální společnosti, vrstvy).</p>`,
            question: "Čím se zabývá makrosociologie?",
            correctAnswer:
              "Velkými sociálními útvary jako jsou národy, třídy, globální společnosti, vrstvy.",
            wrongAnswers: [
              "Individuální interakcemi mezi jednotlivci.",
              "Biologickými aspekty lidského chování.",
            ],
          },

          /* ––– 5 ––– */
          {
            pageA: "Sociální mobilita",
            pageB: `<p><b>Sociální mobilita</b> = proces přesunu člověka z jedné sociální vrstvy do jiné.</p>`,
            question:
              "Jak se nazývá proces přesunu z jedné sociální vrstvy do jiné?",
            correctAnswer: "sociální mobilita",
            wrongAnswers: ["sociální stratifikace", "sociální integrace"],
          },

          /* ––– 6 ––– */
          {
            pageA: "Deviace",
            pageB: `<p><b>Deviace</b> = <i>odchylka</i> od konformního jednání a od pravidel stanovených společností.</p>`,
            question: "Co znamená pojem 'deviace'?",
            correctAnswer:
              "Odbočka od konformního jednání, od pravidel vytvořených společností.",
            wrongAnswers: [
              "Přísné dodržování pravidel společnosti.",
              "Proces integrace do sociální skupiny.",
            ],
          },

          /* ––– 7 ––– */
          {
            pageA: "Sociální distance",
            pageB: `<p><b>Sociální distance</b> = \"vzdálenost\" mezi stupni na společenském žebříčku.</p>`,
            question: "Co je to sociální distance?",
            correctAnswer:
              "Je to vzdálenost mezi jednotlivými stupni na společenském žebříčku.",
            wrongAnswers: [
              "Fyzická vzdálenost mezi lidmi ve veřejném prostoru.",
              "Schopnost komunikovat mezi různými kulturami.",
            ],
          },

          /* ––– 8 ––– */
          {
            pageA: "Třídy moderní společnosti",
            pageB: `<p>Moderní společnost se členěním na <b>vyšší</b>, <b>střední</b> a <b>nižší</b> třídu. Třídy jsou <i>propustné</i>; rozdíly vycházejí z ekonomické situace.</p>`,
            question: "Na jaké hlavní třídy se dělí moderní společnost?",
            correctAnswer: "vyšší, střední a nižší třídu",
            wrongAnswers: [
              "dělnickou, rolnickou a buržoazní třídu",
              "politickou, ekonomickou a kulturní třídu",
            ],
          },

          /* ––– 9 ––– */
          {
            pageA: "Primární × sekundární skupina",
            pageB: `<p><b>Primární</b> skupina (např. rodina) předává základní hodnoty.<br>
                    <b>Sekundární</b> skupinu spojuje <i>formální cíl</i> (např. školní třída).</p>`,
            question:
              "Jaký je rozdíl mezi primární a sekundární sociální skupinou?",
            correctAnswer:
              "Primární skupina osvojuje základní hodnoty pro život ve společnosti, zatímco sekundární skupina je vedena formálním cílem.",
            wrongAnswers: [
              "Sekundární skupina osvojuje základní hodnoty, primární má formální cíl.",
              "Obě skupiny jsou vedeny stejnými cíli.",
            ],
          },

          /* ––– 10 ––– */
          {
            pageA: "Teorie vytěsnění – vznik deviace",
            pageB: `<p><b>Teorie vytěsnění</b>: sociální okolí <i>vylučuje</i> některé lidi na periferii společnosti, čímž vzniká deviace (předsudky, xenofobie).</p>`,
            question: "Jak vzniká deviace dle teorie vytěsnění?",
            correctAnswer:
              "Sociální okolí vylučuje některé lidi na společenskou periferii.",
            wrongAnswers: [
              "Jednotlivec se rozhodne být deviantem kvůli osobním ambicím.",
              "Deviace je výsledkem genetických predispozic.",
            ],
          },

          /* ––– 11 ––– */
          {
            pageA: "Teorie nálepkování – vznik deviace",
            pageB: `<p><b>Teorie nálepkování</b>: jedinec dostane <i>nálepku deviant</i> (často náhodně / podle statusu) a nakonec ji přijme.</p>`,
            question: "Jak se dle teorie nálepkování jedinec stává deviantem?",
            correctAnswer:
              "Jedinec obdrží určitou nálepku a nakonec přijme určenou roli.",
            wrongAnswers: [
              "Stává se deviantem vědomým rozhodnutím.",
              "Deviance je dána biologickými faktory.",
            ],
          },

          /* ––– 12 ––– */
          {
            pageA: "Sociální normy",
            pageB: `<p><b>Normy</b> = pravidla, jež zavazují jednotlivce k určitému chování; mechanismus sociální kontroly (nadpřirozené, přirozené, pozitivní).</p>`,
            question: "Co jsou normy v sociologickém slova smyslu?",
            correctAnswer:
              "Pravidla, která zavazují jedince k určitému způsobu chování.",
            wrongAnswers: [
              "Pouze zákony, které musí jedinci dodržovat.",
              "Jen tradice a morálka, jež ovlivňují svědomí.",
            ],
          },

          /* ––– 13 ––– */
          {
            pageA: "Vertikální × horizontální mobilita",
            pageB: `<p><b>Vertikální mobilita</b>: vzestup / sestup mezi vrstvami.<br><b>Horizontální mobilita</b>: přesun v rámci téže vrstvy.</p>`,
            question:
              "Jaký je rozdíl mezi vertikální a horizontální sociální mobilitou?",
            correctAnswer:
              "Vertikální mobilita znamená pohyb mezi vrstvami, horizontální pohyb v rámci jedné vrstvy.",
            wrongAnswers: [
              "Vertikální znamená pohyb v rámci vrstvy, horizontální mezi vrstvami.",
              "Oba typy vždy znamenají vzestup.",
            ],
          },

          /* ––– 14 ––– */
          {
            pageA: "Členská × referenční skupina",
            pageB: `<p><b>Členská</b> skupina – člověk je jejím oficiálním členem.<br>
                    <b>Referenční</b> skupina – jedinec k ní vzhlíží, sdílí její normy, ale členem není.</p>`,
            question:
              "Jaký je hlavní rozdíl mezi členskou a referenční sociální skupinou?",
            correctAnswer:
              "Osoba je členem členské skupiny, referenční skupinu pouze uznává a napodobuje.",
            wrongAnswers: [
              "Osoba souhlasí s normami členské skupiny, ale ne referenční.",
              "Referenční skupina má tajné členství, členská nikoliv.",
            ],
          },

          /* ––– 15 ––– */
          {
            pageA: "Teorie sociálních hnutí",
            pageB: `<p><b>Teorie sociálních hnutí</b>: tradiční třídy ustupují do pozadí před <i>sociálními hnutími</i>, jež sdružují lidi z různých vrstev.</p>`,
            question: "Které tvrzení nejlépe popisuje teorii sociálních hnutí?",
            correctAnswer:
              "Klasické třídy jsou zatlačovány do pozadí sociálními hnutími, jejichž členové pocházejí z různých vrstev.",
            wrongAnswers: [
              "Všechna hnutí tvoří střední třída.",
              "Hnutí se skládají z lidí s totožným ekonomickým postavením.",
            ],
          },

          /* ––– 16 ––– */
          {
            pageA: "Dav – tři rysy (Le Bon)",
            pageB: `<ul>
              <li>Ztráta individuality a pocitu odpovědnosti</li>
              <li>Převažuje instinktivní reagování</li>
              <li>Ztráta rozumové a morální kontroly</li>
            </ul>`,
            question:
              "Jaké jsou tři základní rysy davového chování podle Gustava Le Bona?",
            correctAnswer:
              "Ztráta individuality, převaha instinktivního reagování, ztráta rozumové a morální kontroly",
            wrongAnswers: [
              "Zvýšená kreativita, zlepšení komunikace, posílení individuální odpovědnosti",
              "Zvýšená agresivita, ztráta paměti, zlepšení logického myšlení",
            ],
          },

          /* ––– 17 ––– */
          {
            pageA: "Teorie elit – struktura společnosti",
            pageB: `<p><b>Teorie elit</b>: společnost tvoří <i>úzká vládnoucí elita</i> a <i>ovládaná většina</i>.</p>`,
            question: "Jak je podle teorie elit strukturována společnost?",
            correctAnswer:
              "Je tvořena úzkou skupinou vládnoucích (elity) a většinou, která je elitami ovládána.",
            wrongAnswers: [
              "Rozdělená na rovné sociální třídy bez mocenských rozdílů.",
              "Homogenní skupiny s rovnoměrně rozdělenou mocí.",
            ],
          },

          /* ––– 18 ––– */
          {
            pageA: "Malá × velká sociální skupina",
            pageB: `<p><b>Malé</b> skupiny: 3 – 30 členů, osobní známost.<br>
                    <b>Velké</b> skupiny: 30+ členů, členové se osobně neznají.</p>`,
            question:
              "Jaké je hlavní rozlišovací kriterium mezi malou a velkou sociální skupinou?",
            correctAnswer:
              "Počet členů – malé skupiny 3-30, velké nad 30 členů.",
            wrongAnswers: [
              "Způsob komunikace (písemná vs. ústní).",
              "Frekvence setkávání (denně vs. měsíčně).",
            ],
          },

          /* ––– 19 ––– */
          {
            pageA: "Sociální role × sociální pozice",
            pageB: `<p><b>Sociální role</b> = očekávaný vzorec chování.<br>
                    <b>Sociální pozice (status)</b> = hodnota postavení v systému, ke které se role vztahuje.</p>`,
            question:
              "Jaký je hlavní rozdíl mezi sociální rolí a sociální pozicí?",
            correctAnswer:
              "Sociální role je typ ustáleného jednání, sociální pozice hodnota postavení ve společnosti.",
            wrongAnswers: [
              "Role je hodnota postavení, pozice je typ jednání.",
              "Role a pozice jsou totéž, liší se jen názvem.",
            ],
          },
        ],
      },
    ],
  },
  {
    text: "Právo",
    icon: "subject_13.png",
    sections: [
      {
        name: "Teorie práva",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Jaký je hlavní rozdíl mezi právem a morálkou?",
            pageB: `<p><b>Právo</b> je soubor pravidel, která jsou vynutitelná státem.</p>
        <p><b>Morálka</b> jsou nepsaná pravidla, za jejichž porušení nehrozí státní sankce.</p>`,
            question: "Jaký je hlavní rozdíl mezi právem a morálkou?",
            correctAnswer:
              "Právo je soubor pravidel vynutitelných státem, zatímco morálka jsou nepsaná pravidla bez sankcí.",
            wrongAnswers: [
              "Právo i morálka jsou stejně vynutitelné státem.",
              "Morálka je soubor pravidel vynutitelných státem, právo ne.",
            ],
          },

          /* ––– 2 ––– */
          {
            pageA: "Jaké jsou dva hlavní typy právní kultury?",
            pageB: `<p>Dva hlavní typy právní kultury jsou <b>kontinentální</b> a <b>anglosaské</b> právo.</p>
        <p><i>Kontinentální právo</i> vychází z římského práva a základem jsou psané zákony.</p>
        <p>V <i>anglosaském právu</i> jsou základem soudní precedenty a právní obyčeje.</p>`,
            question: "Jaké jsou dva hlavní typy právní kultury?",
            correctAnswer: "Kontinentální a anglosaské právo",
            wrongAnswers: [
              "Islámské a socialistické právo",
              "Skandinávské a východoevropské právo",
            ],
          },

          /* ––– 3 ––– */
          {
            pageA: "Co značí subjektivní právo?",
            pageB: `<p><b>Objektivní (abstraktní) právo</b> – obecné právní zásady upravující společenské vztahy.</p>
        <p><b>Subjektivní (konkrétní) právo</b> – možnost konkrétní osoby uplatňovat svá práva v konkrétní věci.</p>`,
            question: "Co značí subjektivní právo?",
            correctAnswer:
              "Možnost konkrétní osoby uplatňovat svá práva v konkrétní věci.",
            wrongAnswers: [
              "Obecné právní zásady určené pro společnost.",
              "Úpravu společenských vztahů obecně.",
            ],
          },

          /* ––– 4 ––– */
          {
            pageA: "Jaký je rozdíl mezi veřejným a soukromým právem?",
            pageB: `<p>V <b>soukromém právu</b> mají účastníci právního vztahu <i>rovné postavení</i>.</p>
        <p>Ve <b>veřejném právu</b> je stát nadřazený ostatním účastníkům.</p>`,
            question: "Jaký je rozdíl mezi veřejným a soukromým právem?",
            correctAnswer:
              "V soukromém právu mají účastníci rovné postavení, ve veřejném právu je stát nadřazený ostatním účastníkům.",
            wrongAnswers: [
              "Ve veřejném právu mají účastníci rovné postavení, v soukromém je stát nadřazený.",
              "Veřejné a soukromé právo se nijak neliší.",
            ],
          },

          /* ––– 5 ––– */
          {
            pageA: "Co je to právní řád?",
            pageB: `<p><b>Právní řád</b> = soubor všech platných právních předpisů daného státu.</p>`,
            question: "Co je to právní řád?",
            correctAnswer: "Soubor všech platných právních předpisů státu.",
            wrongAnswers: [
              "Souhrn ústavních zvyků a tradic státu.",
              "Dokument se základními lidskými právy a svobodami.",
            ],
          },

          /* ––– 6 ––– */
          {
            pageA: "Co vyjadřuje právní síla?",
            pageB: `<p><b>Právní síla</b> vyjadřuje <b>důležitost</b> (hierarchické postavení) právního předpisu – např. zákon má vyšší sílu než vyhláška.</p>`,
            question: "Co vyjadřuje právní síla?",
            correctAnswer: "Důležitost předpisu.",
            wrongAnswers: [
              "Délku platnosti předpisu.",
              "Počet paragrafů v předpisu.",
            ],
          },

          /* ––– 7 ––– */
          {
            pageA: "Jaký je rozdíl mezi platností a účinností předpisu?",
            pageB: `<p>Předpis je <b>platný</b> ode dne <i>vyhlášení</i> ve Sbírce zákonů.</p>
        <p><b>Účinný</b> je od data, kdy se jím musí subjekty řídit v praxi.</p>`,
            question: "Jaký je rozdíl mezi platností a účinností předpisu?",
            correctAnswer:
              "Platnost = vyhlášení ve Sbírce zákonů; účinnost = den, od kterého se jím musíme řídit.",
            wrongAnswers: [
              "Platnost = den, od kterého se předpisem musíme řídit; účinnost = vyhlášení ve Sbírce.",
              "Platnost a účinnost jsou totéž.",
            ],
          },

          /* ––– 8 ––– */
          {
            pageA: "Co znamená pojem vacatio legis?",
            pageB: `<p><b>Vacatio legis</b> = období mezi <i>platností</i> a <i>účinností</i> právního předpisu.</p>`,
            question: "Co znamená pojem vacatio legis?",
            correctAnswer:
              "Období mezi platností a účinností právního předpisu.",
            wrongAnswers: [
              "Období, kdy předpis není v platnosti.",
              "Období po zrušení právního předpisu.",
            ],
          },

          /* ––– 9 ––– */
          {
            pageA: "Jak se dělí právní normy podle závaznosti?",
            pageB: `<p>Podle závaznosti rozlišujeme:</p>
        <ul>
          <li><b>Kogentní</b> normy – závazné bez odchylek.</li>
          <li><b>Dispozitivní</b> normy – podpůrné, lze se od nich dohodou odchýlit.</li>
        </ul>`,
            question: "Jak se dělí právní normy podle závaznosti?",
            correctAnswer: "Na kogentní a dispozitivní.",
            wrongAnswers: [
              "Na obligatorní a fakultativní.",
              "Na základní a odvozené.",
            ],
          },

          /* ––– 10 ––– */
          {
            pageA: "Co jsou to právní skutečnosti?",
            pageB: `<p><b>Právní skutečnosti</b> – okolnosti, s nimiž právní řád spojuje vznik, změnu nebo zánik právních vztahů.</p>
        <p>Dělí se na <i>objektivní události</i> (např. plynutí času, smrt) a <i>subjektivní právní jednání</i> (např. uzavření smlouvy).</p>`,
            question: "Co jsou to právní skutečnosti?",
            correctAnswer:
              "Všechny skutečnosti, ke kterým se váže vznik, zánik nebo změna právního vztahu.",
            wrongAnswers: [
              "Pouze subjektivní jednání s právními následky.",
              "Události, které může člověk vždy ovlivnit.",
            ],
          },
        ],
      },
      {
        name: "Občanské právo",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Jak vzniká právnická osoba?",
            pageB: `<p>Právnická osoba vzniká <b>zakladatelským právním jednáním</b> (např. společenskou smlouvou) nebo přímo <b>zákonem</b>.</p>`,
            question: "Jak vzniká právnická osoba?",
            correctAnswer: "Zakladatelským právním jednáním nebo zákonem.",
            wrongAnswers: [
              "Pouze rozhodnutím soudu.",
              "Pouze na základě smlouvy o převodu práv.",
            ],
          },

          /* ––– 2 ––– */
          {
            pageA: "Absolutní × relativní práva",
            pageB: `<p><b>Absolutní práva</b> působí <b>vůči všem</b> (erga omnes).</p>
        <p><b>Relativní práva</b> působí jen mezi omezeným okruhem osob (např. smluvní strany).</p>`,
            question: "Vůči komu působí absolutní práva?",
            correctAnswer: "Vůči všem",
            wrongAnswers: [
              "Vůči omezenému okruhu osob",
              "Vůči stranám smlouvy",
            ],
          },

          /* ––– 3 ––– */
          {
            pageA: "Evidence právnických osob",
            pageB: `<p>Právnické osoby se zapisují do <b>veřejných rejstříků</b> – typicky do <i>obchodního rejstříku</i>.</p>`,
            question: "Kde se evidují právnické osoby?",
            correctAnswer: "ve veřejných rejstřících",
            wrongAnswers: ["v soukromých archivech", "u krajských úřadů"],
          },

          /* ––– 4 ––– */
          {
            pageA: "Právní osobnost",
            pageB: `<p><b>Právní osobnost</b> = způsobilost mít <i>práva a povinnosti</i>.</p>`,
            question: "Co je to právní osobnost?",
            correctAnswer: "Způsobilost k právům a povinnostem.",
            wrongAnswers: [
              "Profesionální status jednotlivce.",
              "Schopnost vykonávat právní úkony.",
            ],
          },

          /* ––– 5 ––– */
          {
            pageA: "Hlavní pramen občanského práva",
            pageB: `<p>Hlavním pramenem občanského práva je <b>občanský zákoník</b>.</p>`,
            question: "Co je hlavním pramenem občanského práva?",
            correctAnswer: "Občanský zákoník",
            wrongAnswers: ["Ústava České republiky", "Trestní zákoník"],
          },

          /* ––– 6 ––– */
          {
            pageA: "Vlastnické právo – dílčí oprávnění",
            pageB: `<p><b>Vlastnické právo</b> zahrnuje právo věc držet, užívat, brát z ní plody a užitky, nakládat s ní, zničit ji či ji opustit.</p>`,
            question:
              "Které z následujících práv není součástí vlastnického práva?",
            correctAnswer: "Právo věc koupit",
            wrongAnswers: ["Právo věc držet", "Právo věc užívat"],
          },

          /* ––– 7 ––– */
          {
            pageA: "Zletilost",
            pageB: `<p>Člověk se stává <b>zletilým</b> dosažením <b>18&nbsp;let věku</b>.</p>`,
            question: "Kdy člověk nabývá zletilosti?",
            correctAnswer: "dosažením 18 let věku",
            wrongAnswers: ["dosažením 21 let věku", "dosažením 16 let věku"],
          },

          /* ––– 8 ––– */
          {
            pageA: "Oprávněná × neoprávněná držba",
            pageB: `<p><b>Oprávněná (poctivá) držba</b>: držitel je v dobré víře, že mu věc patří; může ji vydržet (3 roky movitá, 10 let nemovitá).</p>
        <p><b>Neoprávněná držba</b>: držitel ví, že k věci nemá právo.</p>`,
            question: "Jaký je rozdíl mezi oprávněnou a neoprávněnou držbou?",
            correctAnswer:
              "Oprávněná držba znamená, že držitel je v dobré víře, že mu věc náleží, a může následně získat vlastnické právo.",
            wrongAnswers: [
              "Oprávněná držba znamená, že držitel ví, že k věci nemá oprávnění.",
              "U neoprávněné držby lze získat vlastnické právo po určité době.",
            ],
          },

          /* ––– 9 ––– */
          {
            pageA: "Nepominutelný dědic",
            pageB: `<p><b>Nepominutelný dědic</b> (potomek zůstavitele) má nárok na <i>povinný díl</i>, pokud nebyl vyděděn.</p>`,
            question: "Kdo je nepominutelným dědicem podle českého práva?",
            correctAnswer: "Potomci zůstavitele",
            wrongAnswers: [
              "Přátelé zůstavitele",
              "Druhořadí příbuzní zůstavitele",
            ],
          },

          /* ––– 10 ––– */
          {
            pageA: "Věcné břemeno",
            pageB: `<p><b>Věcné břemeno</b> je omezení spojené s nemovitostí – vlastník musí něco trpět, něčeho se zdržet či něco konat.</p>`,
            question:
              'Co znamená pojem "věcné břemeno" ve vztahu k nemovitostem?',
            correctAnswer:
              "Je to povinnost vlastníka něco trpět, něčeho se zdržet nebo něco konat.",
            wrongAnswers: [
              "Právo vlastníka na bezplatný přístup k veřejným službám.",
              "Povinnost platit zvláštní daň z nemovitosti.",
            ],
          },

          /* ––– 11 ––– */
          {
            pageA: "Předmět občanského práva",
            pageB: `<p><b>Občanské právo</b> upravuje vztahy, práva a povinnosti <i>právnických i fyzických osob</i> – rodinné, věcné, dědické, závazkové právo atd.</p>`,
            question: "Co je předmětem úpravy občanského práva?",
            correctAnswer:
              "Vztahy, práva a povinnosti právnických a fyzických osob.",
            wrongAnswers: [
              "Především trestní právo a veřejné právo.",
              "Pouze práva a povinnosti státních orgánů.",
            ],
          },

          /* ––– 12 ––– */
          {
            pageA: "První třída dědiců",
            pageB: `<p>Do <b>první třídy</b> dědiců (dědění ze zákona) patří stejným dílem <b>děti a manžel</b> zůstavitele.</p>`,
            question: "Kdo patří do první třídy dědiců při dědění ze zákona?",
            correctAnswer: "Děti a manžel zůstavitele",
            wrongAnswers: ["Jen děti zůstavitele", "Jen manžel zůstavitele"],
          },

          /* ––– 13 ––– */
          {
            pageA: "Zůstavitel",
            pageB: `<p><b>Zůstavitel</b> = osoba, <i>po které se dědí</i>.</p>`,
            question: "Kdo je zůstavitel?",
            correctAnswer: "Osoba, po které se dědí.",
            wrongAnswers: [
              "Osoba, která vykonává závěť.",
              "Osoba, která přijímá dědictví.",
            ],
          },

          /* ––– 14 ––– */
          {
            pageA: "Zrušení právnické osoby",
            pageB: `<p>Právnickou osobu lze <b>zrušit</b>:</p>
        <ul>
          <li>právním jednáním (např. rozhodnutím valné hromady),</li>
          <li>uplynutím doby,</li>
          <li>dosažením účelu,</li>
          <li>rozhodnutím soudu.</li>
        </ul>`,
            question: "Jakými způsoby lze zrušit právnickou osobu?",
            correctAnswer:
              "Právním jednáním, uplynutím doby, dosažením účelu, rozhodnutím soudu.",
            wrongAnswers: ["Pouze rozhodnutím soudu.", "Pouze uplynutím doby."],
          },
        ],
      },
      {
        name: "Rodinné právo",
        dummyContent: [
          {
            pageA: "Zdánlivé × neplatné manželství",
            pageB: `<p><b>Neplatné manželství</b> sice <i>vzniklo</i>, ale trpí právní vadou (překážka manželství); o neplatnosti rozhoduje <b>soud</b>.</p>
                      <p><b>Zdánlivé manželství</b> <i>nevznikne vůbec</i>, a tak nevyvolá žádné právní následky.</p>`,
            question: "Jaký je rozdíl mezi zdánlivým a neplatným manželstvím?",
            correctAnswer:
              "Neplatné manželství vzniklo i přes právní vadu a o jeho neplatnosti rozhoduje soud, zatímco zdánlivé manželství vůbec nevznikne.",
            wrongAnswers: [
              "Zdánlivé manželství vzniklo s právní vadou a o jeho neplatnosti rozhoduje soud, zatímco neplatné manželství vůbec nevznikne.",
              "Neplatné manželství nevzniká a nevyvolává právní následky, zatímco zdánlivé potřebuje rozhodnutí soudu.",
            ],
          },

          /* ––– 16 ––– */
          {
            pageA: "Překážky uzavření manželství",
            pageB: `<ul>
                <li>nedostatek věku</li>
                <li>existující manželství / registrované partnerství</li>
                <li>omezená svéprávnost</li>
                <li>příbuzenství</li>
                <li>pěstounská péče nebo svěření do péče</li>
              </ul>`,
            question:
              "Která z následujících možností NENÍ překážkou uzavření manželství?",
            correctAnswer: "Nedostatek finančních prostředků",
            wrongAnswers: ["Příbuzenství", "Nedostatek věku"],
          },

          /* ––– 17 ––– */
          {
            pageA: "Společné jmění manželů (SJM)",
            pageB: `<p>Do <b>společného jmění manželů</b> patří <b>všechen majetek a dluhy</b> nabyté za trvání manželství.</p>
                      <p><i>Nezahrnuje</i> věci nabyté <u>darem</u>, <u>dědictvím</u>, věci osobní potřeby a dluhy týkající se výlučného majetku jednoho z manželů.</p>`,
            question:
              "Který z následujících majetků spadá do společného jmění manželů?",
            correctAnswer: "Majetek nabytý během manželství.",
            wrongAnswers: [
              "Majetek nabytý darem.",
              "Majetek nabytý dědictvím.",
            ],
          },

          /* ––– 18 ––– */
          {
            pageA: "Zánik manželství",
            pageB: `<p>Manželství zaniká <b>smrtí</b> jednoho z manželů, <b>prohlášením za mrtvého</b> nebo <b>rozvodem</b>.</p>`,
            question: "Jakými způsoby zaniká manželství?",
            correctAnswer:
              "Manželství zaniká smrtí, prohlášením za mrtvého nebo rozvodem.",
            wrongAnswers: [
              "Manželství zaniká pouze smrtí.",
              "Manželství zaniká pouze rozvodem.",
            ],
          },

          /* ––– 19 ––– */
          {
            pageA: "Příbuzenství – přímá × pobočná linie",
            pageB: `<p><b>Přímá linie</b> – vztah předek ⇄ potomek, vyjadřuje se počtem porodů (např. dítě → rodič → prarodič).</p>
                      <p><b>Pobočná linie</b> – osoby mají <i>společného předka</i> (sourozenci, bratranci ap.).</p>`,
            question: "Jaký je rozdíl v příbuzenství v přímé a pobočné linii?",
            correctAnswer:
              "V přímé linii se příbuzenství určuje počtem porodů mezi předkem a potomkem, v pobočné linii jej spojuje společný předek.",
            wrongAnswers: [
              "V přímé linii jsou příbuzní pouze sourozenci, v pobočné rodiče a děti.",
              "Pobočná linie se vyjadřuje počtem porodů, přímá společným předkem.",
            ],
          },

          /* ––– 20 ––– */
          {
            pageA: "Domněnka otcovství po rozvodu",
            pageB: `<p>Bývalý manžel je <b>automaticky považován za otce</b>, pokud se dítě narodí <b>do 300 dní</b> od právní moci rozvodu.</p>`,
            question:
              "V jakém případě může být bývalý manžel automaticky považován za otce dítěte?",
            correctAnswer: "Pokud porod proběhl do 300 dní od rozvodu.",
            wrongAnswers: [
              "Pokud porod proběhl do 100 dní od rozvodu.",
              "Pokud porod proběhl do 500 dní od rozvodu.",
            ],
          },

          /* ––– 21 ––– */
          {
            pageA: "Formy náhradní rodinné péče",
            pageB: `<p>Zákon zná <b>osvojení</b>, <b>pěstounskou péči</b>, <b>poručenství</b> a <b>ústavní výchovu</b>.</p>`,
            question:
              "Která z následujících možností není formou náhradní rodinné péče?",
            correctAnswer: "Dohled nad nezletilými osobami",
            wrongAnswers: ["Osvojení", "Pěstounská péče"],
          },

          /* ––– 22 ––– */
          {
            pageA: "Osvojení × pěstounská péče – práva rodičů",
            pageB: `<p>Při <b>osvojení</b> biologickým rodičům <i>zanikají</i> veškerá rodičovská práva a povinnosti.</p>
                      <p>U <b>pěstounské péče</b> zůstávají práva a povinnosti biologických rodičů zachována.</p>`,
            question:
              "Zanikají při osvojení práva a povinnosti biologických rodičů dítěte?",
            correctAnswer:
              "Ano, při osvojení biologickým rodičům zanikají práva a povinnosti vůči dítěti.",
            wrongAnswers: [
              "Ne, při osvojení biologickým rodičům zůstávají práva a povinnosti vůči dítěti.",
              "Ano, ale práva a povinnosti jsou zachována stejně jako u pěstounské péče.",
            ],
          },

          /* ––– 23 ––– */
          {
            pageA: "Pěstounská péče – věkový limit",
            pageB: `<p>Dítě může být v <b>pěstounské péči</b> nejdéle <b>do dovršení 18 let</b>.</p>`,
            question: "Do kolika let věku může být dítě v pěstounské péči?",
            correctAnswer: "Do dovršení 18 let",
            wrongAnswers: ["Do dovršení 16 let", "Do dovršení 21 let"],
          },

          /* ––– 24 ––– */
          {
            pageA: "Poručenství",
            pageB: `<p><b>Poručník</b> spravuje majetkové i osobní záležitosti nezletilého, ale při <i>podstatných rozhodnutích</i> musí získat <b>souhlas soudu</b>.</p>`,
            question: "Co je hlavní povinností poručníka v rámci poručenství?",
            correctAnswer:
              "Spravovat záležitosti nezletilého a žádat o souhlas soud při podstatných rozhodnutích.",
            wrongAnswers: [
              "Poskytovat finanční podporu nezletilému bez omezení.",
              "Zastupovat nezletilého pouze v právních záležitostech bez souhlasu soudu.",
            ],
          },
        ],
      },
      {
        name: "Trestní právo",
        dummyContent: [
          /* ––– 25 ––– */
          {
            pageA: "Kdo může podat obžalobu?",
            pageB: `<p>Obžalobu v trestním řízení může <b>podat výhradně <u>státní zástupce</u></b>. Žádný jiný subjekt (advokát, poškozený ani obviněný) tuto pravomoc nemá.</p>`,
            question: "Kdo může podat obžalobu?",
            correctAnswer: "státní zástupce",
            wrongAnswers: ["advokát", "obviněný"],
          },

          /* ––– 26 ––– */
          {
            pageA: "Tři stádia trestného činu",
            pageB: `<p>Trestný čin může probíhat ve třech <b>stádiích</b>:</p>
            <ol>
              <li><i>Příprava</i></li>
              <li><i>Pokus</i></li>
              <li><i>Dokonaný čin</i></li>
            </ol>
            <p>Trestně stíhat lze pachatele už za samotnou přípravu (pokud to zákon stanoví).</p>`,
            question: "Jaká jsou tři stádia trestného činu?",
            correctAnswer: "příprava, pokus, dokonaný čin",
            wrongAnswers: [
              "zahájení, průběh, ukončení",
              "plánování, čin, vyšetřování",
            ],
          },

          /* ––– 27 ––– */
          {
            pageA: "Věk trestní odpovědnosti",
            pageB: `<p>V České republice <b>není trestně odpovědný</b> ten, kdo v době činu ještě <b>nedovršil 15 let</b> věku.</p>`,
            question: "Do kolika let věku nejsou osoby v ČR trestně odpovědné?",
            correctAnswer: "Do 15 let",
            wrongAnswers: ["Do 16 let", "Do 18 let"],
          },

          /* ––– 28 ––– */
          {
            pageA: "Skutková podstata trestného činu",
            pageB: `<p>Skutková podstata je naplněna, pokud existují všechny <b>čtyři základní znaky</b>:</p>
            <ul>
              <li><i>Objekt</i> – chráněný společenský zájem</li>
              <li><i>Objektivní stránka</i> – způsob spáchání, následek</li>
              <li><i>Subjekt</i> – pachatel splňující podmínky trestní odpovědnosti</li>
              <li><i>Subjektivní stránka</i> – vnitřní postoj pachatele (úmysl / nedbalost)</li>
            </ul>`,
            question: "Kdy je naplněna skutková podstata trestného činu?",
            correctAnswer: "Pokud byly naplněny základní znaky trestného činu.",
            wrongAnswers: [
              "Pokud je objasněn motiv trestného činu.",
              "Pokud je pachatel zadržen a odsouzen.",
            ],
          },

          /* ––– 29 ––– */
          {
            pageA: "Přečin × zločin",
            pageB: `<p><b>Přečin</b> = trestný čin s horní hranicí odnětí svobody <u>do 5 let</u>.</p>
            <p><b>Zločin</b> = trestný čin s horní hranicí odnětí svobody <u>nad 5 let</u>.</p>`,
            question:
              "Jaký je maximální trest odnětí svobody, aby se trestný čin kvalifikoval jako přečin?",
            correctAnswer: "Do pěti let",
            wrongAnswers: ["Do deseti let", "Do tří let"],
          },

          /* ––– 30 ––– */
          {
            pageA: "Právní moc rozsudku – status obžalovaného",
            pageB: `<p>Osoba se stává <b>odsouzeným</b> okamžikem nabytí <b>právní moci odsuzujícího rozsudku</b>.</p>`,
            question: "Kdy se obžalovaný stává odsouzeným?",
            correctAnswer:
              "Okamžikem nabytí právní moci odsuzujícího rozsudku.",
            wrongAnswers: [
              "Po skončení hlavního líčení.",
              "Po vyslechnutí rozsudku u soudu.",
            ],
          },

          /* ––– 31 ––– */
          {
            pageA: "Obviněný × obžalovaný",
            pageB: `<p><b>Obviněný</b> – osoba, proti níž bylo zahájeno trestní stíhání.</p>
            <p><b>Obžalovaný</b> – obviněný od <i>nařízení hlavního líčení</i> až do pravomocného rozhodnutí soudu.</p>`,
            question:
              "Jak se nazývá osoba, proti které bylo zahájeno trestní stíhání, ale ještě nebylo nařízeno hlavní líčení?",
            correctAnswer: "Obviněný",
            wrongAnswers: ["Obžalovaný", "Odsouzený"],
          },

          /* ––– 32 ––– */
          {
            pageA: "Presumpce neviny",
            pageB: `<p><b>Presumpce neviny</b> = na obžalovaného se hledí jako na <i>nevinného</i>, dokud není jeho vina <b>prokázána pravomocným rozsudkem</b>.</p>`,
            question: "Co znamená pojem presumpce neviny v právním státě?",
            correctAnswer:
              "Na obžalovaného je nahlíženo jako na nevinného, dokud není prokázán opak a vynesen rozsudek.",
            wrongAnswers: [
              "Obžalovaný je považován za vinného, dokud nedokáže svou nevinu.",
              "Obžalovaný se musí sám přiznat, jinak je automaticky považován za nevinného.",
            ],
          },

          /* ––– 33 ––– */
          {
            pageA: "Nutná obrana × krajní nouze",
            pageB: `<p><b>Nutná obrana</b> – jinak trestný čin spáchaný k <i>odvrácení útoku</i>; směřuje výlučně <u>proti útočníkovi</u>.</p>
            <p><b>Krajní nouze</b> – čin spáchaný k <i>odvrácení nebezpečí</i>, které nelze odvrátit jinak.</p>`,
            question:
              "Jaký je hlavní rozdíl mezi nutnou obranou a krajní nouzí?",
            correctAnswer:
              "Nutná obrana působí pouze proti útočníkovi, zatímco krajní nouzí se odvrací nebezpečí.",
            wrongAnswers: [
              "Nutná obrana i krajní nouzí se zaměřují na odvrácení útoku.",
              "Krajní nouzí se působí pouze proti útočníkovi, zatímco nutná obrana odvrací nebezpečí.",
            ],
          },

          /* ––– 34 ––– */
          {
            pageA: "Fáze trestního řízení",
            pageB: `<ol>
      <li><b>Přípravné řízení</b> – zjišťování skutkového stavu, shromažďování důkazů</li>
      <li><b>Hlavní líčení</b> – soud rozhoduje o vině a trestu</li>
      <li><b>Odvolací řízení</b> – přezkum nepravomocného rozsudku</li>
      <li><b>Výkon trestu</b></li>
    </ol>`,
            question: "Z kolika fází se skládá trestní řízení?",
            correctAnswer:
              "Čtyři fáze: Přípravné řízení, Hlavní líčení, Odvolací řízení, Výkon trestu",
            wrongAnswers: [
              "Tři fáze: Přípravné řízení, Hlavní líčení, Výkon trestu",
              "Pět fází: Přípravné řízení, Hlavní líčení, Odvolací řízení, Výkon trestu, Dohled nad výkonem trestu",
            ],
          },

          /* ––– 35 ––– */
          {
            pageA: "Hmotné × procesní trestní právo",
            pageB: `<p><b>Hmotné trestní právo</b> definuje, <i>co je trestným činem</i> a jaké sankce lze uložit.</p>
            <p><b>Procesní trestní právo</b> upravuje <i>postup orgánů</i> v trestním řízení (pravidla vyšetřování, řízení před soudem, opravné prostředky).</p>`,
            question:
              "Jaký je hlavní rozdíl mezi hmotným a procesním trestním právem?",
            correctAnswer:
              "Hmotné trestní právo stanoví, co je trestným činem, zatímco procesní trestní právo upravuje postup v trestním řízení.",
            wrongAnswers: [
              "Hmotné trestní právo se zabývá právními procedurami, zatímco procesní trestní právo definuje trestné činy.",
              "Hmotné trestní právo chrání obviněné, procesní právo oběti.",
            ],
          },

          /* ––– 36 ––– */
          {
            pageA: "Započítání vazby do trestu",
            pageB: `<p>Čas strávený <b>ve vazbě</b> se podle českého práva <b>započítává</b> do výkonu trestu odnětí svobody.</p>`,
            question:
              "Započítává se do výkonu trestu odnětí svobody i čas strávený ve vazbě?",
            correctAnswer:
              "Ano, čas strávený ve vazbě se do výkonu trestu započítává.",
            wrongAnswers: [
              "Ne, čas strávený ve vazbě se do výkonu trestu nezapočítává.",
              "Čas strávený ve vazbě se započítává pouze v určitých případech.",
            ],
          },
        ],
      },
    ],
  },
  {
    text: "Anglické fráze",
    icon: "subject_14.png",
    sections: [
      {
        name: "Cestování 1",
        /* 20 common travel-English flip-cards for Czech learners */
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Kde je nejbližší autobusová zastávka?",
            pageB: `<p><b>Where is the nearest bus stop?</b></p>`,
            question:
              "Jak se anglicky řekne „Kde je nejbližší autobusová zastávka?“",
            correctAnswer: "Where is the nearest bus stop?",
            wrongAnswers: [
              "Where is the next train station?",
              "How do I get to the airport?",
            ],
          },

          /* ––– 2 ––– */
          {
            pageA: "Kolik to stojí?",
            pageB: `<p><b>How much does this cost?</b></p>`,
            question: "Jak se anglicky řekne „Kolik to stojí?“",
            correctAnswer: "How much does this cost?",
            wrongAnswers: [
              "How long will it take?",
              "Can you give me a discount?",
            ],
          },

          /* ––– 3 ––– */
          {
            pageA: "Chtěl/a bych jízdenku do …",
            pageB: `<p><b>I would like a ticket to …</b></p>`,
            question: "Jak se anglicky řekne „Chtěl/a bych jízdenku do …“?",
            correctAnswer: "I would like a ticket to …",
            wrongAnswers: [
              "I need to check in, please.",
              "Can I book a room, please?",
            ],
          },

          /* ––– 4 ––– */
          {
            pageA: "Můžete mi pomoci?",
            pageB: `<p><b>Can you help me?</b></p>`,
            question: "Jak se anglicky řekne „Můžete mi pomoci?“",
            correctAnswer: "Can you help me?",
            wrongAnswers: ["Can you hear me?", "Can you come with me?"],
          },

          /* ––– 5 ––– */
          {
            pageA: "Mluvíte anglicky?",
            pageB: `<p><b>Do you speak English?</b></p>`,
            question: "Jak se anglicky řekne „Mluvíte anglicky?“",
            correctAnswer: "Do you speak English?",
            wrongAnswers: ["Do you understand me?", "Can you translate this?"],
          },

          /* ––– 6 ––– */
          {
            pageA: "Mám rezervaci.",
            pageB: `<p><b>I have a reservation.</b></p>`,
            question: "Jak se anglicky řekne „Mám rezervaci.“",
            correctAnswer: "I have a reservation.",
            wrongAnswers: ["I need a reservation.", "I lost my reservation."],
          },

          /* ––– 7 ––– */
          {
            pageA: "Mohu platit kartou?",
            pageB: `<p><b>Can I pay by card?</b></p>`,
            question: "Jak se anglicky řekne „Mohu platit kartou?“",
            correctAnswer: "Can I pay by card?",
            wrongAnswers: ["Can I pay in cash?", "Can I change money here?"],
          },

          /* ––– 8 ––– */
          {
            pageA: "V kolik to otevírá?",
            pageB: `<p><b>What time does it open?</b></p>`,
            question: "Jak se anglicky řekne „V kolik to otevírá?“",
            correctAnswer: "What time does it open?",
            wrongAnswers: ["Where does it open?", "What time does it close?"],
          },

          /* ––– 9 ––– */
          {
            pageA: "Mohu dostat jídelní lístek, prosím?",
            pageB: `<p><b>Can I have the menu, please?</b></p>`,
            question:
              "Jak se anglicky řekne „Mohu dostat jídelní lístek, prosím?“",
            correctAnswer: "Can I have the menu, please?",
            wrongAnswers: [
              "Can I have the bill, please?",
              "Can I have some water, please?",
            ],
          },

          /* ––– 10 ––– */
          {
            pageA: "Neperlivou vodu, prosím.",
            pageB: `<p><b>Still water, please.</b></p>`,
            question: "Jak se anglicky řekne „Neperlivou vodu, prosím.“",
            correctAnswer: "Still water, please.",
            wrongAnswers: ["Sparkling water, please.", "Tap water, please."],
          },

          /* ––– 11 ––– */
          {
            pageA: "Kde jsou toalety?",
            pageB: `<p><b>Where is the restroom?</b></p>`,
            question: "Jak se anglicky řekne „Kde jsou toalety?“",
            correctAnswer: "Where is the restroom?",
            wrongAnswers: [
              "Where is the ticket office?",
              "Where is the information desk?",
            ],
          },

          /* ––– 12 ––– */
          {
            pageA: "Jsem alergický/á na …",
            pageB: `<p><b>I’m allergic to …</b></p>`,
            question: "Jak se anglicky řekne „Jsem alergický/á na …“",
            correctAnswer: "I’m allergic to …",
            wrongAnswers: ["I’m used to …", "I’m looking for …"],
          },

          /* ––– 13 ––– */
          {
            pageA: "Mohl/a byste nás vyfotit?",
            pageB: `<p><b>Can you take a picture of us?</b></p>`,
            question: "Jak se anglicky řekne „Mohl/a byste nás vyfotit?“",
            correctAnswer: "Can you take a picture of us?",
            wrongAnswers: [
              "Can you show us the way?",
              "Can you lend us your phone?",
            ],
          },

          /* ––– 14 ––– */
          {
            pageA: "Jak je to daleko?",
            pageB: `<p><b>How far is it?</b></p>`,
            question: "Jak se anglicky řekne „Jak je to daleko?“",
            correctAnswer: "How far is it?",
            wrongAnswers: ["How long does it take?", "How big is it?"],
          },

          /* ––– 15 ––– */
          {
            pageA: "Je tu dostupná wifi?",
            pageB: `<p><b>Is Wi-Fi available?</b></p>`,
            question: "Jak se anglicky řekne „Je tu dostupná wifi?“",
            correctAnswer: "Is Wi-Fi available?",
            wrongAnswers: [
              "Where can I charge my phone?",
              "Is breakfast included?",
            ],
          },

          /* ––– 16 ––– */
          {
            pageA: "Chtěl/a bych se ubytovat.",
            pageB: `<p><b>I would like to check in.</b></p>`,
            question: "Jak se anglicky řekne „Chtěl/a bych se ubytovat.“",
            correctAnswer: "I would like to check in.",
            wrongAnswers: [
              "I would like to check out.",
              "I would like to book a taxi.",
            ],
          },

          /* ––– 17 ––– */
          {
            pageA: "Mohu dostat účet, prosím?",
            pageB: `<p><b>Can I have the bill, please?</b></p>`,
            question: "Jak se anglicky řekne „Mohu dostat účet, prosím?“",
            correctAnswer: "Can I have the bill, please?",
            wrongAnswers: [
              "Can I have the receipt, please?",
              "Can I have the menu, please?",
            ],
          },

          /* ––– 18 ––– */
          {
            pageA: "Můžete doporučit místní jídlo?",
            pageB: `<p><b>Can you recommend a local dish?</b></p>`,
            question: "Jak se anglicky řekne „Můžete doporučit místní jídlo?“",
            correctAnswer: "Can you recommend a local dish?",
            wrongAnswers: [
              "Can you recommend a hotel?",
              "Can you recommend a souvenir?",
            ],
          },

          /* ––– 19 ––– */
          {
            pageA: "Ztratil/a jsem zavazadlo.",
            pageB: `<p><b>I lost my luggage.</b></p>`,
            question: "Jak se anglicky řekne „Ztratil/a jsem zavazadlo.“",
            correctAnswer: "I lost my luggage.",
            wrongAnswers: ["I forgot my ticket.", "I missed my flight."],
          },

          /* ––– 20 ––– */
          {
            pageA: "Kde si mohu koupit SIM kartu?",
            pageB: `<p><b>Where can I buy a SIM card?</b></p>`,
            question: "Jak se anglicky řekne „Kde si mohu koupit SIM kartu?“",
            correctAnswer: "Where can I buy a SIM card?",
            wrongAnswers: [
              "Where can I rent a car?",
              "Where can I change money?",
            ],
          },
        ],
      },
      {
        name: "Cestování 2",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Potřebuji lékaře.",
            pageB: `<p><b>I need a doctor.</b></p>`,
            question: "Jak se anglicky řekne „Potřebuji lékaře.“",
            correctAnswer: "I need a doctor.",
            wrongAnswers: ["I need a lawyer.", "Call the police."],
          },

          /* ––– 2 ––– */
          {
            pageA: "Kde je stanice metra?",
            pageB: `<p><b>Where is the subway station?</b></p>`,
            question: "Jak se anglicky řekne „Kde je stanice metra?“",
            correctAnswer: "Where is the subway station?",
            wrongAnswers: ["Where is the bus stop?", "Where is the taxi rank?"],
          },

          /* ––– 3 ––– */
          {
            pageA: "Kdy odjíždí poslední vlak?",
            pageB: `<p><b>What time does the last train leave?</b></p>`,
            question: "Jak se anglicky řekne „Kdy odjíždí poslední vlak?“",
            correctAnswer: "What time does the last train leave?",
            wrongAnswers: [
              "When does the first train leave?",
              "What time does the bus arrive?",
            ],
          },

          /* ––– 4 ––– */
          {
            pageA: "Můžete mi zavolat taxi?",
            pageB: `<p><b>Could you call me a taxi?</b></p>`,
            question: "Jak se anglicky řekne „Můžete mi zavolat taxi?“",
            correctAnswer: "Could you call me a taxi?",
            wrongAnswers: [
              "Could you carry my luggage?",
              "Could you open the door?",
            ],
          },

          /* ––– 5 ––– */
          {
            pageA: "Můžu si to vyzkoušet?",
            pageB: `<p><b>Can I try it on?</b></p>`,
            question: "Jak se anglicky řekne „Můžu si to vyzkoušet?“",
            correctAnswer: "Can I try it on?",
            wrongAnswers: ["Can I taste it?", "Can I sit here?"],
          },

          /* ––– 6 ––– */
          {
            pageA: "Kolik stojí vstupné?",
            pageB: `<p><b>How much is the entrance fee?</b></p>`,
            question: "Jak se anglicky řekne „Kolik stojí vstupné?“",
            correctAnswer: "How much is the entrance fee?",
            wrongAnswers: [
              "How much is the discount?",
              "How much is the taxi fare?",
            ],
          },

          /* ––– 7 ––– */
          {
            pageA: "Můžete to zopakovat pomaleji?",
            pageB: `<p><b>Could you repeat that more slowly?</b></p>`,
            question: "Jak se anglicky řekne „Můžete to zopakovat pomaleji?“",
            correctAnswer: "Could you repeat that more slowly?",
            wrongAnswers: [
              "Could you write that down?",
              "Could you speak louder?",
            ],
          },

          /* ––– 8 ––– */
          {
            pageA: "Potřebuji mapu města.",
            pageB: `<p><b>I need a city map.</b></p>`,
            question: "Jak se anglicky řekne „Potřebuji mapu města.“",
            correctAnswer: "I need a city map.",
            wrongAnswers: ["I need a menu.", "I need a timetable."],
          },

          /* ––– 9 ––– */
          {
            pageA: "Je tahle sedačka volná?",
            pageB: `<p><b>Is this seat free?</b></p>`,
            question: "Jak se anglicky řekne „Je tahle sedačka volná?“",
            correctAnswer: "Is this seat free?",
            wrongAnswers: ["Is this room clean?", "Is this road closed?"],
          },

          /* ––– 10 ––– */
          {
            pageA: "Kterým směrem je centrum?",
            pageB: `<p><b>Which way is the city centre?</b></p>`,
            question: "Jak se anglicky řekne „Kterým směrem je centrum?“",
            correctAnswer: "Which way is the city centre?",
            wrongAnswers: [
              "Which way is the airport?",
              "Which way is the museum?",
            ],
          },

          /* ––– 11 ––– */
          {
            pageA: "Můžu platit v eurech?",
            pageB: `<p><b>Can I pay in euros?</b></p>`,
            question: "Jak se anglicky řekne „Můžu platit v eurech?“",
            correctAnswer: "Can I pay in euros?",
            wrongAnswers: ["Can I pay later?", "Can I pay by cheque?"],
          },

          /* ––– 12 ––– */
          {
            pageA: "Kde je nejbližší lékárna?",
            pageB: `<p><b>Where is the nearest pharmacy?</b></p>`,
            question: "Jak se anglicky řekne „Kde je nejbližší lékárna?“",
            correctAnswer: "Where is the nearest pharmacy?",
            wrongAnswers: [
              "Where is the nearest hospital?",
              "Where is the nearest supermarket?",
            ],
          },

          /* ––– 13 ––– */
          {
            pageA: "Můžete mi doporučit levný hotel?",
            pageB: `<p><b>Can you recommend a cheap hotel?</b></p>`,
            question:
              "Jak se anglicky řekne „Můžete mi doporučit levný hotel?“",
            correctAnswer: "Can you recommend a cheap hotel?",
            wrongAnswers: [
              "Can you recommend an expensive restaurant?",
              "Can you recommend a museum?",
            ],
          },

          /* ––– 14 ––– */
          {
            pageA: "Je to v docházkové vzdálenosti?",
            pageB: `<p><b>Is it within walking distance?</b></p>`,
            question: "Jak se anglicky řekne „Je to v docházkové vzdálenosti?“",
            correctAnswer: "Is it within walking distance?",
            wrongAnswers: ["Is it open now?", "Is it safe at night?"],
          },

          /* ––– 15 ––– */
          {
            pageA: "Potřebuji účtenku.",
            pageB: `<p><b>I need a receipt.</b></p>`,
            question: "Jak se anglicky řekne „Potřebuji účtenku.“",
            correctAnswer: "I need a receipt.",
            wrongAnswers: ["I need directions.", "I need a reservation."],
          },

          /* ––– 16 ––– */
          {
            pageA: "Je tu někde bankomat?",
            pageB: `<p><b>Is there an ATM nearby?</b></p>`,
            question: "Jak se anglicky řekne „Je tu někde bankomat?“",
            correctAnswer: "Is there an ATM nearby?",
            wrongAnswers: [
              "Is there a restroom nearby?",
              "Is there a taxi stand nearby?",
            ],
          },

          /* ––– 17 ––– */
          {
            pageA: "Můžete mi ukázat na mapě?",
            pageB: `<p><b>Can you show me on the map?</b></p>`,
            question: "Jak se anglicky řekne „Můžete mi ukázat na mapě?“",
            correctAnswer: "Can you show me on the map?",
            wrongAnswers: ["Can you fix my phone?", "Can you carry my bag?"],
          },

          /* ––– 18 ––– */
          {
            pageA: "Jak dlouho to potrvá?",
            pageB: `<p><b>How long will it take?</b></p>`,
            question: "Jak se anglicky řekne „Jak dlouho to potrvá?“",
            correctAnswer: "How long will it take?",
            wrongAnswers: ["How far is it?", "How much does it cost?"],
          },

          /* ––– 19 ––– */
          {
            pageA: "Je zahrnuta snídaně?",
            pageB: `<p><b>Is breakfast included?</b></p>`,
            question: "Jak se anglicky řekne „Je zahrnuta snídaně?“",
            correctAnswer: "Is breakfast included?",
            wrongAnswers: ["Is Wi-Fi free?", "Is parking available?"],
          },

          /* ––– 20 ––– */
          {
            pageA: "Kde si mohu půjčit auto?",
            pageB: `<p><b>Where can I rent a car?</b></p>`,
            question: "Jak se anglicky řekne „Kde si mohu půjčit auto?“",
            correctAnswer: "Where can I rent a car?",
            wrongAnswers: [
              "Where can I buy a ticket?",
              "Where can I catch a bus?",
            ],
          },
        ],
      },
      {
        name: "Cestování 3",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Promiňte, kde je toaleta?",
            pageB: `<p><b>Excuse me, where is the bathroom?</b></p>`,
            question: "Jak se anglicky řekne „Promiňte, kde je toaleta?“",
            correctAnswer: "Excuse me, where is the bathroom?",
            wrongAnswers: ["Where is the hotel?", "Where is the kitchen?"],
          },

          /* ––– 2 ––– */
          {
            pageA: "Chtěl bych jednosměrnou jízdenku.",
            pageB: `<p><b>I’d like a one-way ticket.</b></p>`,
            question:
              "Jak se anglicky řekne „Chtěl bych jednosměrnou jízdenku.“",
            correctAnswer: "I’d like a one-way ticket.",
            wrongAnswers: [
              "I’d like a return ticket.",
              "I’d like two tickets.",
            ],
          },

          /* ––– 3 ––– */
          {
            pageA: "Můžu platit kartou?",
            pageB: `<p><b>Can I pay by card?</b></p>`,
            question: "Jak se anglicky řekne „Můžu platit kartou?“",
            correctAnswer: "Can I pay by card?",
            wrongAnswers: ["Can I pay in cash?", "Can I pay tomorrow?"],
          },

          /* ––– 4 ––– */
          {
            pageA: "Máte volný stůl pro dva?",
            pageB: `<p><b>Do you have a table for two?</b></p>`,
            question: "Jak se anglicky řekne „Máte volný stůl pro dva?“",
            correctAnswer: "Do you have a table for two?",
            wrongAnswers: ["Do you have a map?", "Is there a table for one?"],
          },

          /* ––– 5 ––– */
          {
            pageA: "Mohl byste mě vyfotit?",
            pageB: `<p><b>Could you take a picture of me?</b></p>`,
            question: "Jak se anglicky řekne „Mohl byste mě vyfotit?“",
            correctAnswer: "Could you take a picture of me?",
            wrongAnswers: [
              "Could you fix my phone?",
              "Could you carry my bag?",
            ],
          },

          /* ––– 6 ––– */
          {
            pageA: "Potřebuji adaptér do zásuvky.",
            pageB: `<p><b>I need a power adapter.</b></p>`,
            question: "Jak se anglicky řekne „Potřebuji adaptér do zásuvky.“",
            correctAnswer: "I need a power adapter.",
            wrongAnswers: ["I need a hair dryer.", "I need a blanket."],
          },

          /* ––– 7 ––– */
          {
            pageA: "Kdy se podává snídaně?",
            pageB: `<p><b>What time is breakfast served?</b></p>`,
            question: "Jak se anglicky řekne „Kdy se podává snídaně?“",
            correctAnswer: "What time is breakfast served?",
            wrongAnswers: [
              "What time is dinner served?",
              "What time is checkout?",
            ],
          },

          /* ––– 8 ––– */
          {
            pageA: "Kde je nejbližší zastávka autobusu?",
            pageB: `<p><b>Where is the nearest bus stop?</b></p>`,
            question:
              "Jak se anglicky řekne „Kde je nejbližší zastávka autobusu?“",
            correctAnswer: "Where is the nearest bus stop?",
            wrongAnswers: [
              "Where is the nearest train station?",
              "Where is the taxi stand?",
            ],
          },

          /* ––– 9 ––– */
          {
            pageA: "Je Wi-Fi zdarma?",
            pageB: `<p><b>Is the Wi-Fi free?</b></p>`,
            question: "Jak se anglicky řekne „Je Wi-Fi zdarma?“",
            correctAnswer: "Is the Wi-Fi free?",
            wrongAnswers: ["Is breakfast included?", "Is parking free?"],
          },

          /* ––– 10 ––– */
          {
            pageA: "Jak se dostanu na letiště?",
            pageB: `<p><b>How do I get to the airport?</b></p>`,
            question: "Jak se anglicky řekne „Jak se dostanu na letiště?“",
            correctAnswer: "How do I get to the airport?",
            wrongAnswers: [
              "How do I get to the museum?",
              "How do I get to the beach?",
            ],
          },

          /* ––– 11 ––– */
          {
            pageA: "Můžete mi doporučit místní specialitu?",
            pageB: `<p><b>Can you recommend a local specialty?</b></p>`,
            question:
              "Jak se anglicky řekne „Můžete mi doporučit místní specialitu?“",
            correctAnswer: "Can you recommend a local specialty?",
            wrongAnswers: [
              "Can you recommend a taxi company?",
              "Can you recommend a souvenir shop?",
            ],
          },

          /* ––– 12 ––– */
          {
            pageA: "Mohu si to vzít s sebou?",
            pageB: `<p><b>Can I have it to go?</b></p>`,
            question: "Jak se anglicky řekne „Mohu si to vzít s sebou?“",
            correctAnswer: "Can I have it to go?",
            wrongAnswers: ["Can I eat here?", "Can I return it?"],
          },

          /* ––– 13 ––– */
          {
            pageA: "Potřebuji rezervovat pokoj.",
            pageB: `<p><b>I need to book a room.</b></p>`,
            question: "Jak se anglicky řekne „Potřebuji rezervovat pokoj.“",
            correctAnswer: "I need to book a room.",
            wrongAnswers: [
              "I need to cancel a room.",
              "I need to buy a ticket.",
            ],
          },

          /* ––– 14 ––– */
          {
            pageA: "Mluvíte prosím anglicky?",
            pageB: `<p><b>Do you speak English, please?</b></p>`,
            question: "Jak se anglicky řekne „Mluvíte prosím anglicky?“",
            correctAnswer: "Do you speak English, please?",
            wrongAnswers: ["Do you speak German?", "Where is English school?"],
          },

          /* ––– 15 ––– */
          {
            pageA: "Kde si mohu vyměnit peníze?",
            pageB: `<p><b>Where can I exchange money?</b></p>`,
            question: "Jak se anglicky řekne „Kde si mohu vyměnit peníze?“",
            correctAnswer: "Where can I exchange money?",
            wrongAnswers: [
              "Where can I buy stamps?",
              "Where can I get a taxi?",
            ],
          },

          /* ––– 16 ––– */
          {
            pageA: "Mohu si uschovat zavazadlo?",
            pageB: `<p><b>Can I store my luggage?</b></p>`,
            question: "Jak se anglicky řekne „Mohu si uschovat zavazadlo?“",
            correctAnswer: "Can I store my luggage?",
            wrongAnswers: ["Can I charge my phone?", "Can I wash my clothes?"],
          },

          /* ––– 17 ––– */
          {
            pageA: "Je to daleko?",
            pageB: `<p><b>Is it far?</b></p>`,
            question: "Jak se anglicky řekne „Je to daleko?“",
            correctAnswer: "Is it far?",
            wrongAnswers: ["Is it open?", "Is it expensive?"],
          },

          /* ––– 18 ––– */
          {
            pageA: "Máte nějaké vegetariánské jídlo?",
            pageB: `<p><b>Do you have any vegetarian dishes?</b></p>`,
            question:
              "Jak se anglicky řekne „Máte nějaké vegetariánské jídlo?“",
            correctAnswer: "Do you have any vegetarian dishes?",
            wrongAnswers: [
              "Do you have any spicy food?",
              "Do you have any desserts?",
            ],
          },

          /* ––– 19 ––– */
          {
            pageA: "Mohu dostat sklenici vody?",
            pageB: `<p><b>May I have a glass of water?</b></p>`,
            question: "Jak se anglicky řekne „Mohu dostat sklenici vody?“",
            correctAnswer: "May I have a glass of water?",
            wrongAnswers: ["May I have the bill?", "May I have the menu?"],
          },

          /* ––– 20 ––– */
          {
            pageA: "Kdy odjíždí autobus do centra?",
            pageB: `<p><b>What time does the bus to downtown leave?</b></p>`,
            question: "Jak se anglicky řekne „Kdy odjíždí autobus do centra?“",
            correctAnswer: "What time does the bus to downtown leave?",
            wrongAnswers: [
              "What time does the train to downtown leave?",
              "What time does the bus arrive?",
            ],
          },
        ],
      },
      {
        name: "Restaurace",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Rezervoval jsem stůl na osmou hodinu.",
            pageB: `<p><b>I have a reservation for eight o’clock.</b></p>`,
            question:
              "Jak se anglicky řekne „Rezervoval jsem stůl na osmou hodinu.“",
            correctAnswer: "I have a reservation for eight o’clock.",
            wrongAnswers: [
              "I have a reservation for seven o’clock.",
              "I need a reservation.",
            ],
          },

          /* ––– 2 ––– */
          {
            pageA: "Můžete mi ukázat jídelní lístek?",
            pageB: `<p><b>Could I see the menu, please?</b></p>`,
            question:
              "Jak se anglicky řekne „Můžete mi ukázat jídelní lístek?“",
            correctAnswer: "Could I see the menu, please?",
            wrongAnswers: [
              "Could I see the bill, please?",
              "Could I see the wine list, please?",
            ],
          },

          /* ––– 3 ––– */
          {
            pageA: "Co byste doporučil?",
            pageB: `<p><b>What would you recommend?</b></p>`,
            question: "Jak se anglicky řekne „Co byste doporučil?“",
            correctAnswer: "What would you recommend?",
            wrongAnswers: ["What is the price?", "Where is the restroom?"],
          },

          /* ––– 4 ––– */
          {
            pageA: "Jsem alergický na ořechy.",
            pageB: `<p><b>I am allergic to nuts.</b></p>`,
            question: "Jak se anglicky řekne „Jsem alergický na ořechy.“",
            correctAnswer: "I am allergic to nuts.",
            wrongAnswers: ["I am allergic to dairy.", "I love nuts."],
          },

          /* ––– 5 ––– */
          {
            pageA: "Dám si steak medium.",
            pageB: `<p><b>I’ll have the steak medium.</b></p>`,
            question: "Jak se anglicky řekne „Dám si steak medium.“",
            correctAnswer: "I’ll have the steak medium.",
            wrongAnswers: [
              "I’ll have the fish.",
              "I’ll have the steak well-done.",
            ],
          },

          /* ––– 6 ––– */
          {
            pageA: "Mohu si objednat poloviční porci?",
            pageB: `<p><b>Can I order a half portion?</b></p>`,
            question:
              "Jak se anglicky řekne „Mohu si objednat poloviční porci?“",
            correctAnswer: "Can I order a half portion?",
            wrongAnswers: [
              "Can I order a dessert?",
              "Can I have a double portion?",
            ],
          },

          /* ––– 7 ––– */
          {
            pageA: "Bude to všechno?",
            pageB: `<p><b>Is that everything?</b></p>`,
            question: "Jak se anglicky řekne „Bude to všechno?“ (číšník)",
            correctAnswer: "Is that everything?",
            wrongAnswers: ["Is that spicy?", "Is that yours?"],
          },

          /* ––– 8 ––– */
          {
            pageA: "Přinesete nám prosím účet?",
            pageB: `<p><b>Could we have the bill, please?</b></p>`,
            question: "Jak se anglicky řekne „Přinesete nám prosím účet?“",
            correctAnswer: "Could we have the bill, please?",
            wrongAnswers: [
              "Could we have the menu, please?",
              "Could we have more bread?",
            ],
          },

          /* ––– 9 ––– */
          {
            pageA: "Je spropitné zahrnuto v ceně?",
            pageB: `<p><b>Is the tip included?</b></p>`,
            question: "Jak se anglicky řekne „Je spropitné zahrnuto v ceně?“",
            correctAnswer: "Is the tip included?",
            wrongAnswers: ["Is the dessert included?", "Is the tax included?"],
          },

          /* ––– 10 ––– */
          {
            pageA: "Chutnalo vám?",
            pageB: `<p><b>Did you enjoy your meal?</b></p>`,
            question: "Jak se anglicky řekne „Chutnalo vám?“",
            correctAnswer: "Did you enjoy your meal?",
            wrongAnswers: [
              "Did you pay the bill?",
              "Was your seat comfortable?",
            ],
          },

          /* ––– 11 ––– */
          {
            pageA: "Mohu dostat ještě trochu vody?",
            pageB: `<p><b>Could I have some more water?</b></p>`,
            question: "Jak se anglicky řekne „Mohu dostat ještě trochu vody?“",
            correctAnswer: "Could I have some more water?",
            wrongAnswers: [
              "Could I have some more bread?",
              "Could I have the bill?",
            ],
          },

          /* ––– 12 ––– */
          {
            pageA: "Bez ledu, prosím.",
            pageB: `<p><b>No ice, please.</b></p>`,
            question: "Jak se anglicky řekne „Bez ledu, prosím.“",
            correctAnswer: "No ice, please.",
            wrongAnswers: ["No sugar, please.", "With ice, please."],
          },

          /* ––– 13 ––– */
          {
            pageA: "Toto jídlo je studené.",
            pageB: `<p><b>This food is cold.</b></p>`,
            question: "Jak se anglicky řekne „Toto jídlo je studené.“",
            correctAnswer: "This food is cold.",
            wrongAnswers: ["This food is spicy.", "This drink is cold."],
          },

          /* ––– 14 ––– */
          {
            pageA: "Bylo to výborné, děkuji.",
            pageB: `<p><b>It was delicious, thank you.</b></p>`,
            question: "Jak se anglicky řekne „Bylo to výborné, děkuji.“",
            correctAnswer: "It was delicious, thank you.",
            wrongAnswers: [
              "It was terrible, thank you.",
              "It was expensive, thank you.",
            ],
          },

          /* ––– 15 ––– */
          {
            pageA: "Můžeme zaplatit zvlášť?",
            pageB: `<p><b>Can we pay separately?</b></p>`,
            question: "Jak se anglicky řekne „Můžeme zaplatit zvlášť?“",
            correctAnswer: "Can we pay separately?",
            wrongAnswers: ["Can we pay later?", "Can we pay with card?"],
          },

          /* ––– 16 ––– */
          {
            pageA: "Číšníku!",
            pageB: `<p><b>Excuse me!</b></p>`,
            question: "Jak se anglicky řekne „Číšníku!“ (oslovení obsluhy)",
            correctAnswer: "Excuse me!",
            wrongAnswers: ["Wait here!", "Good evening!"],
          },

          /* ––– 17 ––– */
          {
            pageA: "Máte nějaké bezlepkové možnosti?",
            pageB: `<p><b>Do you have any gluten-free options?</b></p>`,
            question:
              "Jak se anglicky řekne „Máte nějaké bezlepkové možnosti?“",
            correctAnswer: "Do you have any gluten-free options?",
            wrongAnswers: [
              "Do you have any spicy dishes?",
              "Do you have any dairy-free desserts?",
            ],
          },

          /* ––– 18 ––– */
          {
            pageA: "Trvá to ještě dlouho?",
            pageB: `<p><b>Is it going to take much longer?</b></p>`,
            question: "Jak se anglicky řekne „Trvá to ještě dlouho?“",
            correctAnswer: "Is it going to take much longer?",
            wrongAnswers: ["Is it very tasty?", "Does it come with rice?"],
          },

          /* ––– 19 ––– */
          {
            pageA: "Rád bych sklenku červeného vína.",
            pageB: `<p><b>I’d like a glass of red wine.</b></p>`,
            question:
              "Jak se anglicky řekne „Rád bych sklenku červeného vína.“",
            correctAnswer: "I’d like a glass of red wine.",
            wrongAnswers: [
              "I’d like a glass of white wine.",
              "I’d like a cup of tea.",
            ],
          },

          /* ––– 20 ––– */
          {
            pageA: "Potřebuji krabici na odnos.",
            pageB: `<p><b>Could I have a to-go box?</b></p>`,
            question: "Jak se anglicky řekne „Potřebuji krabici na odnos.“",
            correctAnswer: "Could I have a to-go box?",
            wrongAnswers: [
              "Could I have a knife?",
              "Could I have the receipt?",
            ],
          },
        ],
      },
      {
        name: "Restaurace 2",
        dummyContent: [
          /* ––– 1 ––– */
          {
            pageA: "Můžete mi dát prosím ještě trochu chleba?",
            pageB: `<p><b>Could we get some more bread, please?</b></p>`,
            question:
              "Jak se anglicky řekne „Můžete mi dát prosím ještě trochu chleba?“",
            correctAnswer: "Could we get some more bread, please?",
            wrongAnswers: [
              "Could we get some more water, please?",
              "Could we get the bill, please?",
            ],
          },

          /* ––– 2 ––– */
          {
            pageA: "Přinesete mi prosím pepřenku?",
            pageB: `<p><b>Could you bring me the pepper, please?</b></p>`,
            question: "Jak se anglicky řekne „Přinesete mi prosím pepřenku?“",
            correctAnswer: "Could you bring me the pepper, please?",
            wrongAnswers: [
              "Could you bring me the menu, please?",
              "Could you bring me the salt, please?",
            ],
          },

          /* ––– 3 ––– */
          {
            pageA: "Mohu si objednat dezert?",
            pageB: `<p><b>Could I order dessert?</b></p>`,
            question: "Jak se anglicky řekne „Mohu si objednat dezert?“",
            correctAnswer: "Could I order dessert?",
            wrongAnswers: ["Could I order drinks?", "Could I order breakfast?"],
          },

          /* ––– 4 ––– */
          {
            pageA: "Je toto jídlo vegetariánské?",
            pageB: `<p><b>Is this dish vegetarian?</b></p>`,
            question: "Jak se anglicky řekne „Je toto jídlo vegetariánské?“",
            correctAnswer: "Is this dish vegetarian?",
            wrongAnswers: ["Is this dish spicy?", "Is this dish gluten-free?"],
          },

          /* ––– 5 ––– */
          {
            pageA: "Můžete mi to zabalit sebou?",
            pageB: `<p><b>Could you wrap this to go, please?</b></p>`,
            question: "Jak se anglicky řekne „Můžete mi to zabalit sebou?“",
            correctAnswer: "Could you wrap this to go, please?",
            wrongAnswers: [
              "Could you warm this up, please?",
              "Could you throw this away, please?",
            ],
          },

          /* ––– 6 ––– */
          {
            pageA: "Přijímáte platební karty?",
            pageB: `<p><b>Do you accept credit cards?</b></p>`,
            question: "Jak se anglicky řekne „Přijímáte platební karty?“",
            correctAnswer: "Do you accept credit cards?",
            wrongAnswers: [
              "Do you accept reservations?",
              "Do you accept cash only?",
            ],
          },

          /* ––– 7 ––– */
          {
            pageA: "Máte dětské menu?",
            pageB: `<p><b>Do you have a kids’ menu?</b></p>`,
            question: "Jak se anglicky řekne „Máte dětské menu?“",
            correctAnswer: "Do you have a kids’ menu?",
            wrongAnswers: [
              "Do you have a wine list?",
              "Do you have an English menu?",
            ],
          },

          /* ––– 8 ––– */
          {
            pageA: "Potřebuji další ubrousky, prosím.",
            pageB: `<p><b>I need some more napkins, please.</b></p>`,
            question:
              "Jak se anglicky řekne „Potřebuji další ubrousky, prosím.“",
            correctAnswer: "I need some more napkins, please.",
            wrongAnswers: [
              "I need some more forks, please.",
              "I need the menu, please.",
            ],
          },

          /* ––– 9 ––– */
          {
            pageA: "Je v tom pokrmu mléko?",
            pageB: `<p><b>Does this dish contain dairy?</b></p>`,
            question: "Jak se anglicky řekne „Je v tom pokrmu mléko?“",
            correctAnswer: "Does this dish contain dairy?",
            wrongAnswers: [
              "Does this dish contain nuts?",
              "Does this dish contain meat?",
            ],
          },

          /* ––– 10 ––– */
          {
            pageA: "Můžete doporučit nějaké místní pivo?",
            pageB: `<p><b>Could you recommend a local beer?</b></p>`,
            question:
              "Jak se anglicky řekne „Můžete doporučit nějaké místní pivo?“",
            correctAnswer: "Could you recommend a local beer?",
            wrongAnswers: [
              "Could you recommend a dessert?",
              "Could you recommend a nearby hotel?",
            ],
          },

          /* ––– 11 ––– */
          {
            pageA: "Rád bych neperlivou vodu.",
            pageB: `<p><b>I’d like still water.</b></p>`,
            question: "Jak se anglicky řekne „Rád bych neperlivou vodu.“",
            correctAnswer: "I’d like still water.",
            wrongAnswers: [
              "I’d like sparkling water.",
              "I’d like apple juice.",
            ],
          },

          /* ––– 12 ––– */
          {
            pageA: "Omlouvám se, objednal jsem si něco jiného.",
            pageB: `<p><b>I’m sorry, I ordered something else.</b></p>`,
            question:
              "Jak se anglicky řekne „Omlouvám se, objednal jsem si něco jiného.“",
            correctAnswer: "I’m sorry, I ordered something else.",
            wrongAnswers: [
              "I’m sorry, I’m late.",
              "I’m sorry, it’s too spicy.",
            ],
          },

          /* ––– 13 ––– */
          {
            pageA: "Můžeme dostat stůl u okna?",
            pageB: `<p><b>Could we have a table by the window?</b></p>`,
            question: "Jak se anglicky řekne „Můžeme dostat stůl u okna?“",
            correctAnswer: "Could we have a table by the window?",
            wrongAnswers: [
              "Could we have a table outside?",
              "Could we have a bigger table?",
            ],
          },

          /* ––– 14 ––– */
          {
            pageA: "Jak dlouho budeme čekat?",
            pageB: `<p><b>How long will the wait be?</b></p>`,
            question: "Jak se anglicky řekne „Jak dlouho budeme čekat?“",
            correctAnswer: "How long will the wait be?",
            wrongAnswers: ["How long is the menu?", "How big is the table?"],
          },

          /* ––– 15 ––– */
          {
            pageA: "Můžete nám přinést další talířky?",
            pageB: `<p><b>Could we have some extra plates?</b></p>`,
            question:
              "Jak se anglicky řekne „Můžete nám přinést další talířky?“",
            correctAnswer: "Could we have some extra plates?",
            wrongAnswers: [
              "Could we have some extra chairs?",
              "Could we have some extra napkins?",
            ],
          },

          /* ––– 16 ––– */
          {
            pageA: "Účet dohromady, prosím.",
            pageB: `<p><b>The check together, please.</b></p>`,
            question: "Jak se anglicky řekne „Účet dohromady, prosím.“",
            correctAnswer: "The check together, please.",
            wrongAnswers: [
              "The check separately, please.",
              "The check later, please.",
            ],
          },

          /* ––– 17 ––– */
          {
            pageA: "Bylo by možné vyměnit přílohu?",
            pageB: `<p><b>Would it be possible to change the side dish?</b></p>`,
            question: "Jak se anglicky řekne „Bylo by možné vyměnit přílohu?“",
            correctAnswer: "Would it be possible to change the side dish?",
            wrongAnswers: [
              "Would it be possible to split the bill?",
              "Would it be possible to add cheese?",
            ],
          },

          /* ––– 18 ––– */
          {
            pageA: "Kolik stojí dnešní menu?",
            pageB: `<p><b>How much is today’s special?</b></p>`,
            question: "Jak se anglicky řekne „Kolik stojí dnešní menu?“",
            correctAnswer: "How much is today’s special?",
            wrongAnswers: ["What is today’s weather?", "How much is the taxi?"],
          },

          /* ––– 19 ––– */
          {
            pageA: "Je tu Wi-Fi?",
            pageB: `<p><b>Do you have Wi-Fi?</b></p>`,
            question: "Jak se anglicky řekne „Je tu Wi-Fi?“",
            correctAnswer: "Do you have Wi-Fi?",
            wrongAnswers: [
              "Do you have Wi-Fi password?",
              "Do you have a restroom?",
            ],
          },

          /* ––– 20 ––– */
          {
            pageA: "Všechno bylo skvělé.",
            pageB: `<p><b>Everything was great.</b></p>`,
            question: "Jak se anglicky řekne „Všechno bylo skvělé.“",
            correctAnswer: "Everything was great.",
            wrongAnswers: ["Everything was late.", "Everything was salty."],
          },
        ],
      },
    ],
  },
  // ⬇⬇  Klidně přidej další kategorií objekt  ⬇⬇
];

/* -------------------------------------------------------------------------- */
/* 1.  MAIN SEEDER                                                            */
/* -------------------------------------------------------------------------- */
async function seedContent(userId, teacher = false) {
  let createdCategoriesIds = [];
  for (const cat of categoriesSeed) {
    /* 1.1 – vytvoř / získej unikátní shareId (dup-key retry) */
    let categoryDoc;
    for (let retries = 0; retries < 5; retries++) {
      try {
        const shareId = uuid.v4().slice(0, 6);
        categoryDoc = await Category.create({
          text: cat.text,
          icon: cat.icon,
          author: userId,
          shareId,
          sections: [],
          createdByTeacher: teacher,
          numOfCards: 0,
          numOfQuestions: 0,
        });
        break; // success
      } catch (e) {
        if (e.code === 11000) continue; // dup shareId, try again
        throw e; // other error → bubble up
      }
    }
    if (!categoryDoc)
      throw new Error("Unable to generate unique shareId after 5 attempts.");

    createdCategoriesIds.push(categoryDoc._id);
    console.log(`Seeding category "${cat.text}"...`);
    /* 1.2 – SECTIONS */
    for (const sec of cat.sections) {
      const sectionDoc = await Section.create({
        name: sec.name,
        categoryId: categoryDoc._id,
        author: userId,
        cards: [],
        questions: [],
        createdByTeacher: teacher,
      });

      // ---- CARDS ---------------------------------------------------------
      const cardDocs = sec.dummyContent.map((d) => ({
        categoryId: categoryDoc._id,
        pageA: d.pageA,
        pageB: d.pageB,
        author: userId,
        section: sectionDoc._id,
      }));
      const insertedCards = await Card.insertMany(cardDocs);

      // ---- QUESTIONS -----------------------------------------------------
      const questionDocs = insertedCards.map((card, idx) => {
        const d = sec.dummyContent[idx];
        return {
          category: categoryDoc._id,
          categoryId: categoryDoc._id,
          section: sectionDoc._id,
          author: userId,
          question: d.question,
          correctAnswers: [d.correctAnswer],
          wrongAnswers: d.wrongAnswers,
          sourceCard: card._id,
        };
      });
      const insertedQuestions = await Question.insertMany(questionDocs);

      // ---- LINK cards ⇄ questions in one bulk op ------------------------
      await Card.bulkWrite(
        insertedCards.map((card, idx) => ({
          updateOne: {
            filter: { _id: card._id },
            update: { connectedQuestionId: insertedQuestions[idx]._id },
          },
        }))
      );

      // ---- FINALISE SECTION & CATEGORY ----------------------------------
      sectionDoc.cards = insertedCards.map((c) => c._id);
      sectionDoc.questions = insertedQuestions.map((q) => q._id);
      await sectionDoc.save();

      categoryDoc.sections.push(sectionDoc._id);
      categoryDoc.numOfCards += insertedCards.length;
      categoryDoc.numOfQuestions += insertedQuestions.length;
    }

    await categoryDoc.save();
    console.log(`✅  Category "${categoryDoc.text}" seeded.`);
  }
  return createdCategoriesIds;
}

module.exports = seedContent;
