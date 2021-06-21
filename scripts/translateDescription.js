const promptSync = require('prompt-sync');
const colors = require('colors/safe');

const writeFile = require('./writeFile');

const input = promptSync({
    sigint: true
});

/**
 * compare description of both files by ID. And revert all
 * translated descriptions of trans_with_desc to a file
 * translated.json
 */
 function translateDescription(default_en_us, trans_with_desc) {
    let mapIdToDesc = {}
    let nonMatchingIds = []

    default_en_us.forEach(item => {
        if ( mapIdToDesc[item.id] ) {
            console.log(colors.yellow('Duplicate Id found: '+ item.id));
            // take the latest
            mapIdToDesc[item.id] = item.description;
        } else {
            mapIdToDesc[item.id] = item.description;
        }
    });

    let translatedList = trans_with_desc.map(item => {
        if( mapIdToDesc[item.id] ) {
            item.description = mapIdToDesc[item.id];
        } else {
            nonMatchingIds.push(item.id);
            console.log(colors.yellow('No such id in DEFAULT-en-us file: '+ item.id));
        }

        return item;
    });

    /**
     * Check if there are any extra ids,
     * and prompt user on whether should be removed
     * if present.
     */
    return nonMatchingIds.length ?
     (() => {
        console.log(colors.yellow('Seems like the file contain ids not present in DEFAULT-en-us'));
        const response = input('Want me to remove them (y/n) [recommended]: ')
        if (response.toLowerCase() === 'y') {
            translatedList = translatedList.filter(item => {
                return !nonMatchingIds.includes(item.id);
            })
            console.log(colors.green('unused ids have been removed'));
        } //else do nothing
        return translatedList;

    })() : translatedList;

}

module.exports = translateDescription;
