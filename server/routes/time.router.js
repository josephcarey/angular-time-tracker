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
    thingToInsert = req.body;
    thingToInsert.start_time = thingToInsert.startTime;
    thingToInsert.end_time = thingToInsert.endTime;

    pool.query(
        `INSERT INTO "time_entry" ("description", "date", "start_time", "end_time")
        VALUES ($1, $2, $3, $4)`,
        [
            /* $1 */ req.body.description,
            /* $2 */ req.body.date,
            /* $3 */ req.body.start_time,
            /* $4 */ req.body.end_time
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

module.exports = router;