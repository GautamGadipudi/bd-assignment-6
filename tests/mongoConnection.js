const {MongoClient} = require('mongodb')

const checkMongoConnection = (mongoConnection, callback) => {
    MongoClient.connect(mongoConnection, (err) => {
        if (!err)
            callback(true)
        else
            callback(false, err)
    })
}

exports.checkMongoConnection = checkMongoConnection