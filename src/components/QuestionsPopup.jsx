import React, { useEffect } from "react";
import Up from "../static/images/up.png";
import Down from "../static/images/down.png";
import { v4 as uuid } from "uuid";

const QuestionsPopup = ({
  upIndex,
  downIndex,
  index,
  questions,
  activeQuestion,
  handleJumpTag,
  handleJumpDownTag,
  moduleRef,
}) => {
  const styles = {
    width: `calc(100% / ${questions.length})`,
  };

  let pointersClassName = "";

  useEffect(() => {
    if (Boolean(moduleRef.current)) {
      const childArr = [...moduleRef.current.children];
      const questionsOnChildArr = childArr
        .filter((child) => {
          if (
            child.className.includes("question") &&
            !child.className.includes("Popup")
          ) {
            return child;
          }
        })
        .filter(Boolean);
      if (questionsOnChildArr.length >= 2) {
        pointersClassName = "noEvents";
      } else {
        pointersClassName = "";
      }
    }
  });

  return (
    <div className="QuestionsPopup">
      <div className="awnsers">
        <p>
          {index} de {questions.length} respondidas
        </p>
        <div className="line">
          {questions.map((chunk) => {
            let className = "";

            if (questions.indexOf(chunk) < index) {
              className = "active";
            }

            return (
              <div
                key={uuid()}
                style={styles}
                className={`chunk ${className}`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="QuestionManager">
        <h4>Preguntas</h4>
        <img
          src={Down}
          onClick={() => {
            if (pointersClassName === "") {
              activeQuestion.skipped ? handleJumpTag() : upIndex();
            }
          }}
          className="icon"
        ></img>
        <img
          src={Up}
          onClick={() => {
            if (pointersClassName === "") {
              const activeQuestionIndex = questions.indexOf(
                questions.find(
                  (question) => question.question === activeQuestion.question
                )
              );
              const upQuestion = questions[activeQuestionIndex - 1];
              if (Boolean(upQuestion)) {
                Boolean(upQuestion.tag) ? handleJumpDownTag() : downIndex();
              } else {
                downIndex();
              }
            }
          }}
          className="icon"
        ></img>
      </div>
    </div>
  );
};

export default QuestionsPopup;
