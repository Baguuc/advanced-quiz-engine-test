import { createForm, getForm, listForms } from "./forms.ts";
import { queryCompletionScreen, startResponse, submitResponse, updateResponse } from "./responses.ts";

export const router = {
  form: {
    list: listForms,
    get: getForm,
    create: createForm,
  },
  response: {
    start: startResponse,
    update: updateResponse,
    submit: submitResponse,
    queryCompletionScreen,
  },
};
