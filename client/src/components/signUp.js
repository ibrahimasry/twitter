import {Formik, Form} from "formik";
import React from "react";
// forms
import SignUpInfo from "./signUpInfo";
import Verfiy from "./verifyEmail";

import validationSchema from "../form/signUpSchema";
import signUpModel from "../form/signUpModel";
import formInitialValues from "../form/signUpIntialsValues";
import {useMutation} from "react-query";
import {getUsernameRequest, signUpRequest} from "../util/api";
import {verifyRequest} from "../util/api";
import PickUsername from "./pickUsername";
import {ValidationError} from "yup";
import Button from "./shared/Button";

export default function SignUp() {
  const [activeStep, setActiveStep] = React.useState(0);
  const {mutate, error} = useMutation("signup", signUpRequest);
  const {mutate: verfiyMutation, error: verfiyMutationError} = useMutation(
    "verfiy",
    verifyRequest
  );
  const {mutate: getUsername, error: getUsernameError} = useMutation(
    "getUsername",
    getUsernameRequest
  );

  const currentValidationSchema = validationSchema[activeStep];
  const steps = ["SignUpInfo", "Verfiy", "PickUsername"];
  const isLastStep = activeStep === steps.length - 1;
  const {formId, formField} = signUpModel;
  function _sleep(ms) {
    new Promise((resolve) => setTimeout(resolve, ms));
  }
  function _renderStepContent(step) {
    switch (step) {
      case 0:
        return <SignUpInfo formField={formField}></SignUpInfo>;
      case 1:
        return <Verfiy formField={formField}></Verfiy>;
      case 2:
        return <PickUsername formField={formField}></PickUsername>;

      default:
        return <div>done</div>;
    }
  }

  async function _handleSubmit(values, actions) {
    function onSuccess(d) {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }

    function onError(e) {
      const {field, message} = e.response.data.error;
      actions.setFieldError(field, message);

      actions.setSubmitting(false);
    }

    if (activeStep === 0) {
      mutate(values, {
        onSuccess,
        onError,
      });
    } else if (activeStep == 1) {
      verfiyMutation(values, {
        onSuccess,
        onError,
      });
    } else if (activeStep == 2) {
      getUsername(values, {
        onSuccess,
        onError,
      });
    } else {
      onSuccess();
    }
  }
  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={currentValidationSchema}
      onSubmit={_handleSubmit}
    >
      {({isSubmitting, errors}) => (
        <Form id={formId} autoFocus={false} className="space-y-2">
          {_renderStepContent(activeStep)}

          <div className="space-x-6">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="p-1 rounded-sm text-sm"
            >
              {isLastStep ? "submit" : "Next"}
            </Button>
            {activeStep !== 0 && (
              <Button className="p-1 rounded-sm text-sm" onClick={_handleBack}>
                Back
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
