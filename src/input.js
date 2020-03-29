const fs = require('fs');
const readline = require('readline');

const getData = (filePath, callback) => {
    let data = [];

    const lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    lineReader.on('line', (line) => {
        let obj = JSON.parse(line);
            data.push(obj); 
    });

    lineReader.on('close', (line) => {
        callback(data);
    });
}

exports.getData = getData;