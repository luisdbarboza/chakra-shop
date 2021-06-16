import { useState } from "react";

const useForm = (initialValue) => {
  const [values, setValues] = useState(initialValue);

  return [
    values,
    (e, reset) => {
      const { name, value } = e.target;

      if (reset) {
        setValues({
          [name]: "",
        });
      }

      setValues({
        ...values,
        [name]: value,
      });
    },
  ];
};

export default useForm;
