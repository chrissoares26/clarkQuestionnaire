import React, { Component } from "react";
import PropTypes from "prop-types";
import { each as _each } from "lodash";

// constants
import { questionTypes } from "../../constants";

// styles
import "./Question.scss";

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: {},
      values: {},
      textAnswer: "",
      textAreaAnswer: "",
    };

    // bind to this
    this.generateAnswers = this.generateAnswers.bind(this);
    this.sendAnswerToParent = this.sendAnswerToParent.bind(this);
  }

  componentDidMount() {
    const { values } = this.state;
    const { choices } = this.props;

    // fill choices of each question if it is multi
    if (choices && choices.length > 1) {
      for (let value of choices) {
        values[value.value] = value.value;
      }

      this.setState({
        // fill an array of isChecked with false value
        isChecked: new Array(choices.length).fill(false),
        values: values,
      });
    }
  }

  // generate className for question
  generateClassName(isActive) {
    let className = "fadeIn Question";
    if (isActive) {
      return `${className}--IsActive`;
    }

    return className;
  }

  // handles radioButton change
  onRadioChanged(event, radioIndex) {
    const { index } = this.props;
    const { isChecked } = this.state;
    const answer = event.target.value;

    // set all choices as false except the one selected
    for (let i = 0; i < isChecked.length; i++) {
      isChecked[i] = i === radioIndex;
    }

    this.setState(
      {
        isChecked: isChecked,
      },
      () => {
        // send answer to parent
        this.props.saveAnswer(index, answer);
      }
    );
  }

  // handles input type text or textarea
  onInputChanged(event, isTextArea) {
    const value = event.target.value;
    if (isTextArea) {
      this.setState(
        {
          textAreaAnswer: value,
        },
        () => {
          this.sendAnswerToParent(isTextArea);
        }
      );
    } else {
      this.setState(
        {
          textAnswer: value,
        },
        () => {
          this.sendAnswerToParent(isTextArea);
        }
      );
    }
  }

  // sends answer to parent
  sendAnswerToParent(isTextArea) {
    const { index } = this.props;
    const { textAreaAnswer, textAnswer } = this.state;
    this.props.saveAnswer(index, isTextArea ? textAreaAnswer : textAnswer);
  }

  /**
   * generates answers for multiple-choice questinos
   * and input for question with multine false
   * and textarea for question with multiline true
   * @returns {Array}
   */
  generateAnswers() {
    const { type, choices, multiple, id, multiLine } = this.props;
    const { isChecked, textAnswer, textAreaAnswer, values } = this.state;
    let answers = [];
    if (type === questionTypes.MULTIPLE_CHOICE && !multiple) {
      _each(choices, (choice, index) => {
        answers.push(
          <label className="Radio RadioControl" key={index}>
            {choice.label}
            <input
              type="radio"
              onChange={(event) => this.onRadioChanged(event, index)}
              name={id}
              value={values[choice.value]}
              checked={isChecked[index]}
            />
            <div className="RadioIndicator"></div>
          </label>
        );
      });
    } else if (type === questionTypes.TEXT && !multiLine) {
      answers.push(
        <input
          type="text"
          key={type}
          name="text"
          className="Answers__Text"
          value={textAnswer}
          onChange={(event) => this.onInputChanged(event, false)}
        />
      );
    } else {
      answers.push(
        <textarea
          className="Answers__TextArea"
          key={type}
          name="textArea"
          value={textAreaAnswer}
          onChange={(event) => this.onInputChanged(event, true)}
        ></textarea>
      );
    }

    return answers;
  }

  render() {
    const { headLine, required, isActive, choices } = this.props;
    return (
      <div className={this.generateClassName(isActive)}>
        <div className="Question__Body">
          <div className="Body__Headline">
            {headLine}
            <span> {required ? "*" : ""}</span>
          </div>
          <div
            className="Body__Answers"
            style={{ width: choices && choices.length > 1 ? "auto" : "100%" }}
          >
            {this.generateAnswers()}
          </div>
        </div>
      </div>
    );
  }
}

Question.defaultProps = {
  multiLine: false,
  jumps: [],
  choices: [],
  multiple: false,
  isActive: false,
};

Question.propTypes = {
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  headLine: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  multiLine: PropTypes.bool,
  jumps: PropTypes.array,
  choices: PropTypes.array,
  multiple: PropTypes.bool,
  isActive: PropTypes.bool,
};

export default Question;
