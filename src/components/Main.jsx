import { useState, useEffect, useRef } from "react";

import "@styles/Main.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Hero from "@components/Hero";
import Question from "@components/Question";
import QuestionsPopup from "@components/QuestionsPopup";
import Check from "../static/images/check.png";
import { v4 as uuid } from "uuid";
import Finish from "./Finish";

const Main = () => {
  const [heroActive, setHeroActive] = useState(true);
  const [questionsActive, setQuestionsActive] = useState(false);
  const [finishActive, setfinishActive] = useState(false);

  const [questions, setQuestions] = useState([
    {
      question: "¿Cuál quieres que sea el prefix de Floppy?",
      example: "!",
      value: "",
    },
    {
      question: "¿Quieres activar los mensajes de bienvenida?",
      example: "Sí o No",
      value: "",
    },
    {
      question: "¿Quieres activar los mensajes de despedida?",
      example: "Sí o No",
      value: "",
    },
    {
      question: "¿Quieres activar los logs?",
      example: "Sí o No",
      value: "",
    },
  ]);
  const [activeQuestion, setActiveQuestion] = useState({});
  const [config, setConfig] = useState({});
  const HeroRef = useRef(null);
  const QuestionParentRef = useRef(null);

  let index = questions.indexOf(
    questions.find(
      (questInFilter) => questInFilter.question === activeQuestion.question
    )
  );

  let respondedInputs = 0;

  questions.forEach((quest) => {
    if (quest.value) respondedInputs += 1;
  });

  const [questionAnimationClass, setQuestionAnimationClass] = useState(
    "question-fade"
  );

  const handleFinishButton = () => {
    setQuestionsActive(false);
    setfinishActive(true);
  };

  const handleStartButton = () => {
    setHeroActive(false);
    setQuestionsActive(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStartButton();
      HeroRef.current.removeEventListener("keydown", handleKeyDown);
    }
  };

  const handleUpIndex = () => {
    index + 1 >= questions.length ? (index = 0) : (index += 1);
    console.log(index);
    setQuestionAnimationClass("question-fade");
    setActiveQuestion(questions[index]);
  };

  const handleDownIndex = () => {
    index - 1 < 0 ? (index = questions.length - 1) : (index -= 1);
    setQuestionAnimationClass("question-two-fade");
    setActiveQuestion(questions[index]);
  };

  useEffect(() => {
    setActiveQuestion(questions[0]);
  }, []);

  useEffect(() => {
    if (finishActive) {
      const newConfigFromResponses = questions.map((quest) => {
        const questForConfig = {
          key: quest.question,
          value: quest.value,
        };
        return questForConfig;
      });

      setConfig(newConfigFromResponses);
    }
  }, [finishActive]);

  return (
    <div className="Main" ref={QuestionParentRef}>
      <TransitionGroup component={null}>
        {heroActive && (
          <CSSTransition
            in={heroActive}
            appear={true}
            timeout={700}
            classNames="hero-fade"
            onEntered={() =>
              HeroRef.current.addEventListener("keydown", handleKeyDown)
            }
          >
            <Hero onClick={handleStartButton} ref={HeroRef} />
          </CSSTransition>
        )}

        {questionsActive && (
          <CSSTransition
            in={questionsActive}
            timeout={2000}
            classNames={questionAnimationClass}
            key={uuid()}
            // onEntered={() =>
            //   HeroRef.current.addEventListener("keydown", handleKeyDown)
            // }
          >
            <Question
              upIndex={handleUpIndex}
              dataProp={activeQuestion}
              changeData={setActiveQuestion}
              alldata={questions}
              changeAllData={setQuestions}
              parentRef={QuestionParentRef}
              responded={respondedInputs}
              finishOnClick={handleFinishButton}
            />
          </CSSTransition>
        )}

        {questionsActive && (
          <CSSTransition
            in={questionsActive}
            timeout={3400}
            classNames="footer-fade"
            // onEntered={() =>
            //   HeroRef.current.addEventListener("keydown", handleKeyDown)
            // }
          >
            <QuestionsPopup
              upIndex={handleUpIndex}
              downIndex={handleDownIndex}
              questions={questions}
              index={respondedInputs}
            />
          </CSSTransition>
        )}

        {finishActive && (
          <CSSTransition
            in={finishActive}
            timeout={700}
            classNames="hero-fade"
            // onEntered={() =>
            //   HeroRef.current.addEventListener("keydown", handleKeyDown)
            // }
          >
            <Finish configJSON={JSON.stringify(config)} config={"!config load 3L9v9dkQL5"} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Main;
