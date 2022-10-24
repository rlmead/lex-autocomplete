# OTT Prediction

A text prediction project based on the ideas that residents of Lexington, Kentucky have about their city's future.

The [data used for this project](https://static1.squarespace.com/static/61819f627baf68009186fb50/t/62b236b49282122e7044db59/1655846584979/OTT+Posters+for+Website.pdf) was gathered by [CivicLex](https://www.civiclex.org/) as part of their 2022 [On The Table](https://www.ottlex.org/) project.

## Training the model
### Get the data
Download the `Main View` of the `Codes Summed` sheet in the `OTT Combined Codes` base ([here](https://airtable.com/appp6FXqZn3f9OqZ7/tblCEGDPjQRiqyFKE/viwuISWqMnfkhG1j1?blocks=hide)) as a CSV file, and store it in the `data/` directory (Git will ignore it there).

### Set up your Python environment
1. `python -m venv venv`
1. `source venv/bin/activate`
1. `pip install -r requirements.txt`

## Running the React App locally
### Install dependencies
1. `cd` into this repo's root directory
1. Run `npm install`

### Run the app
Run `npm run start`

## Firebase
This project has been developed with Firebase hosting for the React App. This web app pulls data from a Firebase Realtime Database. That database holds all the n-gram data as output by the R scripts in this repo.

To run and host your own instance of this app your own n-gram model:
1. [Set up your own Firebase project](https://cloud.google.com/firestore/docs/client/get-firebase) with hosting and a Realtime Database
1. Make a file `src/firebaseconfig.json` with your Firebase config variables (see `src/firebaseconfig-example.json` for the formatting and variables you'll need)
1. Store your n-gram json data in `data/model.json`
1. Run `node populate_database.js` to send your n-gram data to your Firebase Realtime Database
