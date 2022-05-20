import * as Yup from "yup";

import signInModel from "./signInModel";

const {
  formField: {username, password},
} = signInModel;

const signInSchema = Yup.object().shape({
  [username.name]: Yup.string().required(`${username.requiredErrorMsg}`),
  [password.name]: Yup.string().required(`${password.requiredErrorMsg}`),
});

export default signInSchema;
