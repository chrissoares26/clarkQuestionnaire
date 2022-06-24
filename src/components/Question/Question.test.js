import React from "react";
import { shallow } from "enzyme";

import Question from "./Question";

describe("Question Component", () => {
  it("renders type text without crashing", () => {
    shallow(
      <Question
        required={false}
        id={1}
        headLine="HeadLine"
        index={0}
        type="text"
        saveAnswer={() => {}}
      />
    );
  });

  it("renders input type=text", () => {
    const question = shallow(
      <Question
        required={false}
        id={1}
        headLine="HeadLine"
        index={0}
        type="text"
        saveAnswer={() => {}}
      />
    );
    expect(question.find('input[type="text"]')).not.toBeNull();
  });

  it("renders input type=radio with choices", () => {
    const choices = [
      {
        label: "Meine Familie mit Kindern",
        value: "Meine Familie mit Kindern",
        selected: false,
      },
      {
        label: "Meine Familie ohne Kinder",
        value: "Meine Familie ohne Kinder",
        selected: false,
      },
    ];
    const question = shallow(
      <Question
        required={false}
        id={1}
        headLine="HeadLine"
        choices={choices}
        index={0}
        type="multiple-choice"
        saveAnswer={() => {}}
      />
    );

    expect(question.find('input[type="radio"]')).not.toBeNull();
  });

  it("renders type textarea without crashing", () => {
    shallow(
      <Question
        required={false}
        id={1}
        multiLine={true}
        headLine="HeadLine"
        index={0}
        type="text"
        saveAnswer={() => {}}
      />
    );
  });

  it("renders textArea", () => {
    const question = shallow(
      <Question
        required={false}
        id={1}
        multiLine={true}
        headLine="HeadLine"
        index={0}
        type="text"
        saveAnswer={() => {}}
      />
    );

    expect(question.find("textarea")).not.toBeNull();
  });

  it("Simulates saveAnswer on textarea", () => {
    const saveAnswerMock = jest.fn();
    const event = { target: { name: "textArea", value: "some text" } };
    const question = shallow(
      <Question
        required={false}
        id={1}
        headLine="HeadLine"
        index={0}
        multiLine={true}
        type="text"
        saveAnswer={saveAnswerMock}
      />
    );
    question.find("textarea").simulate("change", event);
    expect(saveAnswerMock).toHaveBeenCalledTimes(1);
    expect(question.state().textAreaAnswer).toEqual("some text");
  });

  it("Simulates saveAnswer on input[type=text]", () => {
    const saveAnswerMock = jest.fn();
    const event = { target: { name: "text", value: "some text" } };
    const question = shallow(
      <Question
        required={false}
        id={1}
        headLine="HeadLine"
        index={0}
        type="text"
        saveAnswer={saveAnswerMock}
      />
    );
    question.find('input[type="text"]').simulate("change", event);
    expect(saveAnswerMock).toHaveBeenCalledTimes(1);
    expect(question.state().textAnswer).toEqual("some text");
  });
});
