import { createForm, listForms } from "./forms.ts";

export const router = {
  form: {
    list: listForms,
    create: createForm,
  },
};
