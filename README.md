# bd-assignment-6
Data cleaning assingnment of Big Data.

## Required applications:
* MongoDB v4.x.x
* npm v6.x.x
* NodeJS v12.x.x

## Test if connection to MongoDB is successful - Will work only if MongoDB is running locally on port 27017
* Open a terminal in the root of the repo.
* Execute the following:
```bash
npm test
```

## Q1: Details about file. 
Find `q1.md` in the root of repo.

## Q2: Update movies with extra-data using _id
Make sure you have the extracted data in ```./data/extra-data.json```
Also, to make sure there is distinction in data updated in q2 and q3, I have used collection `movies2` to update in q2. Therefore, you need to have `movies` data in `movies2` collection.
* Open a terminal in the root of the repo.
* Execute the following:
```bash
npm run-script q2
```

## Q3: Update movies with extra-data using title
Make sure you have the extracted data in ```./data/extra-data.json```
Also, to make sure there is distinction in data updated in q2 and q3, I have used collection `movies3` to update in q3. Therefore, you need to have `movies` data in `movies3` collection.
* Open a terminal in the root of the repo.
* Execute the following:
```bash
npm run-script q3
```