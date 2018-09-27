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


// Create -- Post
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



module.exports = router;