import { useState } from "react";

const RoleInput = () => {
  const [inputClassName1, setInputClassName1] = useState("");
  const [inputClassName2, setInputClassName2] = useState("");

  const handleClass1 = (e) => {
    if (e.target.value.length > 0) {
      setInputClassName1("active");
    } else {
      setInputClassName1("");
    }
  };

  const handleClass2 = (e) => {
    if (e.target.value.length > 0) {
      setInputClassName2("active");
    } else {
      setInputClassName2("");
    }
  };

  return (
    <>
      <div className="RoleInput">
        <div className="fifty">
          <input
            className={inputClassName1}
            type="text"
            onChange={handleClass1}
          />
        </div>
        <div className="fifty">
          <input
            className={inputClassName2}
            type="text"
            onChange={handleClass2}
          />
        </div>
      </div>
    </>
  );
};

export default RoleInput;
