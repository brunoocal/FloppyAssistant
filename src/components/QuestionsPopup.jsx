import React from "react";
import Up from "../static/images/up.png";
import Down from "../static/images/down.png";
import { v4 as uuid } from "uuid";

const QuestionsPopup = ({ upIndex, downIndex, index, questions }) => {
  const styles = {
    width: `calc(100% / ${questions.length})`,
  };

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
        <img src={Down} onClick={upIndex} className="icon"></img>
        <img src={Up} onClick={downIndex} className="icon"></img>
      </div>
    </div>
  );
};

export default QuestionsPopup;
