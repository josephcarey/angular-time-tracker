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
        `SELECT
            "project"."id",
            "project"."name",
            COUNT("time_entry"."project_id") AS "number_of_entries"
        FROM "project"
        LEFT OUTER JOIN "time_entry" ON "project"."id" = "time_entry"."project_id"
        GROUP BY "project"."id";`
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