conda create --yes --name spacy_condaenv python=3.8 spacy -c conda-forge
conda activate spacy_condaenv
python -m spacy download en_core_web_trf
# fallback
# python -m spacy download en_core_web_sm