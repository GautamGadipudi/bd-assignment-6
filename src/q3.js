require('./events');
const {getData} = require('./input');
const {insertDocs, updateDocsUsingTitleFromTempCollection, dropCollection} = require('./db');
const _ = require('lodash');

getData('./data/extra-data.json', (data) => {
    console.log(`Retrieved ${data.length} rows from file.`);
    console.log(`Filtering rows with titleLabel.`);
    x = data.filter((item) => {
        return item.titleLabel;
    });
    console.log(`Filtered ${x.length} rows.`);
    y = _.map(x, (item) => {
        obj = _.pick(item, ['cost.value', 
                            'box_office_currencyLabel.value', 
                            'distributorLabel', 
                            'box_office.value', 
                            'MPAA_film_ratingLabel.value',
                            'titleLabel']);
        obj = _.pickBy(obj);
        obj2 = {}
        if (obj.cost) 
            obj2.cost = parseFloat(obj.cost.value);
        if (obj.box_office_currencyLabel)
            obj2.currency = obj.box_office_currencyLabel.value;
        if (obj.distributorLabel)
            obj2.distributor = obj.distributorLabel.value;
        if (obj.box_office)
            obj2.revenue = parseFloat(obj.box_office.value);
        if (obj.MPAA_film_ratingLabel)
            obj2.MPAA_film_rating = obj.MPAA_film_ratingLabel.value;
        if (obj.titleLabel)
            obj2.title = obj.titleLabel.value;

        // Making sure I don't have _id
        return _.omit(obj2, 'IMDb_ID');
    });
    dropCollection('extraDataTemp', (err2, isDropped) => {
        insertDocs(y, 'extraDataTemp', (err, insertionCount) => {
            if (!err) {
                console.log(`Dumped ${insertionCount} docs into temp collection.`);
                updateDocsUsingTitleFromTempCollection('extraDataTemp', "movies3", (err, result) => {
                    if (!err) {
                        console.log(result);
                        dropCollection('extraDataTemp', (err2, isDropped) => {
                            process.exit(0);
                        });
                    }
                    else {
                        dropCollection('extraDataTemp', (err2, isDropped) => {
                            process.exit(1, err);
                        });
                    }
                });
            }
            else {
                console.error(`Failed to dump file data into temp table.`);
                process.exit(1, err);
            } 
        });
    });
});