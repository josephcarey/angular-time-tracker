// requires
const express = require( 'express' );

// make a router
const routerName = "Project";
const router = express.Router();

// bring in database stuff
const pg = require( 'pg' );
const pool = require( '../modules/pool.js' );

// --------------------
// CRUD STUFF
// --------------------


// Create -- POST
router.post( '/', ( req, res ) => {

    console.log( '###', routerName, 'router /POST call:' );
    console.log( req.body );

    pool.query(
        `INSERT INTO "project" ("name", "description", "estimated_time", "parent_id")
        VALUES ($1, $2, $3, $4)`,
        [
            /* $1 */ req.body.name,
            /* $2 */ req.body.description,
            /* $3 */ req.body.estimated_time,
            /* $4 */ req.body.parent_id,
        ]
    )
        .then( () => {

            console.log( '### row successfully inserted.' );
            res.sendStatus( 200 );

        } )
        .catch( ( error ) => {

            console.log( '### Error with SQL INSERT INTO:' );
            console.log( error );
            res.sendStatus( 500 );

        } );

} )

// Read -- GET
router.get( '/', ( req, res ) => {

    console.log( '###', routerName, 'router /GET call.' );

    pool.query(
        `
        SELECT
            "child"."id",
            "child"."name",
            "child"."description",
            "child"."estimated_time",
            "child"."parent_id",
            "parent"."name" AS "parent"
        FROM "project" "child"
        LEFT OUTER JOIN "project" "parent" ON "child"."parent_id" = "parent"."id"
        GROUP BY "parent"."id", "child"."id";
        `
    )
        .then( ( results ) => {
            console.log( '### Back from DB with:' );
            console.log( results.rows );
            res.send( resultsToSend );
        } )
        .catch( ( error ) => {
            console.log( '### Error with SQL SELECT:' );
            console.log( error );
            res.sendStatus( 500 );
        } );

} );

// Update -- PUT
router.put( '/:id', ( req, res ) => {

    console.log( '###', routerName, 'router /PUT call:' );
    console.log( req.body );

    pool.query(
        `
        UPDATE "project"
        SET
            "name" = $1,
            "description" = $2,
            "estimated_time" = $3,
            "parent_id" = $4
        WHERE
            "id" = $5;
        `,
        [
            /* $1 */ req.body.name,
            /* $1 */ req.body.description,
            /* $1 */ req.body.estimated_time,
            /* $1 */ req.body.parent_id,
            /* $1 */ req.params.id
        ]
    )
        .then( () => {
            console.log( '### Row successfully updated (stopped) on time_entry.' );
            res.sendStatus( 200 );
        } )
        .catch( ( error ) => {
            console.log( '### Error with SQL UPDATE:' );
            console.log( error );
            res.sendStatus( 500 );
        } )

} )

// Delete -- DELETE
router.delete( '/:id', ( req, res ) => {

    console.log( '###', routerName, 'router /DELETE call:' );
    console.log( req.params );

    pool.query(
        `DELETE FROM "project"
        WHERE id = $1;`,
        [req.params.id]
    )
        .then( () => {
            console.log( '### Row successfully deleted from project.' );
            res.sendStatus( 200 );
        } )
        .catch( ( error ) => {
            console.log( '### Error with SQL DELETE:' );
            console.log( error );
            res.sendStatus( 500 );
        } )

} )

// --------------------
// --------------------
// --------------------




router.get( '/special/:id', ( req, res ) => {

    console.log( '###', routerName, '/all router /GET call.' );

    pool.query(
        `
        SELECT
	"parent".*,
	COALESCE(json_agg(DISTINCT "time_entry") FILTER (WHERE "time_entry"."id" IS NOT NULL), '[]') AS "time_entries",
	COALESCE(json_agg(DISTINCT "child") FILTER (WHERE "child"."id" IS NOT NULL), '[]') AS "children"
	FROM "project" "parent"
	LEFT OUTER JOIN "project" "child" ON "parent"."id" = "child"."parent_id"
    LEFT OUTER JOIN "time_entry" ON "parent"."id" = "time_entry"."project_id"
    WHERE "parent"."id" = $1
	GROUP BY "parent"."id";
        `,
        [
            /* $1 */ req.params.id
        ]
    )
        .then( ( results ) => {

            console.log( '### Back from DB with:' );
            console.log( results.rows );
            res.send( results.rows );

        } )
        .catch( ( error ) => {

            console.log( '### Error with SQL SELECT:' );
            console.log( error );
            res.sendStatus( 500 );

        } );

} );

