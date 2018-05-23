const _ = require("lodash");

module.exports = {
  aggregateResults: r => {
    let newResult = _.reduce(
      r,
      (obj, i) => {
        if (i.type === "multiple_choice") {
          if (!obj.multipleChoice) {
            obj.multipleChoice = { correct: 0, wrong: 0 };
          }
          if (i.correct)
            obj.multipleChoice.correct = obj.multipleChoice.correct + 1;
          else if (!i.correct)
            obj.multipleChoice.wrong = obj.multipleChoice.wrong + 1;
        } else if (i.type === "module" && i.module_type === "journal_entry") {
          if (!obj.journalEntry) {
            obj.journalEntry = { correctRows: 0, wrongRows: 0 };
          }
          obj.journalEntry.correctRows =
            obj.journalEntry.correctRows + i.correctRows;
          obj.journalEntry.wrongRows = obj.journalEntry.wrongRows + i.wrongRows;
        }
        return obj;
      },
      {}
    );
    return newResult;
  },
  checkJournalEntryAnswers: q => {
    let question = {
      id: q.id,
      type: q.type,
      module_type: q.module_type,
      totalRows: 0,
      correctRows: 0,
      wrongRows: 0
    };
    q.module_answer.segments.forEach((s, sIdx) => {
      s.rows.forEach((r, rIdx) => {
        question.totalRows = question.totalRows + 1;
        let rowCorrect = false;
        q.module_candidate_answer.segments[sIdx].rows.forEach(check => {
          if (_.isEqual(_.omit(check, "id"), _.omit(r, "id")))
            rowCorrect = true;
        });
        if (rowCorrect) question.correctRows = question.correctRows + 1;
        else question.wrongRows = question.wrongRows + 1;
      });
    });
    return question;
  }
};
