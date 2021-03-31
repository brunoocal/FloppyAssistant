import React from "react";

const Hero = React.forwardRef((props, ref) => {
  const onClick = props.onClick;
  return (
    <div className="hero" ref={ref} tabIndex="0">
      <div className="container">
        <img
          src="https://images.typeform.com/images/r8whbVmTbbEq/image/default"
          alt=""
        />
        <h1>Floppy | Programa Beta Tester</h1>
        <h2>
          Bienvenido al Formulario para ser Beta Tester de Floppy y poder
          disfrutar las nuevas novedades antes que nadie.
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
