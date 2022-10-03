const express = require( "express" );
const app     = express();
const port    = process.env.PORT || 3000;
const Studios = require( "./studios" );
const Movies  = require( "./movies" );

app.get( "/actorsWithMultipleCharacters", async ( req, res ) => {
    const studioId = await Studios.getStudioId( "Marvel Studios" );
    const studioMovies = await Studios.getStudioMovies( studioId );
    const actorList = await Movies.getActorsWithMultipleCharacters( studioMovies );
    res.send( actorList );
});

if ( process.env.NODE_ENV != "test" ) {
    app.listen( port );
}

module.exports = app;
