import { useState } from "react";

function useForm() {
  const [values, setValues] = useState();
  const [touched, setTouched] = useState();
}

export default useForm;