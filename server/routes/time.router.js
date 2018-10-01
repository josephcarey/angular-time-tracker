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

    pool.query(
        `INSERT INTO "time_entry" ("project_id")
        VALUES ($1)`,
        [
            /* $1 */ req.body.project_id
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
            "time_entry"."id",
            "time_entry"."description",
            "time_entry"."date",
            "time_entry"."start_time",
            "time_entry"."end_time",
            TO_CHAR("time_entry"."end_time" - "time_entry"."start_time", 'HH24:MI') AS "total_time",
            "project"."name" AS "project"
        FROM "time_entry"
        LEFT OUTER JOIN "project" ON "time_entry"."project_id" = "project"."id";
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

// Update -- PUT
router.put( '/:id', ( req, res ) => {

    console.log( '###', routerName, 'router /stop PUT call:' );
    console.log( req.params );

    pool.query(
        `
        UPDATE "time_entry"
        SET
            "start_date" = $1,
            "end_date" = $2,
            "project_id" = $3
        WHERE
            "id" = $4;
        `,
        [
            /* $1 */ req.body.start_date,
            /* $1 */ req.body.end_date,
            /* $1 */ req.body.project_id,
            /* $1 */ req.params.id,
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


router.put( '/stop/:id', ( req, res ) => {

    console.log( '###', routerName, 'router /stop PUT call:' );
    console.log( req.params );

    pool.query(
        `
        UPDATE "time_entry"
        SET "end_date" = NOW()
        WHERE "id" = $1;
        `,
        [
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