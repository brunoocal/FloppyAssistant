import React, { useEffect, useRef, useState } from "react";
import Right from "../static/images/right.svg";
import PermissionModule from "@components/PermissionModule";

const PermissionsModules = ({ events }) => {
  const [modules, setModules] = useState([
    {
      title: "Moderación",
      commands: [
        { title: "Avisar", path: "aviso", response: "" },
        { title: "TempMute", path: "tempmute", response: "" },
        { title: "Mute", path: "mute", response: "" },
        { title: "Kick", path: "kick", response: "" },
        { title: "TempBan", path: "tempban", response: "" },
        { title: "Ban", path: "ban", response: "" },
      ],
    },
    {
      title: "Utilidades",
      commands: [
        { title: "Config", path: "config", response: "" },
        { title: "Massrole", path: "massrole", response: "" },
        { title: "Serverinfo", path: "serverinfo", response: "" },
        { title: "Sugerencia", path: "sugerencia", response: "" },
        { title: "Userinfo", path: "userinfo", response: "" },
      ],
    },
    {
      title: "Música",
      commands: [
        { title: "Play", path: "play", response: "" },
        { title: "Skip", path: "skip", response: "" },
      ],
    },
  ]);

  const [activeModule, setActiveModule] = useState({});
  const [activeCommand, setActiveCommand] = useState({});
  const [inputFocusClassName, setInputClassName] = useState("");
  const InputRef = useRef(null);

  const handleClass = (e) => {
    if (e.target.value.length > 0) {
      setInputClassName("active");
    } else {
      setInputClassName("");
    }
  };

  const getModules = () => {
    return modules;
  };

  useEffect(() => {
    setActiveModule(modules[0]);
  }, []);

  const handleSetData = (e) => {
    const newModulesData = modules.map((module, i) => {
      if (activeModule.title === module.title) {
        const newCommandsArr = module.commands.map((command, i) => {
          if (command.title === activeCommand.title) {
            return { ...command, response: e.target.value };
          }
          return command;
        });
        return { ...module, commands: newCommandsArr };
      }
      return module;
    });

    setModules(newModulesData);
  };

  const handleChangeModule = (index) => {
    setActiveModule(modules[index]);
  };

  const makePermissionsConfig = () => {
    let allCommands = [];
    modules.map((module) => {
      module.commands.map((command) => {
        allCommands = [...allCommands, command];
      });
    });

    return allCommands;
  };

  const handleFinish = () => {
    console.log("finish");
    const config = makePermissionsConfig();
    events.changeData(config);
    events.finish();
  };

  const handleChangeCommand = (index) => {
    if (Boolean(activeModule.commands[index])) {
      setActiveCommand(activeModule.commands[index]);
    }
  };

  useEffect(() => {
    if (Boolean(activeModule.commands)) {
      setActiveCommand(activeModule.commands[0]);
    }
  }, [activeModule]);

  useEffect(() => {
    if (Boolean(modules)) {
      if (Boolean(activeModule.commands)) {
        if (Boolean(activeCommand.title)) {
          const activeModuleFromSearch =
            modules[
              modules.indexOf(
                modules.find((module) => module.title === activeModule.title)
              )
            ];

          const activeCommandFromSearch =
            activeModuleFromSearch.commands[
              activeModuleFromSearch.commands.indexOf(
                activeModuleFromSearch.commands.find(
                  (command) => command.title === activeCommand.title
                )
              )
            ];
          setActiveCommand(activeCommandFromSearch);
        }
      }
    }
  }, [modules, activeCommand]);

  useEffect(() => {
    if (Boolean(activeCommand.title)) {
      if (Boolean(InputRef.current)) {
        if (InputRef.current.value.length > 0) {
          setInputClassName("active");
        } else {
          setInputClassName("");
        }
      }
    }
  }, [activeCommand]);

  return (
    <>
      <div className="PermissionsModule">
        <div className="question permissionQuestion">
          <div className="question-container permissionQuestion">
            <div className="question-content permissionQuestion">
              <div className="question-headers parentQuestion permissionQuestion">
                <div className="question-index parentQuestion permissionQuestion">
                  <p>{1}</p>
                  <img src={Right} alt="Right Arrow" />
                </div>

                <h2>Indica los permisos para los comandos de Floppy</h2>
              </div>
            </div>
          </div>

          <div className="permission-dropdown-container">
            <div className="content">
              <div className="dropdownContainer">
                <div className="dropdown">
                  <div className="title">
                    <h1>Comandos</h1>
                  </div>
                  <div className="content">
                    {modules.map((module, i) => {
                      const style = {
                        animation: `fade-in-right 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) ${
                          250 * i + 550
                        }ms forwards`,
                      };
                      return (
                        <PermissionModule
                          key={i}
                          lastChild={
                            module.title === modules[modules.length - 1].title
                              ? true
                              : false
                          }
                          style={style}
                          activeModule={activeModule}
                          activeCommand={activeCommand}
                          data={module}
                          events={{
                            changeActiveModule: handleChangeModule,
                            changeActiveCommand: handleChangeCommand,
                          }}
                          getStates={{ modules: getModules }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="questionSide">
                <h1>Indica el permiso para {activeCommand.title}</h1>

                <input
                  className={inputFocusClassName}
                  ref={InputRef}
                  placeholder={"Escribe aquí tu respuesta..."}
                  onChange={async (e) => {
                    await handleSetData(e);

                    handleClass(e);
                  }}
                  value={activeCommand.response}
                  type="text"
                />

                <div className="button-continue">
                  <button onClick={handleFinish}>Finalizar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionsModules;
