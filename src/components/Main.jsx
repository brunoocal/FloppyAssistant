import React, { useState, useEffect, useRef } from "react";

import "@styles/Main.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import QuestionsPopup from "@components/QuestionsPopup";
import { v4 as uuid } from "uuid";
import Hero from "@components/Hero";
import Finish from "@components/Finish";
import Module from "@components/Module";
import PermissionsModules from "@components/PermissionsModules";

const Main = () => {
  const [isHeroActive, setHeroActive] = useState(true);
  const [isModulesActive, setModulesActive] = useState(false);
  const [isPermissionsActive, setPermissions] = useState(false);
  const [isFinishActive, setfinishActive] = useState(false);

  //-----------------------------------------
  // ARRIBA: RENDER COMPONENTS TRIGGERS
  //-----------------------------------------

  //-----------------------------------------
  //            MODULE LIST
  //-----------------------------------------

  const [moduleList, setModules] = useState([
    {
      parentQuestion: "Es necesario configurar el módulo del servidor",
      required: true,
      parentQuestionResponse: false,
      questions: [
        {
          question: "¿Que prefijo quieres usar con Floppy?",
          example: "!",
          configPath: "servidor.prefijo",
          response: "",
        },
      ],
    },
  ]);

  const [activeModule, setActiveModule] = useState({});

  let moduleIndex = moduleList.indexOf(
    moduleList.find(
      (module) => module.parentQuestion === activeModule.parentQuestion
    )
  );

  const HeroRef = useRef(null);
  const QuestionParentRef = useRef(null);

  //-----------------------------------------
  //        HANDLE BUTTON EVENTS
  //-----------------------------------------

  const handleFinishButton = () => {
    setModulesActive(false);
    setfinishActive(true);
  };

  const handleFinishModulesPassToPermissions = () => {
    setModulesActive(false);
    setPermissions(true);
  };

  const handleStartButton = () => {
    setHeroActive(false);
    setModulesActive(true);
  };

  const handleSetDataFromModule = (moduleData) => {
    console.log("XD");
    console.log(moduleData);
    const newModuleList = moduleList.map((module) => {
      if (module.parentQuestion === moduleData.parentQuestion) {
        return moduleData;
      }
      return module;
    });

    setModules(newModuleList);
  };

  const handleUpIndex = () => {
    moduleIndex + 1 >= moduleList.length
      ? handleFinishModulesPassToPermissions()
      : (moduleIndex += 1);
    console.log(moduleIndex);
    setActiveModule(moduleList[moduleIndex]);
  };

  //NO USADO ACTUALMENTE
  const handleDownIndex = () => {
    moduleIndex - 1 < 0
      ? (moduleIndex = moduleList.length - 1)
      : (moduleIndex -= 1);
    setActiveModule(moduleList[moduleIndex]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleStartButton();
      HeroRef.current.removeEventListener("keydown", handleKeyDown);
    }
  };

  //-----------------------------------------
  //        USE EFFECTS
  //-----------------------------------------

  useEffect(() => {
    setActiveModule(moduleList[0]);
  }, []);

  //-----------------------------------------
  //        CLOSE USE EFFECTS
  //-----------------------------------------

  return (
    <div className="Main" ref={QuestionParentRef}>
      {isHeroActive && (
        <CSSTransition
          in={isHeroActive}
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

      {isModulesActive && (
        <TransitionGroup component={null}>
          <CSSTransition
            in={isModulesActive}
            timeout={700}
            classNames={"module-fade"}
            key={uuid()}
          >
            <Module
              data={activeModule}
              events={{
                upIndex: handleUpIndex,
                downIndex: handleDownIndex,
                sendData: handleSetDataFromModule,
              }}
            />
          </CSSTransition>
        </TransitionGroup>
      )}

      {isPermissionsActive && (
        <CSSTransition
          in={isPermissionsActive}
          appear={true}
          timeout={700}
          classNames="permissions-fade"
        >
          <PermissionsModules />
        </CSSTransition>
      )}

      {isFinishActive && (
        <CSSTransition
          in={isFinishActive}
          timeout={700}
          classNames="finish-fade"
        >
          <Finish configJSON={"Hola"} config={"!config load 3L9v9dkQL5"} />
        </CSSTransition>
      )}
    </div>
  );
};

export default Main;
