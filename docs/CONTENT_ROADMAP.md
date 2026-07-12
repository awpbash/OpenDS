<!-- GENERATED FILE, do not edit by hand. -->
<!-- Regenerate with: pnpm roadmap -->
<!-- Topic list source: packages/graph/src/planned.ts -->
<!-- Progress source: content/concepts frontmatter -->

# Content roadmap

The plain-text view of the [knowledge map](../packages/graph/src/planned.ts).
2 of 111 topics have articles.

Every unchecked topic is an open invitation. To claim one, say so in the
group chat or open a draft PR, then start with:

```bash
pnpm new:concept <slug> <your-contributor-id>
```

A topic earns a node on the map when it can fill a rigorous 15 to 25
minute article without padding, an interviewer would ask about it by
name, and at least one other node needs it first. To add or reshape
topics, edit `packages/graph/src/planned.ts` and rerun `pnpm roadmap`.

New to the field? Start here: `what-is-data`, `types-of-data`, `exploratory-data-analysis`.

## Foundations (1/6)

- [x] **What Is Data?** `what-is-data` **Draft.**
- [ ] **Types of Data** `types-of-data` needs `what-is-data`
- [ ] **Exploratory Data Analysis** `exploratory-data-analysis` needs `types-of-data`
- [ ] **Missing Data** `missing-data` needs `exploratory-data-analysis`
- [ ] **Outliers** `outliers` needs `exploratory-data-analysis`
- [ ] **Data Visualisation** `data-visualisation` needs `exploratory-data-analysis`

## Probability & Statistics (0/18)

- [ ] **Probability Basics** `probability-basics`
- [ ] **Random Variables** `random-variables` needs `probability-basics`
- [ ] **Distributions** `distributions` needs `random-variables`
- [ ] **Expectation and Variance** `expectation-and-variance` needs `random-variables`
- [ ] **Bayes' Theorem** `bayes-theorem` needs `probability-basics`
- [ ] **Mean, Median, and Mode** `mean-median-mode` needs `exploratory-data-analysis`
- [ ] **Variance and Spread** `variance-and-spread` needs `mean-median-mode`
- [ ] **Correlation** `correlation` needs `variance-and-spread`
- [ ] **Sampling and Bias** `sampling-and-bias` needs `what-is-data`
- [ ] **The Central Limit Theorem** `central-limit-theorem` needs `distributions`, `expectation-and-variance`
- [ ] **Estimation and Confidence Intervals** `estimation-and-confidence-intervals` needs `central-limit-theorem`
- [ ] **Hypothesis Testing** `hypothesis-testing` needs `estimation-and-confidence-intervals`
- [ ] **P-Values and Significance** `p-values-and-significance` needs `hypothesis-testing`
- [ ] **Statistical Power** `statistical-power` needs `hypothesis-testing`
- [ ] **A/B Testing** `ab-testing` needs `hypothesis-testing`, `sampling-and-bias`
- [ ] **Experiment Pitfalls** `experiment-pitfalls` needs `ab-testing`, `p-values-and-significance`
- [ ] **Maximum Likelihood** `maximum-likelihood` needs `distributions`, `derivatives-gradients-chain-rule`
- [ ] **Bootstrap and Resampling** `bootstrap-and-resampling` needs `estimation-and-confidence-intervals`

## Linear Algebra & Optimization (0/8)

- [ ] **Vectors and Matrices** `vectors-and-matrices`
- [ ] **Matrix Multiplication** `matrix-multiplication` needs `vectors-and-matrices`
- [ ] **Eigenvalues and Eigenvectors** `eigenvalues-and-eigenvectors` needs `matrix-multiplication`
- [ ] **Derivatives, Gradients, and the Chain Rule** `derivatives-gradients-chain-rule`
- [ ] **Convexity** `convexity` needs `derivatives-gradients-chain-rule`
- [ ] **Gradient Descent** `gradient-descent` needs `derivatives-gradients-chain-rule`, `loss-functions`
- [ ] **Stochastic Gradient Descent** `stochastic-gradient-descent` needs `gradient-descent`
- [ ] **Optimizers: Momentum and Adam** `optimizers-momentum-and-adam` needs `stochastic-gradient-descent`

