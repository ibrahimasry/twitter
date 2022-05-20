import signInModel from "./signInModel";

const {
  formField: {username, password},
} = signInModel;

export default {
  [password.name]: "",
  [username.name]: "",
};
