import Main from "@components/Main";
import { Helmet } from "react-helmet";
import Floppy from "./static/images/floppy.png";
const App = () => {
  return (
    <>
      <Helmet>

        <title>Asistente - Floppy</title>
        <meta
          name="description"
          content={
            "Aquí encontraras el asistente de configuración para floppy, donde podrás configurar todos sus módulos y permisos de una forma muy sencilla a través de preguntas"
          }
        />
        <meta name="image" content={"https://floppy.red/floppy.png"} />
        <meta name="robots" content="follow" />
        <link rel="icon" type="image/png" href={Floppy} sizes="16x16" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Asistente de configuración de Floppy"
        />
        <meta property="og:url" content="http://www.floppy.red" />
        <meta
          property="og:description"
          content="En el asistente de configuración para Floppy podrás configurar todos sus módulos y permisos de una forma sencilla e intuitiva a través de preguntas."
        />
        <meta property="og:image" content="https://www.floppy.red/floppy.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@discordfloppy" />
        <meta name="twitter:creator" content="@brunoo_cal" />
        <meta
          name="twitter:title"
          content="Asistente de configuración para Floppy"
        />
        <meta
          name="twitter:description"
          content="En el asistente de configuración para Floppy podrás configurar todos sus módulos y permisos de una forma sencilla e intuitiva a través de preguntas."
        />
        <meta name="twitter:image" content="https://www.floppy.red/floppy.png" />
      </Helmet>
      <Main></Main>
    </>
  );
};

export default App;
