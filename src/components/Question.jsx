import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Check from "../static/images/check.png";
import Right from "../static/images/right.svg";

const Question = React.forwardRef((props, ref) => {
  const {
    isParentQuestion,
    data,
    required,
    index,
    moduleindex,
    responded,
    events,
    setStates,
    getStates,
    parentRef,
  } = props;
  const [questionData, setData] = useState(data);
  const [inputFocusClassName, setInputClassName] = useState("");
  const QuestionRef = useRef(null);

  //-----------------------------------------
  //            EVENT HANDLERS
  //-----------------------------------------

  const handleClass = (e) => {
    if (e.target.value.length > 0) {
      setInputClassName("active");
    } else {
      setInputClassName("");
    }
  };

  useEffect(() => {
    if (!isParentQuestion) {
      if (questionData.response.length > 0) {
        setInputClassName("active");
      }
    }
  }, [questionData]);

  useEffect(() => {
    if (!isParentQuestion) {
      const childrenArray = [...parentRef.current.children];

      if (QuestionRef !== null) {
        if (QuestionRef.current.className.includes("question-two-fade-enter")) {
          const otherQuestion = childrenArray.find(
            (quest) =>
              quest !== QuestionRef.current &&
              !quest.className.includes("Popup")
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
              if (
                !otherQuestion.className.includes("question-fade-exit-done")
              ) {
                otherQuestion.className = `${otherQuestion.className} question-fade-exit-done`;
              }
            }
          }
        }
      }
    }
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const moduleData = getStates.data;
      const newQuestionsData = moduleData.questions.map((question) => {
        if (question.question === questionData.question) {
          if (event.jumpQuestion) {
            return {
              ...questionData,
              response: event.target.value,
              skipped: true,
            };
          }
          if (event.void) {
            return {
              ...questionData,
              response: event.target.value,
              void: true,
            };
          }
          return {
            ...questionData,
            response: event.target.value,
            skipped: false,
          };
        }
        return question;
      });

      setStates.setDataInLS({ ...moduleData, questions: newQuestionsData });

      event.nextModule
        ? events.nextModule()
        : event.jumpQuestion
        ? events.upIndexSkipTag()
        : events.upIndex();
    }
  };

  const handleTrueResponse = () => {
    events.handleParentResponse(true);
  };

  const handleFalseResponse = () => {
    events.handleParentResponse(false);
  };

  //-----------------------------------------
  //            CLOSE EVENT HANDLERS
  //-----------------------------------------

  if (isParentQuestion) {
    return (
      <div className="question" tabIndex="1">
        <div className="question-container">
          <div className="question-content">
            <div className="question-headers parentQuestion">
              <div className="question-index parentQuestion">
                <p>{moduleindex + 1}</p>
                <img src={Right} alt="Right Arrow" />
              </div>

              <h2>{data}</h2>
            </div>
            <div className="question-input parentQuestion">
              <TransitionGroup component={null}>
                {!required ? (
                  <>
                    <CSSTransition
                      in={true}
                      timeout={400}
                      classNames="question-button-fade"
                    >
                      <div className="button-container parentYes">
                        <button onClick={handleTrueResponse}>Sí</button>
                      </div>
                    </CSSTransition>

                    <CSSTransition
                      in={true}
                      timeout={400}
                      classNames="question-button-fade"
                    >
                      <div className="button-container parentNo">
                        <button onClick={handleFalseResponse}>No</button>
                      </div>
                    </CSSTransition>
                  </>
                ) : (
                  <CSSTransition
                    in={true}
                    timeout={400}
                    classNames="question-button-fade"
                  >
                    <div className="button-container parentYes continue">
                      <button onClick={handleTrueResponse}>Continuar</button>
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="question" tabIndex="1" ref={QuestionRef}>
      <div className="question-container">
        <div className="question-content">
          <div className="question-headers">
            <div className="question-index">
              <p>{index + 1}</p>
              <img src={Right} alt="Right Arrow" />
            </div>

            <h2>{data.question}</h2>
            {!questionData.buttons && (
              <h3>
                <strong>Ejemplo: </strong>
                {data.example}
              </h3>
            )}
          </div>
          <div className="question-input">
            {!questionData.buttons ? (
              <input
                className={inputFocusClassName}
                placeholder={"Escribe aquí tu respuesta..."}
                onChange={(e) => {
                  //PERFECTO PORQUE LA DATA ES ACTUALIZADA, LO QUE NO SE ACTUALIZA SON LOS PADRES
                  setData({
                    ...questionData,
                    response: e.target.value,
                  });

                  handleClass(e);
                }}
                onKeyDown={(e) => {
                  if (e.target.value !== "") {
                    if (
                      //ACTUALIZAR LOGICA ULTIMA PREGUNTA
                      getStates.data.questions.find(
                        (question) =>
                          question.question === questionData.question
                      ).question ===
                      getStates.data.questions[
                        getStates.data.questions.length - 1
                      ].question
                    ) {
                      handleKeyDown({ ...e, nextModule: true });
                    } else {
                      handleKeyDown(e);
                    }
                  }
                }}
                value={questionData.response}
                type="text"
              />
            ) : (
              <div className="YesNoButtons">
                <CSSTransition
                  in={questionData.buttons}
                  timeout={400}
                  classNames="question-button-fade"
                >
                  <div className="button-container">
                    <button
                      onClick={() =>
                        handleKeyDown({
                          key: "Enter",
                          target: { value: "true" },
                        })
                      }
                    >
                      Sí
                    </button>
                  </div>
                </CSSTransition>

                <CSSTransition
                  in={questionData.buttons}
                  timeout={400}
                  classNames="question-button-fade"
                >
                  <div className="button-container">
                    <button
                      onClick={() => {
                        if (Boolean(questionData.tag)) {
                          handleKeyDown({
                            key: "Enter",
                            target: { value: "false" },
                            jumpQuestion: true,
                          });
                        } else {
                          handleKeyDown({
                            key: "Enter",
                            target: { value: "false" },
                          });
                        }
                      }}
                    >
                      No
                    </button>
                  </div>
                </CSSTransition>
              </div>
            )}

            <TransitionGroup component={null}>
              <div className="buttons">
                {inputFocusClassName !== "" &&
                  getStates.data.questions.find(
                    (question) => question.question === questionData.question
                  ).question !==
                    getStates.data.questions[
                      getStates.data.questions.length - 1
                    ].question &&
                  !questionData.buttons && (
                    <CSSTransition
                      in={inputFocusClassName !== ""}
                      timeout={400}
                      classNames="question-button-fade"
                    >
                      <div className="button-container">
                        <button
                          onClick={() =>
                            handleKeyDown({
                              key: "Enter",
                              target: { value: questionData.response },
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

                {responded &&
                  inputFocusClassName !== "" &&
                  getStates.data.questions.find(
                    (question) => question.question === questionData.question
                  ).question ===
                    getStates.data.questions[
                      getStates.data.questions.length - 1
                    ].question && (
                    <CSSTransition
                      in={responded && inputFocusClassName !== ""}
                      timeout={400}
                      classNames="question-button-fade"
                    >
                      <div className="button-container finishModule">
                        <button
                          onClick={() =>
                            handleKeyDown({
                              key: "Enter",
                              target: { value: questionData.response },
                              nextModule: true,
                            })
                          }
                        >
                          Continuar <img src={Check} alt="Check" />
                        </button>
                      </div>
                    </CSSTransition>
                  )}
                {Boolean(questionData.tag) &&
                  !Boolean(questionData.buttons) &&
                  getStates.data.questions.find(
                    (question) => question.tag === questionData.tag
                  ).question === questionData.question && (
                    <CSSTransition
                      in={Boolean(questionData.tag)}
                      timeout={400}
                      classNames="question-button-fade"
                    >
                      <div
                        className={`button-container finishModule ${
                          inputFocusClassName !== "" ? "jumpQuestion" : ""
                        }`}
                      >
                        <button
                          onClick={() => {
                            handleKeyDown({
                              key: "Enter",
                              target: { value: questionData.response },
                              jumpQuestion: true,
                            });
                          }}
                        >
                          {questionData.skipped ? "Saltado" : "Saltar"}
                          <img src={Check} alt="Check" />
                        </button>
                      </div>
                    </CSSTransition>
                  )}

                {!Boolean(questionData.tag) &&
                  !Boolean(questionData.buttons) &&
                  !Boolean(questionData.required) && (
                    <CSSTransition
                      in={true}
                      timeout={400}
                      classNames="question-button-fade"
                    >
                      <div
                        className={`button-container finishModule ${
                          inputFocusClassName !== "" ? "jumpQuestion" : ""
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (
                              getStates.data.questions.find(
                                (question) =>
                                  question.question === questionData.question
                              ).question ===
                              getStates.data.questions[
                                getStates.data.questions.length - 1
                              ].question
                            ) {
                              handleKeyDown({
                                key: "Enter",
                                target: { value: questionData.response },
                                void: true,
                                nextModule: true,
                              });
                            } else {
                              handleKeyDown({
                                key: "Enter",
                                target: { value: questionData.response },
                                void: true,
                              });
                            }
                          }}
                        >
                          Saltar
                          <img src={Check} alt="Check" />
                        </button>
                      </div>
                    </CSSTransition>
                  )}
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Question;
