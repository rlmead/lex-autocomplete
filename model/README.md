# Creating the trigram model

This directory contains the code necessary to generate the trigram model and save it as a json file.

## Requirements

The code is written in R, and also relies on the the spacy python package, installed with conda.

-   To install R: <https://cran.r-project.org/>
-   To install conda: <https://docs.conda.io/en/latest/miniconda.html>

If you want to run the code exclusively from the commandline, you'll need to install the `renv` and `reticulate` packages like so:

``` bash
Rscript -e 'install.packages(c("renv", "reticulate"));renv::init();'
```

## Running it from the commandline

Then, you should be able to run the `3gram.R` script, which will install the necessary packages as defined in `renv.lock`.

``` bash
Rscript 3gram.R
```

### Troubles with `spacyr`

The `spacyr` package is supposed to install [the spaCy python package](https://spacy.io/), as well as download its language model. However, I ran into some problems with its default behavior for python versions and my computer, so I did an end run around its defaults and installed spacy and the language model I wanted in the conda environment spacyr was expecting. My steps for doing that are in `spacy_alt_install.sh`

``` bash
source spacy_alt_install.sh
```

## Running it interactively

The way I wrote and ran the code, however, was in the quarto document `3gram.qmd`. You can view and edit it most easily by installing RStudio and opening the `model.Rproj` project. Both `renv` and `reticulate` should be automatically available from the RStudio install.

If you run into trouble with the spacyr install, like mentioned above, you can again run the shell script outside of the RStudio session.

``` bash
source spacy_alt_install.sh
```
