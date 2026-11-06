import { createForm, getForm, getFormDetails, listForms, updateFormStatus } from "./forms.ts";
import {
  queryCompletionScreen,
  startResponse,
  submitAnonymousResponse,
  submitResponse,
  updateResponse,
} from "./responses.ts";

export const router = {
  form: {
    list: listForms,
    get: getForm,
    getDetails: getFormDetails,
    updateStatus: updateFormStatus,
    create: createForm,
  },
  response: {
    start: startResponse,
    update: updateResponse,
    submit: submitResponse,
    submitAnonymous: submitAnonymousResponse,
    queryCompletionScreen,
  },
};
