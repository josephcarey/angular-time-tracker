// big requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );

// router requires

// consts that might change
const PORT = process.env.PORT || 5000;

// express
const app = express();

// body-parser
app.use( bodyParser.json() );

// serve static files
app.use( express.static( 'server/public' ) );

// router uses

// spin up the server
app.listen( PORT, () => {
    console.log( `### Server up and listening on ${PORT} . . .` )
} ); // end spinning up the server