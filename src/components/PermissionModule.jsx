import React, { useState, useEffect } from "react";
import Down from "../static/images/down-recortada.png";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PermissionCommand from "@components/PermissionCommand";

const PermissionModule = ({
  style,
  activeModule,
  activeCommand,
  data,
  events,
  getStates,
  lastChild,
}) => {
  const [activated, setActivated] = useState(false);
  const [moduleActive, setActiveModule] = useState(activeModule);

  useEffect(() => {
    if (activated) {
      const index = getStates.modules().indexOf(data);
      events.changeActiveModule(index);
    }
  }, [activated]);

  useEffect(() => setActiveModule(activeModule));

  useEffect(() => {
    if (moduleActive.title !== data.title) {
      setActivated(false);
    }
  }, [moduleActive]);

  return (
    <>
      <div
        className={`item ${lastChild ? "last-child" : ""}`}
        style={style}
        onClick={() => setActivated(!activated)}
      >
        {moduleActive.title === data.title ? (
          <img src={Down} alt="Left Arrow" />
        ) : (
          ""
        )}
        <h1>{data.title}</h1>
      </div>

      {data.commands.map((command) => {
        const index = data.commands.indexOf(command);
        const lastIndex = data.commands.length - 1;
        const subStyle = {
          animation: `fade-in-right 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) ${
            200 * index
          }ms forwards`,
          transition: `all ${200 * index}ms ease 0s`,
        };
        const exitStyle = {
          animation: `fade-out-right 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) ${
            200 * (lastIndex - index)
          }ms forwards`,
          transition: `all ${200 * lastIndex - index}ms ease 0s`,
        };

        return (
          <>
            <CSSTransition
              in={activated}
              onExit={() => console.log("exit")}
              classNames={"subitem-anim"}
              timeout={
                activated ? 200 * (index + 1) : 200 * (lastIndex - (index - 1))
              }
            >
              <PermissionCommand
                command={command}
                activeCommand={activeCommand}
                index={index}
                events={{changeActiveCommand: events.changeActiveCommand}}
                subStyle={activated ? subStyle : exitStyle}
              ></PermissionCommand>
            </CSSTransition>
          </>
        );
      })}
    </>
  );
};

export default PermissionModule;
