--database is named "time_tracker"

--create table
CREATE TABLE "time_entry" (
	"id" SERIAL PRIMARY KEY,
	"description" VARCHAR(255) NOT NULL,
	"date" DATE NOT NULL,
	"start_time" TIME (2),
	"end_time" TIME (2)
);

--add some fake data
INSERT INTO "time_entry" ("description", "date", "start_time", "end_time")
VALUES
	('gather ingredients', '12/12/2012', '5:00pm', '6:00pm'),
	('chop things', '12/12/2012', '18:30', '1900'),
	('combine dry ingredients', '12/12/2012', '7:00pm', '7:15pm'),
	('whisk eggs', '12/12/2012', '7:15pm', '7:30pm'),
	('crack eggs', '12/12/2012', '7:30pm', '9:00pm'),
	('bake', '12/12/2012', '9:00pm', '11:00pm');