const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');

let writeFile = (content, destination, task) => {
    
    let destinationFile = [];
    if (fs.existsSync(destination)) {
        /**
         * File already exists
         * Assume the file is a proper json file
         */
        try {
            destinationFile = require(path.join(process.cwd(), destination));
        } catch(e) {
            console.log(colors.red('Error while writing file: ' + e));
            process.exit(1);
        }
    }
    content = destinationFile.concat(content);

    // correcting the alignments of JSON content
    content = JSON.stringify(content, null, 2);

    fs.writeFile(destination, content, function (err) {
        if (err) throw err;
        console.log(colors.green(`Voilà, ${task} was successful !!!`));
    });
}

module.exports = writeFile;
