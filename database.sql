--clear the existing data
DROP TABLE "project" CASCADE;
DROP TABLE "time_entry" CASCADE;

--database is named "time_tracker"

CREATE TABLE "project" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
	"description" VARCHAR(255),
	"estimated_time" INTERVAL,
    "parent_id" INT REFERENCES "project"
);

CREATE TABLE "time_entry" (
    "id" SERIAL PRIMARY KEY,
    "start_date" TIMESTAMP NOT NULL DEFAULT NOW(),
	"end_date" TIMESTAMP,
    "project_id" INT REFERENCES "project" NOT NULL
);

--example data for root level projects
INSERT INTO "project" ("name","description","estimated_time")
VALUES
	('make dinner','dinner for six, three courses.','2:00'),
    ('sing in the shower','an important part of any morning.','0:15');

--example data for sub-projects
INSERT INTO "project" ("name","description","estimated_time","parent_id")
VALUES
	('make a salad','delicious salad with arugula','1:00',1),
		('chop some lettuce', 'arugula specifically', '0:30', 3),
		('chop cherry tomatoes', 'delicious!', '0:30', 3),
	('make a cake','most important course','2:00',1),
		('mix the dry ingredients','the fun part', '0:45', 6),
		('mix the wet ingredients','the gross part','1:15', 6),
	('get the shower going','brr its cold','0:10',2),
	('pick a song to sing','something new','0:05',2),
		('consider pop music','nah','0:01', 10),
		('consider jazz music','maybe...','0:01', 10),
		('consider classical music','hard to sing.','0:01', 10),
		('consider polkas','thats it!', '0:02', 10);

INSERT INTO "time_entry" ("start_date", "end_date", "project_id")
VALUES
    ('12/12/2012 9:00pm', '12/12/2012 9:02pm', 4),
	('12/12/2012 9:02pm', '12/12/2012 9:06pm', 4);

INSERT INTO "time_entry" ("project_id")
VALUES
    (4);