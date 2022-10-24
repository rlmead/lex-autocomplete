## ----------------------------------------------------------------------------------------------------------------------------------
## # ensure renv is activated
## # source(".Rprofile)
## renv::refresh()


## ----------------------------------------------------------------------------------------------------------------------------------
library(dplyr)
library(readr)
library(stringr)
library(purrr)
library(tidyr)
library(rjson)


## ----------------------------------------------------------------------------------------------------------------------------------
library(spacyr)


## conda create --yes --name spacy_condaenv python=3.8 spacy -c conda-forge

## conda activate spacy_condaenv

## python -m spacy download en_core_web_trf

## # fallback

## # python -m spacy download en_core_web_sm


## ----------------------------------------------------------------------------------------------------------------------------------
spacy_install(lang_models = "en_core_web_trf")
## # fallback
## # spacy_install(lang_models = "en_core_web_sm")


## ----------------------------------------------------------------------------------------------------------------------------------
spacy_initialize(model = "en_core_web_trf")
# fallback
# spacy_initialize(model = "en_core_web_sm)


## ----------------------------------------------------------------------------------------------------------------------------------
dat <- read_csv("../data/Codes Summed-Main View.csv") %>%
          rename_with(~tolower(gsub("\\s", "_", .x)))


## ----------------------------------------------------------------------------------------------------------------------------------
nrow(dat) == length(unique(dat$response))
nrow(dat)


## ----------------------------------------------------------------------------------------------------------------------------------
dat %>%
  select(response, qualitative_response) %>%
  mutate(qualitative_response = str_replace_all(qualitative_response, "\\s+", " "))-> corpus


## ----------------------------------------------------------------------------------------------------------------------------------
Sys.setenv(TOKENIZERS_PARALLELISM="false")
comment_parse <- spacy_parse(corpus$qualitative_response)


## ----------------------------------------------------------------------------------------------------------------------------------
#' Pad comments for ngram
#' 
#' Function expects a data frame output from \code{spacy_parse()} that has had its
#' entities consolidated
#' 
#' @param df a df outpuyt from \code{spacy_parse()}
#' @param n the pad size (should be ngram size minus one)
#' @start_symbol the start of sequence symbol
#' @end_symbol the end of sequence symbol
#' 
#' @returns The same df, but padded out with \code{start_symbok} and \code{end_symbol}
pad_df <- function(df, n = 2, start_symbol = "<s>", end_symbol = "</s>"){
  start_pad <- tibble(token = rep(start_symbol, times = n))
  end_pad <- tibble(token = rep(end_symbol, times = n))
  out <- bind_rows(start_pad, df, end_pad) %>%
          replace_na(list(sentence_id = 0, token_id = 0, pos = '', 
                          entity_type = '', dir = '')) %>%
          mutate(lemma = token)
  return(out)
}


## ----------------------------------------------------------------------------------------------------------------------------------
types_to_titlecase <- c("EVENT", "FAC", "GPE", "LANGUAGE", "LAW", "LOC", "NORP",
                          "ORG", "PERSON", "PRODUCT", "WORK_OF_ART")


## ----------------------------------------------------------------------------------------------------------------------------------
comment_parse %>%
  mutate(token = case_when(entity != '' & token == "Ave" ~ "Avenue",
                           entity != '' & token == "Pkwy" ~ "Parkway",
                           entity != '' & token == "Rd" ~ "Road",
                           entity != '' & token == "rd" ~ "Road",
                           entity != '' & token == "St." ~ "Street" ,
                           TRUE ~ token)) %>%
  entity_consolidate(concatenator = " ") %>%
  mutate(token = case_when(entity_type != '' & 
                             str_detect(token, 
                                        "^[Ll][Ee][Xx]\\W*[Tt][Rr][Aa][Nn]$") ~ "Lextran",
                           entity_type %in% types_to_titlecase &
                             !str_detect(token, "^[:upper:]+$") ~ str_to_title(token),
                           pos == "PRON" & str_detect(token, "^[Ii]$") ~ "I",
                           TRUE ~ tolower(token)))->consolidated


## ----------------------------------------------------------------------------------------------------------------------------------
# consolidated %>%
#   filter(str_detect(token, "'\\w+?")) %>%
#   count(token) %>%
#   arrange(desc(n)) %>%
#   slice(1:7) %>%
#   select(-n) %>%
#   write_csv(file = "../data/00_leaners.csv")


## ----------------------------------------------------------------------------------------------------------------------------------
# consolidated %>%
#   filter(pos == "PUNCT") %>%
#   count(token) %>%
#   arrange(desc(n)) %>%
#   select(-n) %>%
#   write_csv("../data/01_leaners.csv")


## ----------------------------------------------------------------------------------------------------------------------------------
# consolidated %>%
#   filter(str_detect(token, "’\\w+?")) %>%
#   count(token) %>%
#   arrange(desc(n)) %>%
#   select(-n) %>%
#   mutate(dir = "<") %>%
#   slice(1:7) %>%
#   write_csv(file = "../data/02_leaners.csv")


