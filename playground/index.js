const fs = require('fs');
const readline = require('readline');

const _ = require('lodash');

const getData = (filePath, callback) => {
    let data = []

    const lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
    })

    lineReader.on('line', (line) => {
        let obj = JSON.parse(line);
            data.push(obj); 
    })

    lineReader.on('close', (line) => {
        callback(data);
    })
}

getData('./data/extra-data.json', (data) => {
    console.log(`Retrieved ${data.length} rows from file.`);
    x = data.filter((item) => {
        return item.IMDb_ID
    })
    
    console.log(`Filtered to ${x.length}.`);      
})



