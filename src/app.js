require('./events');
const {getData} = require('./input');
const {updateDocs} = require('./db');

getData('./data/extra-data.json', (data) => {
    console.log(`Retrieved ${data.length} rows from file.`);
    console.log(`Filtering rows with IMDb_ID.`);
    x = data.filter((item) => {
        return item.IMDb_ID
    })
    console.log(`Filtered ${x.length}. rows.`); 
    updateDocs(x, (err, result) => {
        if (!err) {
            console.log(result);
            process.exit(0)
        }
        else {
            console.log(err);
            process.exit(1, err)
        }
    });
})