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
    text: "Základy společenských věd",
    icon: "subject_10.png",
    sections: [
      {
        name: "Psychologie 1",
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
        name: "Psychologie 2",
        dummyContent: [],
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
