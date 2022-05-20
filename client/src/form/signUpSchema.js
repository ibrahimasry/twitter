import * as Yup from "yup";

import signUpModel from "./signUpModel";

const {
  formField: { name, username, password, code, email, year, month, day },
} = signUpModel;

const schema = [
  Yup.object().shape({
    [name.name]: Yup.string().required(`${name.requiredErrorMsg}`),
    [email.name]: Yup.string()
      .email()
      .required(`${email.requiredErrorMsg}`),
    [password.name]: Yup.string().required("password is requires"),
    [year.name]: Yup.string(),
    [month.name]: Yup.string(),
    [day.name]: Yup.string(),
  }),
  Yup.object().shape({
    [code.name]: Yup.number().required(`${code.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [username.name]: Yup.string().required(`${username.requiredErrorMsg}`),
  }),
];

export default schema;
