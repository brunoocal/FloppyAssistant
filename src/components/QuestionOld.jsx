import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Check from "../static/images/check.png";
import Right from "../static/images/right.svg";

const Question = React.forwardRef((props, ref) => {
  const {
    upIndex,
    dataProp,
    alldata,
    changeAllData,
    responded,
    finishOnClick,
  } = props;
  const [className, setClassName] = useState("");
  const [data, setData] = useState(dataProp);
  const QuestionRef = useRef(null);

  const handleClass = (e) => {
    if (e.target.value.length > 0) {
      setClassName("active");
    } else {
      setClassName("");
    }
  };

  useEffect(() => {
    if (data.value.length > 0) {
      setClassName("active");
    }
  }, [data]);

  useEffect(() => {
    const childrenArray = [...props.parentRef.current.children];

    if (QuestionRef !== null) {
      if (QuestionRef.current.className.includes("question-two-fade-enter")) {
        const otherQuestion = childrenArray.find(
          (quest) =>
            quest !== QuestionRef.current && !quest.className.includes("Popup")
        );

        if (otherQuestion !== undefined) {
          if (
            otherQuestion.className.includes("question-fade-exit") ||
            otherQuestion.className.includes("question-two-fade-exit")
          ) {
            if (
              !otherQuestion.className.includes(
                "question-two-override-fade-exit"
              )
            ) {
              otherQuestion.className = `${otherQuestion.className} question-two-override-fade-exit`;
            }
          }
          if (
            otherQuestion.className.includes("question-fade-exit-active") ||
            otherQuestion.className.includes("question-two-fade-exit-active")
          ) {
            if (
              !otherQuestion.className.includes(
                "question-two-override-fade-exit-active"
              )
            ) {
              otherQuestion.className = `${otherQuestion.className} question-two-override-fade-exit-active`;
            }
          }
          if (
            otherQuestion.className.includes("question-fade-exit-done") ||
            otherQuestion.className.includes("question-two-fade-exit-done")
          ) {
            console.log("question-fade-exit-done");
            if (!otherQuestion.className.includes("question-fade-exit-done")) {
              otherQuestion.className = `${otherQuestion.className} question-fade-exit-done`;
            }
          }
        }
      }
    }
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const newAllData = alldata.map((item) => {
        if (item.question === data.question) {
          return { ...data, value: event.target.value };
        }
        return item;
      });
      changeAllData(newAllData);

      upIndex();
    }
  };

  useEffect(() => {
    console.log(responded);
  });

  return (
    <div className="question" ref={QuestionRef} tabIndex="1">
      <div className="question-container">
        <div className="question-content">
          <div className="question-headers">
            <div className="question-index">
              <p>
                {alldata.indexOf(
                  alldata.find(
                    (questInFilter) => questInFilter.question === data.question
                  )
                ) + 1}
              </p>
              <img src={Right} alt="Right Arrow" />
            </div>

            <h2>{data.question}</h2>
            <h3>
              <strong>Ejemplo: </strong>
              {data.example}
            </h3>
          </div>
          <div className="question-input">
            <input
              className={className}
              placeholder={"Escribe aquí tu respuesta..."}
              onChange={async (e) => {
                await setData({
                  ...data,
                  value: e.target.value,
                });

                handleClass(e);
              }}
              onKeyDown={(e) => {
                if (e.target.value !== "") {
                  handleKeyDown(e);
                }
              }}
              value={data.value}
              type="text"
            />
            <TransitionGroup component={null}>
              {className !== "" && (
                <CSSTransition
                  in={className !== ""}
                  timeout={400}
                  classNames="question-button-fade"
                >
                  <div className="button-container">
                    <button
                      onClick={() =>
                        handleKeyDown({
                          key: "Enter",
                          target: { value: data.value },
                        })
                      }
                    >
                      Aceptar <img src={Check} alt="Check" />
                    </button>
                    <p>
                      pulsa <strong>Enter ↵</strong>
                    </p>
                  </div>
                </CSSTransition>
              )}

              {responded >= 3 && className !== "" && (
                <CSSTransition
                  in={responded >= 3}
                  timeout={400}
                  classNames="question-button-fade"
                >
                  <div className="button-container">
                    <button onClick={finishOnClick}>
                      Enviar <img src={Check} alt="Check" />
                    </button>
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Question;
