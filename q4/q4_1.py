from pymongo import MongoClient
import matplotlib.pyplot as plot

# Connect to localhost, default port (27017)
client = MongoClient()
db = client['imdb']
movies = db['movies2']

print("Querying MongoDB. Please wait...")
data = movies.aggregate([
    {
        '$match': {
            'avgRating': {
                '$exists': True
            },
            'numVotes': {
                '$gt': 10000
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
            'avgRatings': {
                '$push': '$avgRating'
            }
        }
    }
])

box_plot_data = []
genre_names = []

for genre in data:
    box_plot_data.append(genre['avgRatings'])
    genre_names.append(genre['_id'])

plot.title("Q4 - 1")
plot.boxplot(box_plot_data, patch_artist=True, labels=genre_names)

plot.show()

