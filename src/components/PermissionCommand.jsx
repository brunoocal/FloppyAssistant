import React, { useEffect, useRef } from "react";
import Down from "../static/images/down-recortada.png";

const PermissionCommand = ({
  activeCommand,
  command,
  subStyle,
  index,
  events,
}) => {
  const thisRef = useRef(null);

  useEffect(() => {
    if (Boolean(thisRef.current)) {
      if (!thisRef.current.className.includes("subitem-anim")) {
        thisRef.current.style.height = "0";
        thisRef.current.style.opacity = "0";
      }
    }
  }, []);

  return (
    <div
      className="item subitem"
      ref={thisRef}
      style={subStyle}
      onClick={() => events.changeActiveCommand(index)}
    >
      {activeCommand.title === command.title ? (
        <img src={Down} alt="Left Arrow" />
      ) : (
        ""
      )}
      <h1>{command.title}</h1>
    </div>
  );
};

export default PermissionCommand;
