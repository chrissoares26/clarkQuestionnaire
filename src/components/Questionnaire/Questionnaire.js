import React, { Fragment, Component } from "react";
import {
  filter as _filter,
  includes as _includes,
  findIndex as _findIndex,
} from "lodash";

import Loader from "../Loader/Loader";
import Question from "../Question/Question";

import QuestionnaireService from "../../services/Questionnarie";

import { stringToBool, swapElements } from "../../helpers";

import { animationDirections } from "../../constants";

import "./Questionnarie.scss";

class Questionnaire extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      questions: [],
      answers: {},
      isLoading: true,
      activeQuestion: 0,
      isStartClicked: false,
      isFinishClicked: false,
    };

    // bind to this
    this.loadQuestion = this.loadQuestion.bind(this);
    this.animateFadeOut = this.animateFadeOut.bind(this);
    this.onStartClicked = this.onStartClicked.bind(this);
  }

  componentDidMount() {
    this.loadQuestion();
  }

  loadQuestion() {
    // mock data loading by delaying json reading for 1.8 seconds
    setTimeout(() => {
      QuestionnaireService.getQuestionnaire()
        .then((questionnaire) => {
          const questions = questionnaire["questions"];

          this.setState({
            name: questionnaire["name"],
            description: questionnaire["description"],
            questions: questions,
            isLoading: false,
          });
        })
        .catch((err) => {
          console.error(`error while reading data: ${err}`);
          this.setState({
            error: err,
          });
        });
    }, 1800);
  }

  /**
   * handles next and prev buttons click
   * @param direction
   */
  onNavigateBtnClicked(direction) {
    const { activeQuestion } = this.state;

    // animate current active question
    this.animateFadeOut(direction);

    // set next/prev active question after a delay
    setTimeout(() => {
      this.setState({
        activeQuestion:
          direction === animationDirections.LEFT
            ? activeQuestion + 1
            : activeQuestion - 1,
      });
    }, 650);
  }

  /**
   * takes direction
   * and animate current active question element
   * based on direction param
   * @param direction
   */
  animateFadeOut(direction) {
    // get question element
    const elementToAnimate = this.refs.Questionnaire.querySelector(
      ".Question--IsActive"
    );

    // add animation class based on its direction
    elementToAnimate.classList.add(
      direction === animationDirections.LEFT ? "zoomOutLeft" : "zoomOutRight"
    );
  }

  /**
   * save question answer in state
   * @param questionIndex
   * @param answer
   */
  onAnswerHandler(questionIndex, answer) {
    let { questions, answers, activeQuestion } = this.state;
    answers[questionIndex] = answer;

    this.setState(
      {
        answers: answers,
      },
      () => {
        const jumps = questions[questionIndex].jumps;

        if (jumps && jumps.length > 0) {
          // extract possible jumps
          let jumpIds = jumps.map((jump) => jump.destination.id);

          // get next question id
          let nextQuestionId;
          for (let jump of jumps) {
            if (jump.conditions[0].value === answer) {
              nextQuestionId = jump.destination.id;
            }
          }

          // remove nextQuestionId from jumpIds
          jumpIds = _filter(jumpIds, (jump) => jump !== nextQuestionId);

          // remove unnecessary jumps from questions array
          questions = _filter(questions, (question) => {
            return !_includes(jumpIds, question.identifier);
          });

          // get index of nextQuestion
          const jumpIndex = _findIndex(questions, (question) => {
            return question.identifier === nextQuestionId;
          });

          // swap
          questions = swapElements(questions, activeQuestion + 1, jumpIndex);

          // save state
          this.setState({
            questions: questions,
          });
        }
      }
    );
  }

  /**
   * handles start button click
   */
  onStartClicked() {
    this.setState({
      isStartClicked: true,
    });
  }

  /**
   * handles finish click
   */
  onFinishClicked() {
    this.setState({
      isFinishClicked: true,
    });
  }

  render() {
    const {
      isStartClicked,
      name,
      description,
      activeQuestion,
      questions,
      isLoading,
      answers,
      isFinishClicked,
    } = this.state;

    // show loader
    if (isLoading) {
      return <Loader />;
    }

    return (
      <div className="Questionnaire" ref="Questionnaire">
        {!isStartClicked && (
          <div className="Questionnaire__Intro">
            <h1 className="Intro__Name">{name}</h1>
            <h5 className="Intro__Description">{description}</h5>
            <button className="Intro__BtnStart" onClick={this.onStartClicked}>
              Start
            </button>
          </div>
        )}

        {!isFinishClicked && isStartClicked && (
          <Fragment>
            {questions &&
              questions.map((question, index) => {
                return (
                  <Question
                    key={question.identifier}
                    type={question.question_type}
                    index={index}
                    required={question.required}
                    headLine={question.headline}
                    id={question.identifier}
                    multiLine={stringToBool(question.multiline)}
                    jumps={question.jumps}
                    choices={question.choices}
                    multiple={stringToBool(question.multiple)}
                    isActive={activeQuestion === index}
                    saveAnswer={(index, answer) =>
                      this.onAnswerHandler(index, answer)
                    }
                  />
                );
              })}
            {activeQuestion > 0 && (
              <button
                className="Questionnaire__BtnPrev fadeInLeft"
                onClick={() =>
                  this.onNavigateBtnClicked(animationDirections.RIGHT)
                }
              >
                <i className="fas fa-chevron-left" />
              </button>
            )}
            {activeQuestion !== questions.length - 1 &&
              !!answers[activeQuestion] && (
                <button
                  className="Questionnaire__BtnNext fadeInRight"
                  onClick={() =>
                    this.onNavigateBtnClicked(animationDirections.LEFT)
                  }
                >
                  <i className="fas fa-chevron-right" />
                </button>
              )}
            {activeQuestion === questions.length - 1 && (
              <button
                className="Questionnaire__BtnFinish"
                onClick={() => this.onFinishClicked()}
              >
                Finish
              </button>
            )}
          </Fragment>
        )}

        {isFinishClicked && (
          <div className="Questionnaire__FinishText">Danke!</div>
        )}
      </div>
    );
  }
}

export default Questionnaire;
