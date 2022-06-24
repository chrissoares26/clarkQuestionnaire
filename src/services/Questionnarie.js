const QuestionnaireService = {
  getQuestionnaire: () => {
    return fetch(`./data/questionnaire.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((questionnaire) => {
        return questionnaire["questionnaire"];
      })
      .catch((err) => {
        throw err;
      });
  },
};

export default QuestionnaireService;