## Machine Learning (0/25)

- [ ] **Prediction and Error** `prediction-error` needs `correlation`
- [ ] **Train / Validation / Test Split** `train-validation-test-split` needs `prediction-error`
- [ ] **Data Leakage** `data-leakage` needs `train-validation-test-split`
- [ ] **The Bias-Variance Tradeoff** `bias-variance-tradeoff` needs `prediction-error`
- [ ] **Cross-Validation** `cross-validation` needs `train-validation-test-split`
- [ ] **Linear Regression** `linear-regression` needs `correlation`, `prediction-error`
- [ ] **Loss Functions** `loss-functions` needs `linear-regression`
- [ ] **Logistic Regression** `logistic-regression` needs `linear-regression`
- [ ] **Cross-Entropy and Log-Likelihood** `cross-entropy-and-log-likelihood` needs `maximum-likelihood`, `logistic-regression`
- [ ] **Regularization** `regularization` needs `linear-regression`, `bias-variance-tradeoff`
- [ ] **Feature Engineering** `feature-engineering` needs `exploratory-data-analysis`
- [ ] **Feature Scaling and Encoding** `feature-scaling-and-encoding` needs `feature-engineering`
- [ ] **Decision Trees** `decision-trees` needs `prediction-error`
- [ ] **Ensembles and Bagging** `ensembles-and-bagging` needs `decision-trees`
- [ ] **Random Forests** `random-forests` needs `ensembles-and-bagging`
- [ ] **Gradient Boosting** `gradient-boosting` needs `ensembles-and-bagging`, `gradient-descent`
- [ ] **K-Nearest Neighbors** `k-nearest-neighbors` needs `feature-scaling-and-encoding`
- [ ] **Support Vector Machines** `support-vector-machines` needs `linear-regression`, `regularization`
- [ ] **Naive Bayes** `naive-bayes` needs `bayes-theorem`
- [ ] **K-Means and Clustering** `kmeans-clustering` needs `feature-scaling-and-encoding`
- [ ] **PCA and Dimensionality Reduction** `pca` needs `eigenvalues-and-eigenvectors`, `feature-scaling-and-encoding`
- [ ] **Classification Metrics** `classification-metrics` needs `logistic-regression`
- [ ] **Calibration** `calibration` needs `classification-metrics`
- [ ] **Class Imbalance** `class-imbalance` needs `classification-metrics`
- [ ] **Hyperparameter Tuning** `hyperparameter-tuning` needs `cross-validation`

## Time Series (0/5)

- [ ] **Time Series Basics** `time-series-basics` needs `exploratory-data-analysis`
- [ ] **Stationarity and Autocorrelation** `stationarity-and-autocorrelation` needs `time-series-basics`, `correlation`
- [ ] **Smoothing and Moving Averages** `smoothing-and-moving-averages` needs `time-series-basics`
- [ ] **ARIMA** `arima` needs `stationarity-and-autocorrelation`
- [ ] **Forecast Evaluation and Backtesting** `forecast-backtesting` needs `time-series-basics`, `train-validation-test-split`

## Recommender Systems (0/6)

- [ ] **Collaborative Filtering** `collaborative-filtering` needs `correlation`
- [ ] **Matrix Factorization** `matrix-factorization` needs `collaborative-filtering`, `matrix-multiplication`
- [ ] **Content-Based Filtering** `content-based-filtering` needs `feature-engineering`
- [ ] **Ranking Metrics** `ranking-metrics` needs `classification-metrics`
- [ ] **Embedding-Based Retrieval** `embedding-based-retrieval` needs `embeddings`, `matrix-factorization`
- [ ] **The Cold-Start Problem** `cold-start` needs `collaborative-filtering`

## Deep Learning (1/12)

