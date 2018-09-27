// requires
const express = require( 'express' );

// make a router
const routerName = "Time";
const router = express.Router();

// bring in database stuff
const pg = require( 'pg' );
const pool = require( '../modules/pool.js' );

// --------------------
// CRUD STUFF
// --------------------


// Create -- Post
router.post( '/', ( req, res ) => {

    console.log( '###', routerName, 'router /POST call:' );
    console.log( req.body );

    // change the post data to match the database
    // thingToInsert = req.body;
    // thingToInsert.start_time = thingToInsert.startTime;
    // thingToInsert.end_time = thingToInsert.endTime;

    pool.query(
        `INSERT INTO "time_entry" ("description", "date", "start_time", "end_time", "project_id")
        VALUES ($1, $2, $3, $4, $5)`,
        [
            /* $1 */ req.body.description,
            /* $2 */ req.body.date,
            /* $3 */ req.body.start_time,
            /* $4 */ req.body.end_time,
            /* $5 */ req.body.project_id
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
        `SELECT
            "time_entry"."id",
            "time_entry"."description",
            "time_entry"."date",
            "time_entry"."start_time",
            "time_entry"."end_time",
            TO_CHAR("time_entry"."end_time" - "time_entry"."start_time", 'HH24:MM') AS "total_time",
            "project"."name" AS "project"
        FROM "time_entry"
        LEFT OUTER JOIN "project" ON "time_entry"."project_id" = "project"."id";`
    )
        .then( ( results ) => {

            console.log( '### Back from DB with:' );
            console.log( results.rows );

            // // convert the total time from the database to something readable
            let resultsToSend = results.rows;
            // for ( result of resultsToSend ) {
            //     result.totalTime = '';
            //     // concat the hours
            //     if ( result.total_time.hours ) {
            //         result.totalTime += result.total_time.hours;
            //     } else {
            //         result.totalTime += '0';
            //     }

            //     result.totalTime += ':';

            //     // concat the minutes
            //     if ( result.total_time.minutes ) {
            //         if ( result.total_time.minutes < 10 ) {
            //             result.totalTime += '0'
            //         }
            //         result.totalTime += result.total_time.minutes;
            //     } else {
            //         result.totalTime += '00';
            //     }

            //     delete result.total_time;
            // }

            res.send( resultsToSend );

        } )
        .catch( ( error ) => {

            console.log( '### Error with SQL SELECT:' );
            console.log( error );
            res.sendStatus( 500 );

        } );

} );

// Update -- PUT

// Delete -- DELETE
router.delete( '/:id', ( req, res ) => {

    console.log( '###', routerName, 'router /DELETE call:' );
    console.log( req.params );

    pool.query(
        `DELETE FROM "time_entry"
        WHERE id = $1;`,
        [req.params.id]
    )
        .then( () => {
            console.log( '### Row successfully deleted from time_entry.' );
            res.sendStatus( 200 );
        } )
        .catch( ( error ) => {
            console.log( '### Error with SQL DELETE:' );
            console.log( error );
            res.sendStatus( 500 );
        } )

} )

module.exports = router;