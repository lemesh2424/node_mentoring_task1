import csv from 'csvtojson';
import path from 'path';
import fs from 'fs';
import {pipeline, Transform} from 'stream';

const directoryPath = path.join(__dirname, '../csv');

const CSV_EXTENSION = 'csv';

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory - ', err)
    }

    files.forEach((file) => {
        const fileExtension = getFileExtension(file);

        if (fileExtension === CSV_EXTENSION) {
            convertToTxt(file);
        }
    });
});

function getFileExtension(file) {
    const fileNameParts = file.split('.');

    if (!fileNameParts || !fileNameParts.length) {
        return null;
    }

    return fileNameParts[fileNameParts.length - 1];
}

function convertToTxt(file) {
    const filePath = 'csv/' + file;

    pipeline(
        fs.createReadStream(filePath),
        csv(),
        formatJSON,
        fs.createWriteStream(path.join('txt', transformFileExtensionToTxt(file))),
        (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            } else {
                console.log('Pipeline succeeded.');
            }
        }
    )
}

const formatJSON = new Transform({
    transform(chunk, encoding, callback) {
        const line = JSON.parse(chunk.toString());

        const contentToWrite = {
            book: line.Book,
            author: line.Author,
            price: line.Price
        };

        callback(null, `${JSON.stringify(contentToWrite)}\n`);
    }
});

function transformFileExtensionToTxt(fileName) {
    const fileNameParts = fileName.split('.');
    fileNameParts.pop();
    fileNameParts.push('txt');

    return fileNameParts.join('.');
}
