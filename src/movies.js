const axios   = require( "axios" );

const apiKey = "ac505a02032a33d65dd28b41f72182e1";
const baseUrl = "https://api.themoviedb.org/3/";

function isSameCharacter( actualCharacter, newCharacter ) {
    if ( !actualCharacter[0]?.characterName || !newCharacter || newCharacter.includes( "Self" )  ) {
        return false;
    }

    let response = true;
    for ( let index = 0; index < actualCharacter.length; index++ ) {
        // eslint-disable-next-line max-len
        if ( actualCharacter[index].characterName.toLowerCase().includes( newCharacter.toLowerCase() ) || newCharacter.toLowerCase().includes( actualCharacter[index].characterName.toLowerCase() ) ) {
            response = false;
        }
        if ( newCharacter.includes( "/" ) || actualCharacter[index].characterName.includes( "/" ) ) {
            const newCharacterParts = newCharacter.split( /\s*(?:\/|$)\s*/ );
            // eslint-disable-next-line max-len
            for ( let indexNewCharacterParts = 0; indexNewCharacterParts < newCharacterParts.length; indexNewCharacterParts++ ) {
                // eslint-disable-next-line max-len
                if ( actualCharacter[index].characterName.toLowerCase().includes( newCharacterParts[indexNewCharacterParts].toLowerCase() ) ) {
                    response = false;
                }
            }
            // eslint-disable-next-line max-len
            const actualCharacterParts = actualCharacter[index].characterName.split( /\s*(?:\/|$)\s*/ );
            // eslint-disable-next-line max-len
            for ( let indexActualCharacterParts = 0; indexActualCharacterParts < actualCharacterParts.length; indexActualCharacterParts++ ) {
                // eslint-disable-next-line max-len
                if ( newCharacter.toLowerCase().includes( actualCharacterParts[indexActualCharacterParts].toLowerCase() ) ) {
                    response = false;
                }
            }
        } else if ( newCharacter.includes( " " ) || actualCharacter[index].characterName.includes( " " ) ) {
            const newCharacterParts = newCharacter.split( /\b(\s)/ );
            // eslint-disable-next-line max-len
            for ( let indexNewCharacterParts = 0; indexNewCharacterParts < newCharacterParts.length; indexNewCharacterParts++ ) {
                // eslint-disable-next-line max-len
                if ( actualCharacter[index].characterName.toLowerCase().includes( newCharacterParts[indexNewCharacterParts].toLowerCase() ) ) {
                    response = false;
                }
            }
            // eslint-disable-next-line max-len
            const actualCharacterParts = actualCharacter[index].characterName.split( /\b(\s)/ );
            // eslint-disable-next-line max-len
            for ( let indexActualCharacterParts = 0; indexActualCharacterParts < actualCharacterParts.length; indexActualCharacterParts++ ) {
                // eslint-disable-next-line max-len
                if ( newCharacter.toLowerCase().includes( actualCharacterParts[indexActualCharacterParts].toLowerCase() ) ) {
                    response = false;
                }
            }
        }
    }

    return response;
}

exports.getActorsWithMultipleCharacters = async ( studioMovies ) => {
    let actorsList = {};
    let finalList = {};
    for ( let movieIndex = 0; movieIndex < studioMovies.length; movieIndex++ ) {
        // eslint-disable-next-line max-len
        const url = `${baseUrl}movie/${studioMovies[movieIndex].id}/credits?api_key=${apiKey}&language=en-US`;
        const response = await axios.get( url );
        for ( let castIndex = 0; castIndex < response.data.cast.length; castIndex++ ) {
            if ( response.data.cast[castIndex].known_for_department === "Acting" && !response.data.cast[castIndex].character.includes( "uncredited" ) ) {
                // eslint-disable-next-line max-len
                if ( actorsList[`${response.data.cast[castIndex].name}`] && ( isSameCharacter( actorsList[`${response.data.cast[castIndex].name}`], response.data.cast[castIndex].character ) ) ) {
                    actorsList[`${response.data.cast[castIndex].name}`].push({
                        movieName: studioMovies[movieIndex].original_title,
                        characterName: response.data.cast[castIndex].character,
                    });

                    // eslint-disable-next-line max-len
                    finalList[`${response.data.cast[castIndex].name}`] = actorsList[`${response.data.cast[castIndex].name}`];
                } else if ( !actorsList[`${response.data.cast[castIndex].name}`] ) {
                    actorsList[`${response.data.cast[castIndex].name}`] = [];
                    actorsList[`${response.data.cast[castIndex].name}`].push({
                        movieName: studioMovies[movieIndex].original_title,
                        characterName: response.data.cast[castIndex].character,
                    });
                }
            }
        }
    }

    return finalList;
};