- [ ] **Neural Networks** `neural-networks` needs `logistic-regression`, `gradient-descent`
- [ ] **Backpropagation** `backpropagation` needs `neural-networks`, `derivatives-gradients-chain-rule`
- [ ] **Activation Functions** `activation-functions` needs `neural-networks`
- [ ] **Training Neural Networks** `training-neural-networks` needs `backpropagation`, `optimizers-momentum-and-adam`
- [ ] **Regularization in Deep Learning** `regularization-in-deep-learning` needs `neural-networks`, `regularization`
- [ ] **Normalization Layers** `normalization-layers` needs `training-neural-networks`
- [ ] **Embeddings** `embeddings` needs `neural-networks`
- [ ] **Recurrent Neural Networks** `rnn` needs `neural-networks`, `backpropagation`
- [ ] **LSTM and GRU** `lstm-and-gru` needs `rnn`
- [ ] **Encoder-Decoder Architectures** `encoder-decoder` needs `lstm-and-gru`
- [ ] **Attention** `attention` needs `encoder-decoder`, `embeddings`
- [x] **Transformers** `transformers` **Draft.** needs `attention`, `embeddings`, `gradient-descent`

## NLP (0/4)

- [ ] **Tokenization** `tokenization` needs `types-of-data`
- [ ] **Bag-of-Words and TF-IDF** `bag-of-words-and-tfidf` needs `feature-engineering`
- [ ] **Word Embeddings** `word-embeddings` needs `embeddings`, `bag-of-words-and-tfidf`
- [ ] **Language Models** `language-models` needs `probability-basics`, `tokenization`

## LLMs & GenAI (0/12)

- [ ] **Pretraining and Next-Token Prediction** `pretraining-and-next-token-prediction` needs `transformers`, `language-models`
- [ ] **Sampling and Decoding** `sampling-and-decoding` needs `language-models`
- [ ] **Prompting and In-Context Learning** `prompting-and-in-context-learning` needs `pretraining-and-next-token-prediction`
- [ ] **Fine-Tuning** `fine-tuning` needs `pretraining-and-next-token-prediction`
- [ ] **LoRA and Parameter-Efficient Fine-Tuning** `lora-and-peft` needs `fine-tuning`
- [ ] **Instruction Tuning and RLHF** `instruction-tuning-and-rlhf` needs `fine-tuning`
- [ ] **Vector Search** `vector-search` needs `embeddings`
- [ ] **Retrieval-Augmented Generation** `rag` needs `prompting-and-in-context-learning`, `vector-search`
- [ ] **Evaluating LLMs** `llm-evaluation` needs `prompting-and-in-context-learning`, `classification-metrics`
- [ ] **Agents and Tool Use** `agents-and-tool-use` needs `prompting-and-in-context-learning`
- [ ] **LLM Inference Optimization** `llm-inference-optimization` needs `transformers`
- [ ] **AI Safety Basics** `ai-safety-basics` needs `instruction-tuning-and-rlhf`

## Computer Vision (0/5)

- [ ] **Image Representation** `image-representation` needs `types-of-data`
- [ ] **Convolutional Networks** `convolutional-networks` needs `neural-networks`, `image-representation`
- [ ] **CNN Architectures** `cnn-architectures` needs `convolutional-networks`
- [ ] **Transfer Learning** `transfer-learning` needs `convolutional-networks`
- [ ] **Data Augmentation** `data-augmentation` needs `convolutional-networks`

## Data Engineering (0/4)

- [ ] **Data Cleaning** `data-cleaning` needs `types-of-data`
- [ ] **Data Pipelines** `data-pipelines` needs `data-cleaning`
- [ ] **Batch vs Streaming** `batch-vs-streaming` needs `data-pipelines`
- [ ] **Storage and File Formats** `storage-and-file-formats` needs `data-pipelines`

## Production ML (0/6)

- [ ] **Model Deployment and Serving** `model-deployment-and-serving` needs `classification-metrics`
- [ ] **Model Monitoring and Drift** `model-monitoring-and-drift` needs `model-deployment-and-serving`
- [ ] **Feature Stores** `feature-stores` needs `feature-engineering`, `data-pipelines`
- [ ] **Experiment Tracking and Reproducibility** `experiment-tracking` needs `cross-validation`
- [ ] **Online Evaluation and Shadow Testing** `online-evaluation` needs `ab-testing`, `model-deployment-and-serving`
- [ ] **ML System Design** `ml-system-design` needs `model-deployment-and-serving`, `feature-stores`
