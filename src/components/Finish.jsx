import React, { useEffect } from "react";

const Finish = React.memo(({ permissionsData, questionsData }) => {
  console.log(permissionsData, questionsData);

  const createConfig = () => {
    let initialConfig = {
      servidor: {
        prefijo: "!",
      },
      sugerencias: {
        activado: false,
        canal: "",
      },
      bienvenidas: {
        activado: false,
        joinrole: "",
        canal: "",
        mensaje: "",
        md: "",
      },
      despedidas: {
        activado: false,
        canal: "",
        mensaje: "",
      },
      permisos: {
        269852031194234880: 100,
        "817998224489054210": 50,
      },
      comandos: {
        default: {
          permiso: 100,
        },
        config: {
          permiso: 100,
          whitelist: [],
          blacklist: [],
        },
      },
      atajos: {
        msg: "¡Hola!, soy un mensaje programado",
        tm: "!tempmute",
      },
      moderacion: {
        activado: false,
        rol_muteado: "",
        mensajes: {
          avisar: "",
          tempmute: "",
          mute: "",
          expulsar: "",
          tempban: "",
          ban: "",
        },
        avisar_privado: false,
      },
      automod: {
        activado: false,
        invites: {
          activado: true,
          whitelist: [],
        },
        links: {
          activado: true,
          whitelist: [],
        },
        mass_emoji: {
          activado: true,
          limite: 8,
        },
        mass_mentions: {
          activado: true,
          limite: 5,
        },
        block_words: {
          utilizarbase: true,
          custom: [],
        },
      },
      logs: {
        activado: false,
        embed: false,
        canal: {
          editados: "",
          elimiandos: "",
          sanciones: "",
          entradas: "",
          salidas: "",
          voz: "",
          automod: "",
        },
      },
      musica: {
        activado: false,
        youtube_key: "",
      },
    };

    questionsData.map((moduleOfQuestions, i) => {
      let objectToInsert = {
        activado: moduleOfQuestions.parentQuestionResponse,
      };

      moduleOfQuestions.questions.map((question) => {
        if (question.configPath.split(".").length === 1) {
          //NO TIENE SUBOBJETOS
          objectToInsert = {
            ...objectToInsert,
            [question.configPath]: question.response,
          };


        } else if (question.configPath.split(".").length > 1) {
          const pathArray = question.configPath.split(".");
          console.log(pathArray);

          let spreadPathArray0 = {};
          if (Boolean(objectToInsert[pathArray[0]])) {
            spreadPathArray0 = objectToInsert[pathArray[0]];
          }

          if (pathArray[1] === "activado" || pathArray[1] === "utilizarbase") {
            objectToInsert = {
              ...objectToInsert,
              [pathArray[0]]: {
                ...spreadPathArray0,
                [pathArray[1]]: Boolean(question.response),
              },
            };
          } else {
            objectToInsert = {
              ...objectToInsert,
              [pathArray[0]]: {
                ...spreadPathArray0,
                [pathArray[1]]: question.response,
              },
            };
          }
        }
      });

      initialConfig = {
        ...initialConfig,
        [moduleOfQuestions.path]: objectToInsert,
      };
    });

    // permissionsData.map((permission) => {
    //   let objectToInsert = {
    //     [permission.path]: {
    //       permiso: permission.response,
    //     },
    //   };
    //   initialConfig = {
    //     ...initialConfig,
    //     comandos: {
    //       ...initialConfig.comandos,
    //       ...objectToInsert,
    //     },
    //   };
    // });

    console.log(initialConfig);
  };

  useEffect(() => {
    createConfig();
  }, []);

  return (
    <div className="hero" tabIndex="0">
      <div className="container">
        <img
          src="https://images.typeform.com/images/r8whbVmTbbEq/image/default"
          alt=""
        />
        <h1>Asistente de configuración para Floppy</h1>
        <h2>
          Utiliza el siguiente comando en tu servidor luego de añadir a
          <a href="https://www.floppy.red">Floppy</a> para cargar la
          configuración que haz configurado en esta página
        </h2>
        <p>!config XD</p>
        <div className="button-container">
          <button onClick={() => (window.location = window.location)}>
            Re-enviar
          </button>
        </div>
      </div>
    </div>
  );
});

export default Finish;
