import React from "react";

const Finish = ({ config, configJSON }) => {
  return (
    <div className="hero" tabIndex="0">
      <div className="container">
        <img
          src="https://images.typeform.com/images/r8whbVmTbbEq/image/default"
          alt=""
        />
        <h1>Asistente de configuración para Floppy</h1>
        <h2>
          Utiliza el siguiente comando en tu servidor luego de añadir a{" "}
          <a href="https://www.floppy.red">Floppy</a> para cargar la
          configuración que haz configurado en esta página
        </h2>
        <p>{config}</p>
        {console.log(configJSON)}
        <div className="button-container">
          <button onClick={window.location.reload}>Re-enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Finish;
