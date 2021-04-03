import React, { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { v4 as uuid } from "uuid";
import Question from "@components/Question";
import QuestionsPopup from "@components/QuestionsPopup";

const Module = React.memo(({ data, events }) => {
  const [moduleData, setModuleData] = useState(data);
  const [activeQuestion, setActiveQuestion] = useState("");
  const ModuleRef = useRef(null);
  const [questionAnimationClass, setQuestionAnimationClass] = useState(
    "question-fade"
  );

  let index = moduleData.questions.indexOf(
    moduleData.questions.find(
      (question) => question.question === activeQuestion.question
    )
  );

  let respondedQuestions = 0;

  moduleData.questions.forEach((quest) => {
    if (quest.response) respondedQuestions += 1;
  });

  if (index === -1) {
    index = 0;
  }

  //-----------------------------------------
  //             EVENT HANDLERS
  //-----------------------------------------

  const handleUpIndex = () => {
    index + 1 >= moduleData.questions.length ? (index = 0) : (index += 1);
    console.log(index);
    setQuestionAnimationClass("question-fade");
    setActiveQuestion(moduleData.questions[index]);
  };

  const handleDownIndex = () => {
    index - 1 < 0 ? (index = moduleData.questions.length - 1) : (index -= 1);
    setQuestionAnimationClass("question-two-fade");
    setActiveQuestion(moduleData.questions[index]);
  };

  const handleSetParentQuestionResponse = (value) => {
    if (value) {
      setActiveQuestion(moduleData.questions[index]);
      setModuleData({ ...moduleData, parentQuestionResponse: value });
    } else {
      handleNextModule();
    }
  };

  const handleNextModule = () => {
    console.log("DATA:", moduleData.questions);
    setActiveQuestion("");
    console.log("senddata");
    events.sendData(moduleData);
    events.upIndex();
  };

  //-----------------------------------------
  //            CLOSE EVENT HANDLERS
  //-----------------------------------------

  //-----------------------------------------
  //               USE EFFECTS
  //-----------------------------------------

  useEffect(() => {
    if (moduleData.parentQuestionResponse) {
      setActiveQuestion(moduleData.questions[index]);
    }

    if (
      moduleData.questions
        .map(function (quest) {
          if (quest.response === "" || quest.response.length < 1) {
            return quest;
          }
        })
        .filter(Boolean).length <= 0
    ) {
      console.log("todas respondidas");
      events.sendData(moduleData);
    }
  }, [moduleData]);

  useEffect(() => {
    setActiveQuestion(moduleData.parentQuestion);
  }, []);

  //-----------------------------------------
  //            CLOSE USE EFFECTS
  //-----------------------------------------

  return (
    <>
      <div className="module" ref={ModuleRef}>
        <TransitionGroup component={null}>
          {activeQuestion !== "" && (
            <CSSTransition
              in={activeQuestion !== ""}
              timeout={2000}
              classNames={questionAnimationClass}
              key={uuid()}
            >
              {!moduleData.parentQuestionResponse ? (
                <Question
                  isParentQuestion
                  required={moduleData.required}
                  data={activeQuestion}
                  events={{
                    upIndex: handleUpIndex,
                    downIndex: handleDownIndex,
                    handleParentResponse: handleSetParentQuestionResponse,
                  }}
                />
              ) : (
                <Question
                  data={activeQuestion}
                  index={index}
                  events={{
                    upIndex: handleUpIndex,
                    downIndex: handleDownIndex,
                    handleParentResponse: handleSetParentQuestionResponse,
                    nextModule: handleNextModule,
                  }}
                  setStates={{ setData: setModuleData }}
                  getStates={{ data: moduleData }}
                  parentRef={ModuleRef}
                  responded={
                    respondedQuestions >= moduleData.questions.length - 1
                      ? true
                      : false
                  }
                />
              )}
            </CSSTransition>
          )}
          {moduleData.parentQuestionResponse && (
            <CSSTransition
              in={moduleData.parentQuestionResponse}
              timeout={3400}
              classNames="footer-fade"
            >
              <QuestionsPopup
                upIndex={handleUpIndex}
                downIndex={handleDownIndex}
                questions={moduleData.questions}
                index={respondedQuestions}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </>
  );
});

export default Module;
