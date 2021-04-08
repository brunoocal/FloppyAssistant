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

  //NEW METHODS
  //NEW METHODS
  //NEW METHODS
  //NEW METHODS
  //NEW METHODS
  //NEW METHODS
  //NEW METHODS
  //NEW METHODS
  //NEW METHODS

  const handleSetParentQuestionResponse = (value) => {
    if (value) {
      localStorage.setItem(
        moduleData.path,
        JSON.stringify({ ...moduleData, parentQuestionResponse: value })
      );
      setActiveQuestion(moduleData.questions[index]);
      setModuleData(JSON.parse(localStorage.getItem(moduleData.path)));
    } else {
      handleNextModule();
    }
  };

  const handleSetDataInModuleFromQuestion = (dataFromResponedQuestion) => {
    localStorage.setItem(
      moduleData.path,
      JSON.stringify(dataFromResponedQuestion)
    );

    console.log(localStorage);
    setModuleData(JSON.parse(localStorage.getItem(moduleData.path)));
  };

  const handleNextModuleAndLS = () => {
    console.log("DATA:", moduleData.questions);
    console.log(JSON.parse(localStorage.getItem(moduleData.path)));
    setActiveQuestion("");

    events.upIndex();
  };

  //-----------------------------------------
  //               USE EFFECTS
  //-----------------------------------------

  useEffect(() => {
    if (
      moduleData.questions
        .map(function (quest, i) {
          if (quest.response === "" || quest.response.length < 1) {
            return quest;
          }
        })
        .filter(Boolean).length <= 0
    ) {
      console.log("todas respondidas");
      events.setDataOnMain(moduleData);
    } else {
      const notRespondedQuestions = moduleData.questions
        .map(function (quest, i) {
          if (quest.response === "" || quest.response.length < 1) {
            return quest;
          }
        })
        .filter(Boolean);

      const tagsStrippedArray = notRespondedQuestions
        .map((question) => {
          if (Boolean(question.tag)) {
            return;
          }
          return question;
        })
        .filter(Boolean);
      console.log("tagsStrippedArray", tagsStrippedArray);
      if (tagsStrippedArray.length <= 0) {
        events.setDataOnMain(moduleData);
      }
    }
  }, [moduleData]);

  useEffect(() => {
    if (Boolean(moduleData.path)) {
      localStorage.setItem(moduleData.path, JSON.stringify(moduleData));
    }

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
                    nextModule: handleNextModuleAndLS,
                    upIndexSkipTag: handleJumpTag,
                  }}
                  setStates={{
                    setData: setModuleData,
                    setDataInLS: handleSetDataInModuleFromQuestion,
                  }}
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
