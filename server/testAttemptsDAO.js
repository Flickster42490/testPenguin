const _ = require("lodash");

module.exports = {
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
