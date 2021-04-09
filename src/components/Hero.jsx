import React from "react";
import banner from "../static/images/banner.png";

const Hero = React.forwardRef((props, ref) => {
  const onClick = props.onClick;
  return (
    <div className="hero" ref={ref} tabIndex="0">
      <div className="container">
        <img src={banner} alt="" />
        <h1>Asistente de configuración para Floppy</h1>
        <h2>
          Bienvenido al asistente de configuración de Floppy, aquí podrás
          configurar mediante preguntas los módulos de floppy, además de sus
          permisos.
        </h2>
        <div className="button-container">
          <button onClick={onClick}>Comenzar</button>
          <p>
            pulsa <strong>Enter ↵</strong>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Hero;
