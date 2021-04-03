import React, { useState, useEffect, useRef } from "react";

import "@styles/Main.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import QuestionsPopup from "@components/QuestionsPopup";
import { v4 as uuid } from "uuid";
import Hero from "@components/Hero";
import Finish from "@components/Finish";
import Module from "@components/Module";

const Main = () => {
  const [isHeroActive, setHeroActive] = useState(true);
  const [isModulesActive, setModulesActive] = useState(false);
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
    {
      parentQuestion: "¿Quieres activar el modulo de bienvenidas?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "Indica la ID del rol a dar para los nuevos usuarios.",
          example: "817998485076967465",
          configPath: "bienvenidas.joinrole",
          response: "",
        },
        {
          question: "Indica la ID del canal para el mensaje de bienvenida",
          example: "818305326511816745",
          configPath: "bienvenidas.canal",
          response: "",
        },
        {
          question: "Indica el mensaje de bienvenida que quieres utilizar",
          example: "{user}, gracias a tí, ¡ahora somos {memberCount} miembros!",
          configPath: "bienvenidas.mensaje",
          response: "",
        },
        {
          question:
            "Indica el mensaje que enviará el bot al MD de los nuevos usuarios",
          example:
            "¡Bienvenido {user} a {server}! Esperamos que disfrutes de tu estancia.",
          configPath: "bienvenidas.md",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de las despedidas?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "Indica la ID del canal para el mensaje de despedida",
          example: "818305326511816745",
          configPath: "despedidas.canal",
          response: "",
        },
        {
          question: "Indica el mensaje de despedida que quieres utilizar",
          example: "¡Chau! {user} ha salido del servidor",
          configPath: "despedidas.mensaje",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de sugerencias?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "Indica la ID del canal donde se enviarán las sugerencias",
          example: "818305949176823819",
          configPath: "sugerencias.canal",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de moderación?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "¿Cuál es la ID del rol para los usuarios muteados?",
          example: "817998432542261278",
          configPath: "moderacion.rol_muteado",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para los avisos.",
          example:
            "{moderador} te ha avisado por `{motivo}`. Recuerda leer las reglas del servidor.",
          configPath: "moderacion.mensajes.avisar",
          response: "",
        },
        {
          question:
            "Indica el mensaje de notificación para los muteos temporales.",
          example: "{moderador} te ha muteado por `{motivo}` durante {time}.",
          configPath: "moderacion.mensajes.tempmute",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para los muteos.",
          example: "{moderador} te ha muteado por `{motivo}`.",
          configPath: "moderacion.mensajes.mute",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para las expulsiones.",
          example: "{moderador} te ha expulsado por `{motivo}`.",
          configPath: "moderacion.mensajes.expulsar",
          response: "",
        },
        {
          question:
            "Indica el mensaje de notificación para los baneos temporales.",
          example: "{moderador} te ha baneado por `{motivo}` durante {time}.",
          configPath: "moderacion.mensajes.tempban",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para los baneos.",
          example: "{moderador} te ha baneado por `{motivo}`.",
          configPath: "moderacion.mensajes.ban",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el modulo de auto-moderación?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "¿Quieres bloquear las invites de tu servidor?",
          example: "SI / NO",
          buttons: true,
          configPath: "automod.invites.activado",
          response: "",
        },
        {
          question: "¿Quieres bloquear los links de tu servidor?",
          example: "SI / NO",
          buttons: true,
          configPath: "automod.links.activado",
          response: "",
        },
        {
          question: "¿Quieres bloquear el envio masivo de emoticonos?",
          example: "SI / NO",
          buttons: true,
          configPath: "automod.mass_emoji.activado",
          response: "",
        },
        {
          question:
            "Indica el número mínimo de emoticonos por mensaje que quieres que sea bloqueado.",
          example: "8",
          configPath: "automod.mass_mentions.limite",
          response: "",
        },
        {
          question:
            "¿Quieres bloquear el envio masivo de menciones a usuarios/canales/roles?",
          example: "SI / NO",
          buttons: true,
          configPath: "automod.block_words.activado",
          response: "",
        },
        {
          question:
            "Indica el número mínimo de menciones por mensaje que quieres que sea bloqueado.",
          example: "5",
          configPath: "automod.block_words.limite",
          response: "",
        },
        {
          question:
            "¿Quieres activar el bloqueo de la mayoría de palabras malsonantes?",
          example: "SI / NO",
          buttons: true,
          configPath: "automod.block_words.activado",
          response: "",
        },
        {
          question:
            "En el caso de querer bloquear alguna palabra en específico, ¿cuáles quieres bloquear?",
          example:
            "Para indicar más de una palabra, separa cada palabra de una coma.",
          configPath: "automod.block_words.custom",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de logs?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "¿Quieres que los logs salgan como embed?",
          example: "SI / NO",
          buttons: true,
          configPath: "logs.canal.editados",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para los mensajes editados?",
          example: "755183135674859581",
          configPath: "logs.canal.editados",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para los mensajes eliminados?",
          example: "755183135674859581",
          configPath: "logs.canal.eliminados",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para las sanciones?",
          example: "755183135674859581",
          configPath: "logs.canal.sanciones",
          response: "",
        },
        {
          question:
            "¿Cuál es la ID del canal para las entradas de nuevos miembros?",
          example: "755183135674859581",
          configPath: "logs.canal.entradas",
          response: "",
        },
        {
          question:
            "¿Cuál es la ID del canal para los miembros que salen del servidor?",
          example: "755183135674859581",
          configPath: "logs.canal.salidas",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para los canales de voz?",
          example: "755183135674859581",
          configPath: "logs.canal.voz",
          response: "",
        },
        {
          question:
            "¿Cuál es la ID del canal para el sistema de auto-moderación?",
          example: "755183135674859581",
          configPath: "logs.canal.automod",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el modulo de música?",
      parentQuestionResponse: false,
      questions: [
        {
          question: "Indica la Key de la API de YouTube.",
          example: "1234-1234-1234-1234-1234",
          configPath: "sugerencias.canal",
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
      ? handleFinishButton()
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
