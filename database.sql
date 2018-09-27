--clear the existing data
DROP TABLE "time_entry";
DROP TABLE "project";

--database is named "time_tracker"

CREATE TABLE "project" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100) NOT NULL
);

CREATE TABLE "time_entry" (
	"id" SERIAL PRIMARY KEY,
	"description" VARCHAR(255) NOT NULL,
	"date" DATE NOT NULL,
	"start_time" TIME (2),
	"end_time" TIME (2),
	"project_id" INT REFERENCES "project"
);

INSERT INTO "project" ("name")
VALUES
	('bake a cake'),
	('write a game'),
	('sing in the shower');

INSERT INTO "time_entry" ("description", "date", "start_time", "end_time", "project_id")
VALUES
	('gather ingredients', '12/12/2012', '5:00pm', '6:00pm', 1),
	('chop things', '12/12/2012', '18:30', '1900', 1),
	('combine dry ingredients', '12/12/2012', '7:00pm', '7:15pm', 1),
	('whisk eggs', '12/12/2012', '7:15pm', '7:30pm', 1),
	('crack eggs', '12/12/2012', '7:30pm', '9:00pm', 1),
	('bake', '12/12/2012', '9:00pm', '11:00pm', 1);