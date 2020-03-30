const connection = require('./config/connection');

const {MongoClient} = require('mongodb');
const _ = require('lodash');

const updateDocs = (docs, callback) => {
    MongoClient.connect(connection.url, (err, client) => {
        if (!err) {
            const db = client.db(connection.db);
            console.log(`Connected to ${connection.url}/${connection.db}`);
            const collection = db.collection('movies');
            let bulk = collection.initializeUnorderedBulkOp();
            docs.forEach(element => {
                obj = _.pick(element, ['cost.value', 'box_office_currencyLabel.value', 'distributorLabel', 'box_office.value', 'MPAA_film_ratingLabel.value'])
                obj = _.pickBy(obj);
                obj2 = {}
                if (obj.cost) 
                    obj2.cost = parseFloat(obj.cost.value)
                if (obj.box_office_currencyLabel)
                    obj2.currency = obj.box_office_currencyLabel.value
                if (obj.distributorLabel)
                    obj2.distributor = obj.distributorLabel.value
                if (obj.box_office)
                    obj2.revenue = parseFloat(obj.box_office.value)
                if (obj.MPAA_film_ratingLabel)
                    obj2.MPAA_film_rating = obj.MPAA_film_ratingLabel.value

                if (obj2.cost || obj2.currency || obj2.revenue || obj2.MPAA_film_rating || obj2.distributor) {
                    bulk.find({_id: parseInt(element.IMDb_ID.value.slice(2))})
                    .updateOne({
                        $set: obj2
                    });
                }
            });
            console.log(`Updating rows with cost, currency, distributor, revenue or MPAA_film_rating only!`);
            console.log(`Bulk updating ${bulk.length} docs.`);
            bulk.execute((err2, result) => {
                if (!err2)
                    callback(undefined, {updatedCount: result.nModified, notUpdatedCount: result.getWriteErrorCount()});
                else
                    callback(err2, undefined);
            })
        }
        else {
            callback(err, undefined);
            console.log("Unable to connect to DB.");
        }
    });
};

exports.updateDocs = updateDocs;