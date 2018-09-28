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
        `INSERT INTO "project" ("name")
        VALUES ($1)`,
        [
            /* $1 */ req.body.name,
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
            "project"."id",
            "project"."name",
            COUNT("time_entry"."project_id") AS "number_of_entries",
            TO_CHAR(COALESCE(SUM("time_entry"."end_time" - "time_entry"."start_time"),'00:00'),'HH24:MI') AS "total_time"
        FROM "project"
        LEFT OUTER JOIN "time_entry" ON "project"."id" = "time_entry"."project_id"
        GROUP BY "project"."id";
        `
    )
        .then( ( results ) => {

            console.log( '### Back from DB with:' );
            console.log( results.rows );

            let resultsToSend = results.rows;
            // for ( result of resultsToSend ) {

            //     console.log( result )
            //     result.totalTime = '';

            //     // use the number of results in a thing to determine whether it is empty
            //     // time entries must be non-null and non-negative? (we should enforce this)
            //     // and so if it has one entry, it has at least one time

            //     if ( result.number_of_entries === 0 ) {
            //         results.total_time = { hours: 0, minutes: 0 }
            //     }

            //     // fix this by checking for 

            //     // concat the hours
            //     if ( result.total_time.hasOwnProperty( hours ) ) {
            //         result.totalTime += result.total_time.hours;
            //     } else {
            //         result.totalTime += '0';
            //     }

            //     result.totalTime += ':';

            //     // concat the minutes
            //     if ( result.total_time.hasOwnProperty( minutes ) ) {
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



module.exports = router;