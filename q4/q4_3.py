from pymongo import MongoClient
import numpy as np
import matplotlib.pyplot as plot

client = MongoClient()
db = client['imdb']
movies = db['movies2']

print("Querying MongoDB. Please wait...")
data = movies.aggregate([
    {
        '$match': {
            'startYear': {
                '$exists': True
            }
        }
    }, {
        '$group': {
            '_id': '$startYear',
            'count': {
                '$sum': 1
            }
        }
    }, {
        '$sort': {
            '_id': 1
        }
    }
])

years = []
movie_count = []

for year in data:
    years.append(year['_id'])
    movie_count.append(year['count'])

plot.title("Q4 - 3")
plot.plot(years, movie_count)
plot.xticks(np.arange(min(years), max(years) + 1, 8))
plot.show()