router.get( '/special', ( req, res ) => {

    if ( req.params.id === null ) {
        console.log( '### this filters nulls correctly!' );
    } else {
        console.log( '### req.params.id:', req.params.id );

    }

    console.log( '###', routerName, '/all router /GET call.' );

    pool.query(
        `
        SELECT
	"parent".*,
	COALESCE(json_agg(DISTINCT "time_entry") FILTER (WHERE "time_entry"."id" IS NOT NULL), '[]') AS "time_entries",
	COALESCE(json_agg(DISTINCT "child") FILTER (WHERE "child"."id" IS NOT NULL), '[]') AS "children"
	FROM "project" "parent"
	LEFT OUTER JOIN "project" "child" ON "parent"."id" = "child"."parent_id"
    LEFT OUTER JOIN "time_entry" ON "parent"."id" = "time_entry"."project_id"
    WHERE "parent"."parent_id" IS NULL
	GROUP BY "parent"."id";
        `
    )
        .then( ( results ) => {

            console.log( '### Back from DB with:' );
            console.log( results.rows );
            res.send( results.rows );

        } )
        .catch( ( error ) => {

            console.log( '### Error with SQL SELECT:' );
            console.log( error );
            res.sendStatus( 500 );

        } );

} );







module.exports = router;



// ---------------------------------------------------
// Broken code . . .
// ---------------------------------------------------

function getTotalTime( startingID ) {


    return new Promise( function ( resolve, reject ) {

        numberOfSecondsTotal = 0;

        idsToProcess = [];
        idsToProcess.push( startingID );

        while ( idsToProcess.length > 0 ) {

            console.log( idsToProcess );



            // add the children projects to the list of ids
            let addChildren = new Promise( function ( resolve, reject ) {

                pool.query(
                    `
            SELECT "child"."id"
	        FROM "project" "child"
	        LEFT OUTER JOIN "project" "parent" ON "child"."parent_id" = "parent"."id"
	        WHERE "parent"."id" = $1;
        `, [idsToProcess[0]]
                )
                    .then( ( results ) => {
                        for ( row of results.rows ) {
                            idsToProcess.push( row );
                            resolve();
                        }
                    } )

            } )
            // add the hours of the time entries
            let addHours = new Promise( function ( resolve, reject ) {
                pool.query(
                    `
            SELECT
	            SUM(
	                EXTRACT (epoch FROM (
                        "time_entry"."end_date" - "time_entry"."start_date"
                    ))
                ) AS "total_time"
            FROM "time_entry"
            WHERE "project_id" = $1;
            `,
                    [idsToProcess[0]]
                ).then( ( results ) => {
                    for ( row of results.rows ) {
                        console.log( 'row:', row );
                        numberOfSecondsTotal += Number( row.total_time )
                        console.log( 'numberOfHours:', numberOfSecondsTotal );
                        resolve();
                    }
                } )

            } )

            Promise.all( [addChildren, addHours] )
                .then( () => {
                    idsToProcess.shift();
                } )

        }

        console.log( numberOfSecondsTotal );

        resolve( numberOfSecondsTotal );
    } )
}

router.get( '/overview/', ( req, res ) => {

    console.log( '###', routerName, '/overview router /GET call.' );

    thingToSend = [];

    // first get the root projects
    pool.query(
        `
        SELECT *
        FROM "project"
        WHERE "parent_id" IS NULL;
        `
    )
        .then( ( results ) => {
            thingToSend = results.rows;

            // cycle through...
            // for ( thing of thingToSend ) {

            // get total hours
            // getTotalTime( thing.id )
            // .then( ( response ) => 

            let subProjects = function ( thing ) {
                return new Promise( function ( resolve, reject ) {

                    // get their sub-projects
                    pool.query(
                        `
                SELECT *
                FROM "project"
                WHERE "parent_id" = $1
                `,
                        [
                    /* $1 */ thing.id
                        ]
                    )
                        .then( ( results ) => {
                            thingToSend.children = results.rows;
                            resolve();
                        } )
                        .catch( ( error ) => {
                            console.log( '### something went wrong' );
                        } )
                } )
            }

            let timeEntries = function ( thing ) {
                return new Promise( function ( resolve, reject ) {


                    // and their time entries
                    pool.query(
                        `
                SELECT *
                FROM "time_entry"
                WHERE "project_id" = $1
                `,
                        [
                    /* $1 */ thing.id
                        ]
                    )
                        .then( ( results ) => {
                            thingToSend.time_entries = results.rows;
                            resolve();
                        } )
                        .catch( ( error ) => {
                            console.log( '### something went wrong' );
                        } )
                } )
            }

            Promise.all( [
                thingToSend.forEach( subProjects ), thingToSend.forEach( timeEntries )] ).then( function () {

                    console.log( thingToSend );
                    res.send( thingToSend );

                } )

            // }



        } )
        .catch( ( error ) => {
            console.log( '### something went wrong' );
        } )

} )