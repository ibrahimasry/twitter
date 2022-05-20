import signUpModel from "./signUpModel";

const {
  formField: {name, username, password, code, email, year, month, day},
} = signUpModel;

export default {
  [name.name]: "",
  [password.name]: "",
  [username.name]: "",
  [email.name]: "",
  [code.name]: "",
  [year.name]: "2000",
  [month.name]: "11",
  [day.name]: "01",
};