## ----------------------------------------------------------------------------------------------------------------------------------
lean_df <- map_dfr(list.files(path = "../data/", pattern = "*_leaners.csv", full.names = T), read_csv)


## ----------------------------------------------------------------------------------------------------------------------------------
consolidated %>%
  mutate(id = 1:n())%>%
  left_join(lean_df) %>%
  replace_na(list(dir = "")) %>%
  mutate(token = str_replace_all(token, "[’‘]", "'"),
         token = str_replace_all(token, "[“”]", '"')) -> lean_coded



## ----------------------------------------------------------------------------------------------------------------------------------
lean_coded %>%
  arrange(id) %>%
  group_by(doc_id) %>%
  nest() %>%
  mutate(padded = map(data, pad_df)) -> pad_nest


## ----------------------------------------------------------------------------------------------------------------------------------
pad_nest %>%
  select(-data) %>%
  unnest(padded) %>%
  select(doc_id, token, pos, entity_type, dir) %>%
  group_by(doc_id) %>%
  mutate(word_i = lag(token, 2),
         word_j = lag(token, 1),
         word_k = token) %>%
  drop_na()-> trigrams


## ----------------------------------------------------------------------------------------------------------------------------------
trigrams %>%
  ungroup() %>%
  count(word_i, word_j) %>%
  rename(bigram_count = n)-> bigram_count


## ----------------------------------------------------------------------------------------------------------------------------------
trigrams %>%
 ungroup() %>%
 count(word_i, word_j, word_k, dir) %>%
 rename(trigram_count = n) -> trigram_count


## ----------------------------------------------------------------------------------------------------------------------------------
trigram_count %>%
  left_join(bigram_count) %>%
  mutate(cond_prob = trigram_count/bigram_count)->model


## ----------------------------------------------------------------------------------------------------------------------------------
model %>%
  filter(word_i == "<s>", word_j == "<s>") %>%
  sample_n(size = 1, weight = cond_prob)


## ----------------------------------------------------------------------------------------------------------------------------------
#' generate a sequence from a trigram model df
#' 
#' @param df The data frame containing the trigram model
#' @param w_i The n-2th word
#' @param w_j The n-1th word
#' @param max a max length of a comment
#' 
#' @returns A concatenated comment string
generate <- function(df, w_i = "<s>", w_j = "<s>", max = 10000){
  out <- vector()
  x = 0
  stop = FALSE
  while(x < max & !stop){
    sample = df %>% 
                filter(word_i == w_i, word_j == w_j) %>% 
                slice_sample(n = 1, weight_by = cond_prob)
    if(sample$word_k == "</s>") {
      stop = TRUE
      break
    }
    if(length(out) == 0){
      paste_word = str_to_title(sample$word_k)
    }else if (w_j %in% c(".", "?", "!")){
      paste_word = str_to_title(sample$word_k)
    }else{
      paste_word = sample$word_k
    }
    left_side <- NULL
    if(length(out) > 0){
      if(rev(out)[1] == ""){
        left_side <- NULL
      }else if(str_detect(sample$dir, "<")){
        left_side <- NULL
      }else{
        left_side <- " "
      }
    }
    if(str_detect(sample$dir, ">")){
      right_side <- ""
    }else{
      right_side <- NULL
    }
    out <- c(out, left_side, paste_word, right_side)
    w_i = w_j
    w_j = sample$word_k
    x = x+1
  }
  return(str_c(out, collapse = ""))
}


## ----------------------------------------------------------------------------------------------------------------------------------
generate(model)


## ----------------------------------------------------------------------------------------------------------------------------------
model %>%
  group_by(word_i, word_j) %>%
  arrange(cond_prob) %>%
  mutate(sum_prob = cumsum(cond_prob)) ->model_prep


## ----------------------------------------------------------------------------------------------------------------------------------
outer_list <- list()


## ----------------------------------------------------------------------------------------------------------------------------------
model_prep %>%
  group_by(word_i, word_j) %>%
  nest() %>%
  group_by(word_i) %>%
  nest() -> all_nest


## ----------------------------------------------------------------------------------------------------------------------------------
for(i in seq_along(all_nest$word_i)){
  w_i <- all_nest$word_i[i]
  outer_list[[w_i]] <- list()
  inner_j <- all_nest$data[[i]]
  for(j in seq_along(inner_j$word_j)){
    w_j <- inner_j$word_j[j]
    outer_list[[w_i]][[w_j]] <- list()
    inner_k <- inner_j$data[[j]]
    
    outer_list[[w_i]][[w_j]][["next_word"]] <- inner_k$word_k
    outer_list[[w_i]][[w_j]][["sum_prob"]] <- inner_k$sum_prob
    outer_list[[w_i]][[w_j]][["cond_prob"]] <- inner_k$cond_prob
    outer_list[[w_i]][[w_j]][["lean"]] <- inner_k$dir
  }
}


## ----------------------------------------------------------------------------------------------------------------------------------
jsonData <- toJSON(outer_list, indent = 2)


## ----------------------------------------------------------------------------------------------------------------------------------
## write(jsonData, file = "../data/model.json")

