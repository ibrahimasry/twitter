import {Formik, Form} from "formik";
import React from "react";
import {useMutation} from "react-query";
import signInIntialsValues from "../form/signInIntialsValues";

import signInModel from "../form/signInModel";
import signInSchema from "../form/signInSchema";
import {loginRequest} from "../util/api";
import TextInput from "./input";
import Button from "./shared/Button";

const {
  formField: {username, password},
} = signInModel;
export default function SignIn() {
  const {mutate, isError, error} = useMutation("login", loginRequest);
  function _handleSubmit(values, actions) {
    mutate(values, {onError: console.log});
    actions.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={signInIntialsValues}
      validationSchema={signInSchema}
      onSubmit={_handleSubmit}
      id={signInModel.formId}
    >
      {({isSubmitting}) => (
        <Form id={signInModel.formId} className="space-y-2">
          <div className="space-y-2">
            <TextInput name={username.name} label={username.label}></TextInput>
            <TextInput name={password.name} label={password.label}></TextInput>
          </div>
          <div>
            <Button
              className="p-2 py-1"
              id="sign-in"
              disabled={isSubmitting}
              type="submit"
            >
              sign in
            </Button>
          </div>
          {isError && (
            <span className="text-red-400 text-sm">
              {error.response.data.error?.message}
            </span>
          )}
        </Form>
      )}
    </Formik>
  );
}
