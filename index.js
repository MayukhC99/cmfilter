#!/usr/bin/env node
const path = require('path');


const yargs = require('yargs');
const translateDescription = require('./scripts/translateDescription');
const writeFile = require('./scripts/writeFile');
const colors = require('colors/safe');

const command = yargs.argv._[0];
const params = yargs.argv;



switch (command) {
    case 'import':
        let defaultFile = params.s;
        let translatedFile = params.t;
        let destinationFile = params.d ? params.d : 'translated.json';
        let root = process.cwd();

        try {
            defaultFile = require(path.join(root, defaultFile));
            translatedFile = require(path.join(root, translatedFile));
        } catch(e){
            console.log(colors.red('Either the destination of the files are wrong or the files are corrupted: ' + e));
            process.exit(1);
        }

        let translatedContent = translateDescription(defaultFile, translatedFile);
        try {
            writeFile(translatedContent, destinationFile, 'importing');
        } catch(e) {
            console.log(colors.red('Error in writting file: ', e));
            process.exit(1);
        }
        break;
    default:
        console.log(colors.red('command not identified'));
}
