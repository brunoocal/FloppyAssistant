import Right from "../static/images/right.svg";
import RoleInput from "@components/RoleInput";
import { useEffect } from "react";
import { toast } from "react-toastify";

const RolePermissions = ({ passToFinishModule }) => {
  useEffect(() => {
    const id = setTimeout(
      () =>
        toast.info(
          "Si necesitas más espacios para permisos, configuralo manualmente.",
          {
            position: "bottom-right",
            autoClose: 4500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        ),
      350
    );

    return () => clearTimeout(id);
  }, []);

  const handleNext = () => {
    const items = document.querySelectorAll(".RoleInput");
    const arrayOfItemValues = [];
    let objToStore = {};

    [...items].forEach((item) => {
      const inputs = item.querySelectorAll("input");
      let values = [];

      [...inputs].forEach((input) => {
        values.push(input.value);
      });

      objToStore = {
        key: values[0],
        value: values[1],
      };

      arrayOfItemValues.push(objToStore);
    });

    localStorage.setItem("rolePermissions", JSON.stringify(arrayOfItemValues));
    passToFinishModule()
  };

  return (
    <>
      <div className="RolePermissions">
        <div className="question permissionQuestion">
          <div className="question-container permissionQuestion">
            <div className="question-content permissionQuestion">
              <div className="question-headers parentQuestion permissionQuestion">
                <div className="question-index parentQuestion permissionQuestion">
                  <p>10</p>
                  <img src={Right} alt="Right Arrow" />
                </div>

                <h2>Indica los permisos para los comandos de Floppy</h2>
              </div>
            </div>
          </div>

          <div className="role-flex">
            <div className="heading">
              <div className="fifty">
                <p>ID (rol o user)</p>
              </div>
              <div className="fifty">
                <p>PERMISO</p>
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <RoleInput />
            ))}
          </div>

          <button type="button" onClick={handleNext}>
            Continuar
          </button>
        </div>
      </div>
    </>
  );
};

export default RolePermissions;