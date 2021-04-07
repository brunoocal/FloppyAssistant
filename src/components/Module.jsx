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

  let moduleTagFromForEach = "null";

  moduleData.questions.forEach((quest) => {
    if (Boolean(quest.skipped)) {
      moduleTagFromForEach = quest.tag;
      console.log(moduleTagFromForEach);
    }
    if (quest.tag === moduleTagFromForEach) {
      respondedQuestions += 1;
    }

    if (quest.response) {
      respondedQuestions += 1;
    }
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

  const handleJumpTag = () => {
    const tag = activeQuestion.tag;
    console.log(tag);
    let newIndex;
    moduleData.questions.forEach((question) => {
      if (question.tag === tag) {
        if (question.question !== activeQuestion.question) {
          console.log(question.question);
          newIndex = moduleData.questions.indexOf(question) + 1;
        }
      }
    });
    setQuestionAnimationClass("question-fade");
    setActiveQuestion(moduleData.questions[newIndex]);
  };

  const handleJumpDownTag = () => {
    console.log(activeQuestion);
    const activeQuestionIndex = moduleData.questions.indexOf(
      moduleData.questions.find(
        (question) => question.question === activeQuestion.question
      )
    );
    const upQuestion = moduleData.questions[activeQuestionIndex - 1];
    const tag = upQuestion.tag;
    let newIndex = activeQuestionIndex - 1;
    if (
      moduleData.questions.find((question) => question.tag === tag).question !==
      upQuestion.question
    ) {
      if (
        moduleData.questions.find((question) => question.tag === tag).skipped
      ) {
        newIndex = moduleData.questions.indexOf(
          moduleData.questions.find((question) => question.tag === tag)
        );
      }
    }
    setQuestionAnimationClass("question-two-fade");
    setActiveQuestion(moduleData.questions[newIndex]);
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
                    upIndexSkipTag: handleJumpTag,
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
                handleJumpTag={handleJumpTag}
                handleJumpDownTag={handleJumpDownTag}
                questions={moduleData.questions}
                activeQuestion={activeQuestion}
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
