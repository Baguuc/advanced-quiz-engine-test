import { faker } from "@faker-js/faker";
import { form_status, form_visibility } from "../../src/db/schema.ts";
import { randomInteger } from "./index.ts";

const generateRandomFormData = () => {
  const questions = [];
  for (let i = 0; i < 5; i++) {
    const questionOptions = [];

    for(let j = 0; j < 5; j++) {
      questionOptions.push({
        label: faker.string.sample(16),
        position: j
      });
    }

    questions.push({
      type: "single_choice" as any,
      title: faker.string.sample(16),
      description: faker.string.sample(64),
      position: i,
      required: faker.datatype.boolean(),
      options: questionOptions,
      config: {},
    });
  }

  const status = form_status.enumValues[randomInteger(0, form_status.length - 1)];
  const visibility = form_visibility.enumValues[randomInteger(0, form_status.length - 1)];

  const data = {
    title: faker.string.sample(16),
    description: faker.string.sample(64),
    status,
    visibility,
    allowAnonymous: faker.datatype.boolean(),
    allowMultipleResponses: faker.datatype.boolean(),
    questions,
  };

  return data;
};

export { generateRandomFormData };
