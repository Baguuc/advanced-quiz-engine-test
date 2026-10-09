import { createForm, getForm, listForms } from "./forms.ts";

export const router = {
  form: {
    list: listForms,
    get: getForm,
    create: createForm,
  },
};
