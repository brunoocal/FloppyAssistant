import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import banner from "../static/images/banner.png";

const Finish = React.memo(({ permissionsData, questionsData }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

    if (Boolean(localStorage.getItem("musica"))) {
      let objectToInsert = JSON.parse(localStorage.getItem("musica"));

      initialConfig = {
        ...initialConfig,
        musica: objectToInsert,
      };
    }

    permissionsData.map((permission) => {
      let objectToInsert = {
        [permission.path]: {
          permiso: permission.response,
        },
      };
      initialConfig = {
        ...initialConfig,
        comandos: {
          ...initialConfig.comandos,
          ...objectToInsert,
        },
      };
    });


    sendData(initialConfig);
  };

  const sendData = (data) => {
    fetch("https://api.floppy.red/config/create", {
      method: "post",
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setConfig(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    createConfig();
  }, []);

  const copyText = () => {
    navigator.clipboard.writeText(config.command);
    setCopied(true);
  };

  return (
    <div className="hero" tabIndex="0">
      <div className="container">
        <img src={banner} alt="" />
        <h1>Asistente de configuración para Floppy</h1>
        <h2>
          Utiliza el siguiente comando en tu servidor luego de añadir a{" "}
          <a href="https://www.floppy.red">Floppy</a> para cargar la
          configuración que haz configurado en esta página. Click en el comando
          para copiarlo.
        </h2>
        <p
          onClick={() => {
            copyText();
          }}
        >
          {loading ? "Cargando..." : config.command}
        </p>
        {copied && (
          <CSSTransition
            in={copied}
            appear={true}
            timeout={400}
            classNames={"finish-copy"}
          >
            <h2>¡Copiado al portapapeles!</h2>
          </CSSTransition>
        )}
        <div className="button-container finish">
          <button onClick={() => (window.location = window.location)}>
            Re-enviar
          </button>
        </div>
      </div>
    </div>
  );
});

export default Finish;
