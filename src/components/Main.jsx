import React, { useState, useEffect, useRef } from "react";

import "@styles/Main.scss";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import { v4 as uuid } from "uuid";
import Hero from "@components/Hero";
import Finish from "@components/Finish";
import Module from "@components/Module";
import PermissionsModules from "@components/PermissionsModules";
import RolePermissions from "@components/RolePermissions";

const Main = () => {
  const [isHeroActive, setHeroActive] = useState(true);
  const [isModulesActive, setModulesActive] = useState(false);
  const [isPermissionsActive, setPermissions] = useState(false);
  const [isRolePermissonsActive, setRolesActive] = useState(false);
  const [isFinishActive, setfinishActive] = useState(false);
  const [permissionData, setPermissionData] = useState([]);

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
      path: "servidor",
      questions: [
        {
          question: "¿Que prefijo quieres usar con Floppy?",
          example: "!",
          configPath: "prefijo",
          response: "",
          required: true,
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el modulo de bienvenidas?",
      parentQuestionResponse: false,
      path: "bienvenidas",
      questions: [
        {
          question: "Indica la ID del rol a dar para los nuevos usuarios.",
          example: "817998485076967465",
          configPath: "joinrole",
          response: "",
        },
        {
          question: "Indica la ID del canal para el mensaje de bienvenida",
          example: "818305326511816745",
          configPath: "canal",
          tag: "mensaje-bienvenida",
          response: "",
        },
        {
          question: "Indica el mensaje de bienvenida que quieres utilizar",
          example: "{user}, gracias a tí, ¡ahora somos {memberCount} miembros!",
          configPath: "mensaje",
          tag: "mensaje-bienvenida",
          response: "",
        },
        {
          question:
            "Indica el mensaje que enviará el bot al MD de los nuevos usuarios",
          example:
            "¡Bienvenido {user} a {server}! Esperamos que disfrutes de tu estancia.",
          configPath: "md",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de las despedidas?",
      parentQuestionResponse: false,
      path: "despedidas",
      questions: [
        {
          question: "Indica la ID del canal para el mensaje de despedida",
          example: "818305326511816745",
          configPath: "canal",
          response: "",
        },
        {
          question: "Indica el mensaje de despedida que quieres utilizar",
          example: "¡Chau! {user} ha salido del servidor",
          configPath: "mensaje",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de sugerencias?",
      parentQuestionResponse: false,
      path: "sugerencias",
      questions: [
        {
          question: "Indica la ID del canal donde se enviarán las sugerencias",
          example: "818305949176823819",
          configPath: "canal",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de moderación?",
      parentQuestionResponse: false,
      path: "moderacion",
      questions: [
        {
          question: "¿Cuál es la ID del rol para los usuarios muteados?",
          example: "817998432542261278",
          configPath: "rol_muteado",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para los avisos.",
          example:
            "{moderador} te ha avisado por `{motivo}`. Recuerda leer las reglas del servidor.",
          configPath: "mensajes.avisar",
          response: "",
        },
        {
          question:
            "Indica el mensaje de notificación para los muteos temporales.",
          example: "{moderador} te ha muteado por `{motivo}` durante {time}.",
          configPath: "mensajes.tempmute",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para los muteos.",
          example: "{moderador} te ha muteado por `{motivo}`.",
          configPath: "mensajes.mute",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para las expulsiones.",
          example: "{moderador} te ha expulsado por `{motivo}`.",
          configPath: "mensajes.expulsar",
          response: "",
        },
        {
          question:
            "Indica el mensaje de notificación para los baneos temporales.",
          example: "{moderador} te ha baneado por `{motivo}` durante {time}.",
          configPath: "mensajes.tempban",
          response: "",
        },
        {
          question: "Indica el mensaje de notificación para los baneos.",
          example: "{moderador} te ha baneado por `{motivo}`.",
          configPath: "mensajes.ban",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el modulo de auto-moderación?",
      parentQuestionResponse: false,
      path: "automod",
      questions: [
        {
          question: "¿Quieres bloquear las invites de tu servidor?",
          example: "SI / NO",
          buttons: true,
          configPath: "invites.activado",
          response: "",
        },
        {
          question: "¿Quieres bloquear los links de tu servidor?",
          example: "SI / NO",
          buttons: true,
          configPath: "links.activado",
          response: "",
        },
        {
          question: "¿Quieres bloquear el envio masivo de emoticonos?",
          example: "SI / NO",
          buttons: true,
          configPath: "mass_emoji.activado",
          tag: "mass-emoji",
          response: "",
        },
        {
          question:
            "Indica el número mínimo de emoticonos por mensaje que quieres que sea bloqueado.",
          example: "8",
          tag: "mass-emoji",
          configPath: "mass_mentions.limite",
          response: "",
        },
        {
          question:
            "¿Quieres bloquear el envio masivo de menciones a usuarios/canales/roles?",
          example: "SI / NO",
          buttons: true,
          tag: "mass-mentions",
          configPath: "block_words.activado",
          response: "",
        },
        {
          question:
            "Indica el número mínimo de menciones por mensaje que quieres que sea bloqueado.",
          example: "5",
          tag: "mass-mentions",
          configPath: "block_words.limite",
          response: "",
        },
        {
          question:
            "¿Quieres activar el bloqueo de la mayoría de palabras malsonantes?",
          example: "SI / NO",
          buttons: true,
          configPath: "block_words.utilizarbase",
          response: "",
        },
        {
          question:
            "En el caso de querer bloquear alguna palabra en específico, ¿cuáles quieres bloquear?",
          example:
            "Para indicar más de una palabra, separa cada palabra de una coma.",
          configPath: "block_words.custom",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el módulo de logs?",
      parentQuestionResponse: false,
      path: "logs",
      questions: [
        {
          question: "¿Quieres que los logs salgan como embed?",
          example: "SI / NO",
          buttons: true,
          configPath: "embed",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para los mensajes editados?",
          example: "755183135674859581",
          configPath: "canal.editados",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para los mensajes eliminados?",
          example: "755183135674859581",
          configPath: "canal.eliminados",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para las sanciones?",
          example: "755183135674859581",
          configPath: "canal.sanciones",
          response: "",
        },
        {
          question:
            "¿Cuál es la ID del canal para las entradas de nuevos miembros?",
          example: "755183135674859581",
          configPath: "canal.entradas",
          response: "",
        },
        {
          question:
            "¿Cuál es la ID del canal para los miembros que salen del servidor?",
          example: "755183135674859581",
          configPath: "canal.salidas",
          response: "",
        },
        {
          question: "¿Cuál es la ID del canal para los canales de voz?",
          example: "755183135674859581",
          configPath: "canal.voz",
          response: "",
        },
        {
          question:
            "¿Cuál es la ID del canal para el sistema de auto-moderación?",
          example: "755183135674859581",
          configPath: "canal.automod",
          response: "",
        },
      ],
    },
    {
      parentQuestion: "¿Quieres activar el modulo de música?",
      parentQuestionResponse: false,
      path: "musica",
      questions: [
        {
          question: "Indica la Key de la API de YouTube.",
          example: "1234-1234-1234-1234-1234",
          configPath: "youtube_key",
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
    setRolesActive(false);
    setfinishActive(true);
  };

  const handleRolesModuleButton = () => {
    setPermissions(false);
    setRolesActive(true);
  };

  const changePermissionData = (value) => setPermissionData(value); //Changeable

  const handleFinishModulesPassToPermissions = () => {
    setModulesActive(false);
    setPermissions(true);
  };

  const handleStartButton = () => {
    setHeroActive(false);
    setModulesActive(true);
  };

  const getAndSetDataFromLocalStorageToModules = (moduleData) => {
    const moduleDataFromLS = JSON.parse(localStorage.getItem(moduleData.path));

    const newModuleList = moduleList.map((module) => {
      if (module.parentQuestion === moduleDataFromLS.parentQuestion) {
        return moduleDataFromLS;
      }
      return module;
    });

    setModules(newModuleList);
    localStorage.setItem("modules", JSON.stringify(newModuleList));
  };

  //WORKING ARRIBA

  const handleSetDataFromModule = (moduleData) => {
    //SEND DATA METHOD
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
    localStorage.clear();
    localStorage.setItem("modules", JSON.stringify(moduleList));

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
              parentindex={moduleIndex}
              events={{
                upIndex: handleUpIndex,
                downIndex: handleDownIndex,
                sendData: handleSetDataFromModule,
                setDataOnMain: getAndSetDataFromLocalStorageToModules,
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
          <PermissionsModules
            parentindex={moduleIndex}
            events={{
              finish: handleRolesModuleButton,
              changeData: changePermissionData,
            }}
          />
        </CSSTransition>
      )}

      {isRolePermissonsActive && (
        <CSSTransition
          in={isRolePermissonsActive}
          appear={true}
          timeout={700}
          classNames="permissions-fade"
        >
          <RolePermissions passToFinishModule={handleFinishButton} />
        </CSSTransition>
      )}

      {isFinishActive && (
        <CSSTransition
          in={isFinishActive}
          appear={true}
          timeout={700}
          classNames="permissions-fade"
        >
          <Finish permissionsData={permissionData} questionsData={moduleList} />
        </CSSTransition>
      )}
    </div>
  );
};

export default Main;
