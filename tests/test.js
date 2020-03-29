const connection = require('../src/config/connection');
const{checkMongoConnection} = require('./mongoConnection');

checkMongoConnection(connection.url, (status, err) => {
    if (err) {
        console.log(`Connection to Mongo FAILED!`);
        console.log(err);
        process.exit(1, err)
    }
    else {
        console.log(`Connection to Mongo SUCCESSFUL!`);
        process.exit(0)
    }
})

process.on('exit', (code, err) => {
    switch(code) {
        case 0: 
            console.log(`ALL TESTS SUCCESSFUL!`);
            break
        case 1:
            console.log(err);
            console.log(`Few tests FAILED!`);
            break
    }
})