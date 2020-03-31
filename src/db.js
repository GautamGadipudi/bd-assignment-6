const connection = require('./config/connection');

const {MongoClient} = require('mongodb');
const _ = require('lodash');

const updateDocsUsingId = (docs, collectionName, callback) => {
    MongoClient.connect(connection.url, (err, client) => {
        if (!err) {
            const db = client.db(connection.db);
            console.log(`Connected to ${connection.url}/${connection.db}`);
            const collection = db.collection(collectionName);
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
            console.log(`Bulk updating ${bulk.length} docs matched by _id.`);
            bulk.execute((err2, result) => {
                if (!err2) {
                    callback(undefined, {updatedCount: result.nModified, errorCount: result.getWriteErrorCount()});
                    client.close();
                }
                else {
                    callback(err2, undefined);
                    client.close();
                }
                    
            })
        }
        else {
            callback(err, undefined);
            console.error("Unable to connect to DB.");
        }
    });
};

const updateDocsUsingTitleFromTempCollection = (tempCollectionName, collectionName, callback) => {
    MongoClient.connect(connection.url, (err, client) => {
        if (!err) {
            const db = client.db(connection.db);
            console.log(`Connected to ${connection.url}/${connection.db}`);
            const collection = db.collection(collectionName);
            const tempCollection = db.collection(tempCollectionName);
            let bulk = collection.initializeUnorderedBulkOp();

            // Grouped by title
            tempCollection.aggregate([
                {
                  '$match': {
                    '$or': [
                      {
                        'cost': {
                          '$exists': true
                        }, 
                        'currency': {
                          '$exists': true
                        }, 
                        'distributor': {
                          '$exists': true
                        }, 
                        'revenue': {
                          '$exists': true
                        }, 
                        'MPAA_film_rating': {
                          '$exists': true
                        }
                      }
                    ]
                  }
                }, {
                  '$group': {
                    '_id': '$title', 
                    'extraDataArray': {
                      '$push': {
                        'cost': '$cost', 
                        'currency': '$currency', 
                        'distributor': '$distributor', 
                        'revenue': '$revenue', 
                        'MPAA_film_rating': '$MPAA_film_rating'
                      }
                    }
                  }
                }
            ]).toArray((err3, aggResult) => {
                if (!err3) {
                    console.log(`Selecting values with more data (more keys) when there's multiple docs with same title.`);
                    aggResult.forEach((element) => {
                        extraDataObj = {};
                        element.extraDataArray.forEach((item) => {
                            if (_.keys(extraDataObj).length < _.keys(item).length)
                                extraDataObj = item;
                        });
                        bulk.find({title: element._id})
                            .updateOne({
                                $set: extraDataObj
                            });
                    });
                    console.log(`Bulk updating ${bulk.length} docs matched by title.`);
                    bulk.execute((err2, result) => {
                        if (!err2) {
                            client.close();
                            callback(undefined, {updatedCount: result.nModified, errorCount: result.getWriteErrorCount()});
                        }
                        else {
                            client.close();
                            callback(err2, undefined);
                        }
                    });
                }
                else {
                    console.error(`Failed to aggregate.`);
                    client.close();
                    callback(err3, undefined);
                }
            });
        }
        else {
            callback(err, undefined);
            console.error("Unable to connect to DB.");
        }
    });
}

const insertDocs = (docs, collectionName, callback) => {
    MongoClient.connect(connection.url, (err, client) => {
        if (!err) {
            const db = client.db(connection.db);
            console.log(`Connected to ${connection.url}/${connection.db}`);
            const collection = db.collection(collectionName);
            let bulk = collection.initializeUnorderedBulkOp();
            docs.forEach(item => {
                bulk.insert(item);
            });
            bulk.execute((err2, result) => {
                if (!err2) {
                    client.close();
                    callback(undefined, result.nInserted);
                }
                else {
                    client.close();
                    callback(err2, undefined);
                }
            });
        }
        else {
            console.error("Unable to connect to DB.");
            callback(err, undefined);
        }
    })
}

const dropCollection = (collectionName, callback) => {
    MongoClient.connect(connection.url, (err, client) => {
        if (!err) {
            const db = client.db(connection.db);
            console.log(`Connected to ${connection.url}/${connection.db}`);
            db.dropCollection(collectionName, (err, isDropped) => {
                if (!err && isDropped) {
                    console.log(`Dropped ${collectionName} collection successfully!`);
                    callback(undefined, isDropped);
                }
                else {
                    console.warn(`Failed to drop collection ${collectionName}`);
                    callback(err, false)
                }
            });
        }
    })
}

exports.updateDocsUsingId = updateDocsUsingId;
exports.insertDocs = insertDocs;
exports.updateDocsUsingTitleFromTempCollection = updateDocsUsingTitleFromTempCollection;
exports.dropCollection = dropCollection;