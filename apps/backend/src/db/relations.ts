import * as schema from "./schema.ts";
import { defineRelations } from "drizzle-orm";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    forms: r.many.form(),
    formAccesses: r.many.formAccess(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  form: {
    owner: r.one.user({
      from: r.form.ownerId,
      to: r.user.id,
      optional: false,
    }),
    questions: r.many.question(),
    responses: r.many.response(),
    formAccesses: r.many.formAccess(),
  },
  question: {
    form: r.one.form({
      from: r.question.formId,
      to: r.form.id,
      optional: false,
    }),
    options: r.many.questionOption(),
    answers: r.many.answer(),
  },
  questionOption: {
    question: r.one.question({
      from: r.questionOption.questionId,
      to: r.question.id,
      optional: false,
    }),
    answerOptions: r.many.answerOption(),
  },
  response: {
    form: r.one.form({
      from: r.response.formId,
      to: r.form.id,
      optional: false,
    }),
    user: r.one.user({
      from: r.response.userId,
      to: r.user.id,
      optional: true,
    }),
    answers: r.many.answer(),
  },
  answer: {
    response: r.one.response({
      from: r.answer.responseId,
      to: r.response.id,
      optional: false,
    }),
    question: r.one.question({
      from: r.answer.questionId,
      to: r.question.id,
      optional: false,
    }),
    answerOptions: r.many.answerOption(),
  },
  answerOption: {
    answer: r.one.answer({
      from: r.answerOption.answerId,
      to: r.answer.id,
      optional: false,
    }),
    option: r.one.questionOption({
      from: r.answerOption.optionId,
      to: r.questionOption.id,
      optional: false,
    }),
  },
  formAccess: {
    form: r.one.form({
      from: r.formAccess.formId,
      to: r.form.id,
      optional: false,
    }),
    user: r.one.user({
      from: r.formAccess.userId,
      to: r.user.id,
      optional: false,
    }),
  },
}));
