ALTER TABLE "answer" RENAME COLUMN "data_value" TO "date_value";--> statement-breakpoint
ALTER TABLE "question_option" ADD COLUMN "correct" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "question_option" DROP COLUMN "value";--> statement-breakpoint
ALTER TABLE "question_option" ADD CONSTRAINT "question_option_question_id_position_unique" UNIQUE("question_id","position");