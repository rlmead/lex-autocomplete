import pandas as pd
import tensorflow as tf
import numpy as np
import nltk
from nltk.lm.preprocessing import pad_both_ends
from nltk.lm.preprocessing import flatten
from nltk import ngrams
from nltk import word_tokenize
from nltk.lm.preprocessing import padded_everygram_pipeline
import re

responseDF = pd.read_csv('./data/Codes Summed-Main View.csv')

comment_tokens = [word_tokenize(c) for c in responseDF['Qualitative Response']]
comment_padded = [list(pad_both_ends(c,3)) for c in comment_tokens]
comment_tensors = [tf.convert_to_tensor(c) for c in comment_padded]

ngram_tnsr = tf.strings.ngrams(
    comment_tensors,
    3,
    separator=' ',
    pad_values=("<s>","</s>"),
    padding_width=2,
    preserve_short_sequences=False,
    name=None
    )

print(ngram_tnsr)