from pymongo import MongoClient
import matplotlib.pyplot as plot

client = MongoClient()
db = client['imdb']
movies = db['movies2']

print("Querying MongoDB. Please wait...")
data = movies.aggregate([
    {
        '$match': {
            'genres': {
                '$exists': True
            },
            'actors': {
                '$exists': True
            }
        }
    }, {
        '$unwind': {
            'path': '$genres',
            'preserveNullAndEmptyArrays': False
        }
    }, {
        '$group': {
            '_id': '$genres',
            'averageActors': {
                '$avg': {
                    '$size': '$actors'
                }
            }
        }
    }
])

genre_names = []
average_actors = []

for genre in data:
    genre_names.append(genre['_id'])
    average_actors.append(genre['averageActors'])

plot.title("Q4 - 2")
plot.bar(genre_names, average_actors)

plot.show()