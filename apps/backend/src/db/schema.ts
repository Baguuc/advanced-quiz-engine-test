import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const form_status = pgEnum("form_status", ["draft", "published", "closed", "archived"]);
export const question_type = pgEnum("question_type", [
  "short_text",
  "long_text",
  "number",
  "email",
  "date",
  "single_choice",
  "multiple_choice",
  "dropdown",
  "rating",
  "linear_scale",
]);
export const form_access_role = pgEnum("form_access_role", ["viewer", "editor"]);
export const form_visibility = pgEnum("form_visibility", ["public", "restricted", "private"]);

export const user = pgTable("user", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const form = pgTable("form", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: form_status("status").default("draft").notNull(),
  visibility: form_visibility("visibility").default("private").notNull(),
  allowAnonymous: boolean("allow_anonymous").default(false).notNull(),
  allowMultipleResponses: boolean("allow_multiple_responses").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  publishedAt: timestamp("published_at"),
  closedAt: timestamp("closed_at"),
});

export const question = pgTable(
  "question",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    formId: integer("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),
    type: question_type("type").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    position: integer("position").notNull(),
    required: boolean("required").notNull(),
    config: jsonb("config"),
  },
  (t) => [unique().on(t.formId, t.position)],
);

export const questionOption = pgTable(
  "question_option",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    questionId: integer("question_id")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    position: integer("position").notNull(),
    correct: boolean("correct").notNull(),
  },
  (t) => [unique().on(t.questionId, t.position)],
);

export const response = pgTable("response", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  formId: integer("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => user.id, { onDelete: "cascade" }),
  submittedAt: timestamp("submitted_at"),
  startedAt: timestamp("started_at"),
  completed: boolean("completed").notNull(),
});

export const answer = pgTable("answer", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  responseId: integer("response_id")
    .notNull()
    .references(() => response.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),

  textValue: text("text_value"),
  numberValue: integer("number_value"),
  booleanValue: boolean("boolean_value"),
  dateValue: timestamp("date_value"),
});

export const answerOption = pgTable(
  "answer_option",
  {
    answerId: integer("answer_id")
      .notNull()
      .references(() => answer.id, { onDelete: "cascade" }),
    optionId: integer("option_id")
      .notNull()
      .references(() => questionOption.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.answerId, t.optionId] })],
);

export const formAccess = pgTable(
  "form_access",
  {
    formId: integer("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: form_access_role("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.formId, t.userId] })],
);
