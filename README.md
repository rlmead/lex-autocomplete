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
