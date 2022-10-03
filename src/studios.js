const axios   = require( "axios" );

const apiKey = "ac505a02032a33d65dd28b41f72182e1";
const baseUrl = "https://api.themoviedb.org/3/";

exports.getStudioId = async ( studioName ) => {
    // eslint-disable-next-line max-len
    const url = `${baseUrl}search/company?api_key=${apiKey}&query=${encodeURI( studioName )}&page=1`;
    const response = await axios.get( url );
    return response.data?.results[0]?.id || null;
};

exports.getStudioMovies = async ( studioId ) => {
    let page = 1;
    let totalPages = 1;
    let studioMovies = [];

    do {
        // eslint-disable-next-line max-len
        const url = `${baseUrl}discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_companies=${studioId}&with_watch_monetization_types=flatrate`;
        const response = await axios.get( url );
        if ( response.data.results ) {
            studioMovies = studioMovies.concat( response.data.results );
        }
        totalPages = response.data?.total_pages || 1;
        page += 1;
    } while ( page < totalPages );

    return studioMovies;
};
