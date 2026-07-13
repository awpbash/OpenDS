<!-- GENERATED FILE, do not edit by hand. -->
<!-- Regenerate with: pnpm roadmap -->
<!-- Topic list source: packages/graph/src/planned.ts -->
<!-- Progress source: content/concepts frontmatter -->

# Content roadmap

The plain-text view of the [knowledge map](../packages/graph/src/planned.ts).
2 of 148 topics have articles.

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

## Probability & Statistics (0/26)

- [ ] **Probability Basics** `probability-basics`
- [ ] **Conditional Probability and Independence** `conditional-probability-and-independence` needs `probability-basics`
- [ ] **Random Variables** `random-variables` needs `probability-basics`
- [ ] **Distributions** `distributions` needs `random-variables`
- [ ] **Expectation and Variance** `expectation-and-variance` needs `random-variables`
- [ ] **Entropy and Information** `entropy-and-information` needs `distributions`
- [ ] **Bayes' Theorem** `bayes-theorem` needs `conditional-probability-and-independence`
- [ ] **Mean, Median, and Mode** `mean-median-mode` needs `exploratory-data-analysis`
- [ ] **Variance and Spread** `variance-and-spread` needs `mean-median-mode`
- [ ] **Correlation** `correlation` needs `variance-and-spread`
- [ ] **Skewness and Kurtosis** `skewness-and-kurtosis` needs `variance-and-spread`, `distributions`
- [ ] **Correlation vs Causation** `correlation-vs-causation` needs `correlation`
- [ ] **Sampling and Bias** `sampling-and-bias` needs `what-is-data`
- [ ] **The Central Limit Theorem** `central-limit-theorem` needs `distributions`, `expectation-and-variance`
- [ ] **Estimation and Confidence Intervals** `estimation-and-confidence-intervals` needs `central-limit-theorem`
- [ ] **Hypothesis Testing** `hypothesis-testing` needs `estimation-and-confidence-intervals`
- [ ] **P-Values and Significance** `p-values-and-significance` needs `hypothesis-testing`
- [ ] **Statistical Power** `statistical-power` needs `hypothesis-testing`
- [ ] **Choosing a Statistical Test** `choosing-a-statistical-test` needs `hypothesis-testing`, `skewness-and-kurtosis`
- [ ] **The Multiple Comparisons Problem** `multiple-comparisons` needs `p-values-and-significance`
- [ ] **A/B Testing** `ab-testing` needs `sampling-and-bias`, `choosing-a-statistical-test`, `correlation-vs-causation`
- [ ] **Experiment Pitfalls** `experiment-pitfalls` needs `ab-testing`, `statistical-power`, `multiple-comparisons`
- [ ] **Causal Inference Methods** `causal-inference-methods` needs `correlation-vs-causation`, `ab-testing`
- [ ] **Multi-Armed Bandits** `multi-armed-bandits` needs `ab-testing`
- [ ] **Maximum Likelihood** `maximum-likelihood` needs `distributions`, `derivatives-gradients-chain-rule`
- [ ] **Bootstrap and Resampling** `bootstrap-and-resampling` needs `estimation-and-confidence-intervals`

## Linear Algebra & Optimization (0/10)

- [ ] **Vectors and Matrices** `vectors-and-matrices`
- [ ] **Norms and Distances** `norms-and-distances` needs `vectors-and-matrices`
- [ ] **Matrix Multiplication** `matrix-multiplication` needs `vectors-and-matrices`
- [ ] **Eigenvalues and Eigenvectors** `eigenvalues-and-eigenvectors` needs `matrix-multiplication`
- [ ] **SVD and Matrix Decompositions** `svd` needs `eigenvalues-and-eigenvectors`
- [ ] **Derivatives, Gradients, and the Chain Rule** `derivatives-gradients-chain-rule`
- [ ] **Convexity** `convexity` needs `derivatives-gradients-chain-rule`
- [ ] **Gradient Descent** `gradient-descent` needs `derivatives-gradients-chain-rule`, `convexity`, `loss-functions`
- [ ] **Stochastic Gradient Descent** `stochastic-gradient-descent` needs `gradient-descent`
- [ ] **Optimizers: Momentum and Adam** `optimizers-momentum-and-adam` needs `stochastic-gradient-descent`

## Machine Learning (0/33)

- [ ] **Prediction and Error** `prediction-error` needs `correlation`
- [ ] **Train / Validation / Test Split** `train-validation-test-split` needs `prediction-error`
- [ ] **Data Leakage** `data-leakage` needs `train-validation-test-split`
- [ ] **The Bias-Variance Tradeoff** `bias-variance-tradeoff` needs `prediction-error`
- [ ] **Cross-Validation** `cross-validation` needs `train-validation-test-split`
- [ ] **Linear Regression** `linear-regression` needs `correlation`, `prediction-error`
- [ ] **Regression Assumptions and Diagnostics** `regression-diagnostics` needs `linear-regression`
- [ ] **Multicollinearity** `multicollinearity` needs `regression-diagnostics`, `correlation`
- [ ] **Loss Functions** `loss-functions` needs `linear-regression`
- [ ] **Logistic Regression** `logistic-regression` needs `linear-regression`
- [ ] **Cross-Entropy and Log-Likelihood** `cross-entropy-and-log-likelihood` needs `maximum-likelihood`, `logistic-regression`, `entropy-and-information`
- [ ] **Regularization** `regularization` needs `bias-variance-tradeoff`, `multicollinearity`, `norms-and-distances`
- [ ] **Feature Engineering** `feature-engineering` needs `exploratory-data-analysis`
- [ ] **Feature Scaling and Encoding** `feature-scaling-and-encoding` needs `feature-engineering`
- [ ] **Feature Selection** `feature-selection` needs `feature-engineering`, `correlation`
- [ ] **Decision Trees** `decision-trees` needs `prediction-error`, `entropy-and-information`
- [ ] **Ensembles and Bagging** `ensembles-and-bagging` needs `decision-trees`
- [ ] **Random Forests** `random-forests` needs `ensembles-and-bagging`
- [ ] **Gradient Boosting** `gradient-boosting` needs `ensembles-and-bagging`, `gradient-descent`
- [ ] **Model Interpretability** `model-interpretability` needs `gradient-boosting`
- [ ] **K-Nearest Neighbors** `k-nearest-neighbors` needs `feature-scaling-and-encoding`, `norms-and-distances`
- [ ] **Support Vector Machines** `support-vector-machines` needs `linear-regression`, `regularization`
- [ ] **Naive Bayes** `naive-bayes` needs `bayes-theorem`
- [ ] **K-Means Clustering** `kmeans-clustering` needs `feature-scaling-and-encoding`
- [ ] **Clustering Beyond K-Means** `clustering-beyond-kmeans` needs `kmeans-clustering`
- [ ] **Anomaly Detection** `anomaly-detection` needs `outliers`, `kmeans-clustering`
- [ ] **The Curse of Dimensionality** `curse-of-dimensionality` needs `norms-and-distances`
- [ ] **PCA and Dimensionality Reduction** `pca` needs `svd`, `feature-scaling-and-encoding`, `curse-of-dimensionality`
- [ ] **Classification Metrics** `classification-metrics` needs `logistic-regression`
- [ ] **Calibration** `calibration` needs `classification-metrics`
- [ ] **Class Imbalance** `class-imbalance` needs `classification-metrics`
- [ ] **Hyperparameter Tuning** `hyperparameter-tuning` needs `cross-validation`
- [ ] **Reinforcement Learning Basics** `reinforcement-learning-basics` needs `expectation-and-variance`, `gradient-descent`

## Time Series (0/6)

- [ ] **Time Series Basics** `time-series-basics` needs `exploratory-data-analysis`
- [ ] **Stationarity and Autocorrelation** `stationarity-and-autocorrelation` needs `time-series-basics`, `correlation`
- [ ] **Smoothing and Moving Averages** `smoothing-and-moving-averages` needs `time-series-basics`
- [ ] **Seasonality and Decomposition** `seasonality-and-decomposition` needs `time-series-basics`
- [ ] **ARIMA** `arima` needs `stationarity-and-autocorrelation`, `seasonality-and-decomposition`
- [ ] **Forecast Evaluation and Backtesting** `forecast-backtesting` needs `time-series-basics`, `train-validation-test-split`

## Recommender Systems (0/7)

- [ ] **Collaborative Filtering** `collaborative-filtering` needs `correlation`
- [ ] **Matrix Factorization** `matrix-factorization` needs `collaborative-filtering`, `svd`
- [ ] **Content-Based Filtering** `content-based-filtering` needs `feature-engineering`
- [ ] **Ranking Metrics** `ranking-metrics` needs `classification-metrics`
- [ ] **Learning to Rank** `learning-to-rank` needs `ranking-metrics`, `gradient-boosting`
- [ ] **Embedding-Based Retrieval** `embedding-based-retrieval` needs `embeddings`, `matrix-factorization`
- [ ] **The Cold-Start Problem** `cold-start` needs `collaborative-filtering`, `content-based-filtering`

## Deep Learning (1/16)

- [ ] **Neural Networks** `neural-networks` needs `logistic-regression`, `gradient-descent`
- [ ] **Backpropagation** `backpropagation` needs `neural-networks`, `derivatives-gradients-chain-rule`
- [ ] **Activation Functions** `activation-functions` needs `neural-networks`
- [ ] **Training Neural Networks** `training-neural-networks` needs `backpropagation`, `optimizers-momentum-and-adam`, `activation-functions`
- [ ] **Regularization in Deep Learning** `regularization-in-deep-learning` needs `neural-networks`, `regularization`
- [ ] **Normalization Layers** `normalization-layers` needs `training-neural-networks`
- [ ] **Embeddings** `embeddings` needs `neural-networks`
- [ ] **Autoencoders** `autoencoders` needs `neural-networks`
- [ ] **Recurrent Neural Networks** `rnn` needs `neural-networks`, `backpropagation`
- [ ] **LSTM and GRU** `lstm-and-gru` needs `rnn`
- [ ] **Encoder-Decoder Architectures** `encoder-decoder` needs `lstm-and-gru`
- [ ] **Attention** `attention` needs `encoder-decoder`, `embeddings`
- [ ] **Generative Adversarial Networks** `gans` needs `training-neural-networks`
- [ ] **Diffusion Models** `diffusion-models` needs `autoencoders`, `training-neural-networks`
- [ ] **Contrastive Learning** `contrastive-learning` needs `embeddings`, `data-augmentation`
- [x] **Transformers** `transformers` **Draft.** needs `attention`, `embeddings`, `gradient-descent`

## NLP (0/6)

- [ ] **Tokenization** `tokenization` needs `types-of-data`
- [ ] **Bag-of-Words and TF-IDF** `bag-of-words-and-tfidf` needs `feature-engineering`
- [ ] **Text Classification** `text-classification` needs `bag-of-words-and-tfidf`, `classification-metrics`
- [ ] **Word Embeddings** `word-embeddings` needs `embeddings`, `bag-of-words-and-tfidf`
- [ ] **Language Models** `language-models` needs `probability-basics`, `tokenization`
- [ ] **Encoder Models and BERT** `encoder-models` needs `transformers`

## LLMs & GenAI (0/16)

- [ ] **Pretraining and Next-Token Prediction** `pretraining-and-next-token-prediction` needs `transformers`, `language-models`
- [ ] **Scaling Laws** `scaling-laws` needs `pretraining-and-next-token-prediction`
- [ ] **Mixture of Experts** `mixture-of-experts` needs `transformers`, `scaling-laws`
- [ ] **Sampling and Decoding** `sampling-and-decoding` needs `language-models`
- [ ] **Prompting and In-Context Learning** `prompting-and-in-context-learning` needs `pretraining-and-next-token-prediction`
- [ ] **Fine-Tuning** `fine-tuning` needs `pretraining-and-next-token-prediction`, `transfer-learning`
- [ ] **LoRA and Parameter-Efficient Fine-Tuning** `lora-and-peft` needs `fine-tuning`
- [ ] **Instruction Tuning and RLHF** `instruction-tuning-and-rlhf` needs `fine-tuning`, `reinforcement-learning-basics`
- [ ] **Vector Search** `vector-search` needs `embeddings`, `norms-and-distances`, `encoder-models`
- [ ] **Retrieval-Augmented Generation** `rag` needs `prompting-and-in-context-learning`, `vector-search`
- [ ] **Evaluating LLMs** `llm-evaluation` needs `prompting-and-in-context-learning`, `classification-metrics`
- [ ] **Agents and Tool Use** `agents-and-tool-use` needs `prompting-and-in-context-learning`
- [ ] **LLM Inference Optimization** `llm-inference-optimization` needs `transformers`, `sampling-and-decoding`
- [ ] **Knowledge Distillation** `knowledge-distillation` needs `training-neural-networks`
- [ ] **Multimodal Models** `multimodal-models` needs `contrastive-learning`, `transformers`
- [ ] **AI Safety Basics** `ai-safety-basics` needs `instruction-tuning-and-rlhf`

## Computer Vision (0/8)

- [ ] **Image Representation** `image-representation` needs `types-of-data`
- [ ] **Convolutional Networks** `convolutional-networks` needs `neural-networks`, `image-representation`
- [ ] **CNN Architectures** `cnn-architectures` needs `convolutional-networks`
- [ ] **Transfer Learning** `transfer-learning` needs `convolutional-networks`
- [ ] **Data Augmentation** `data-augmentation` needs `convolutional-networks`
- [ ] **Object Detection** `object-detection` needs `cnn-architectures`
- [ ] **Image Segmentation** `image-segmentation` needs `object-detection`
- [ ] **Vision Transformers** `vision-transformers` needs `transformers`, `convolutional-networks`

## Data Engineering (0/7)

- [ ] **Data Cleaning** `data-cleaning` needs `types-of-data`, `missing-data`, `outliers`
- [ ] **Relational Data and SQL** `relational-data-and-sql` needs `types-of-data`
- [ ] **Data Pipelines** `data-pipelines` needs `data-cleaning`, `relational-data-and-sql`
- [ ] **Batch vs Streaming** `batch-vs-streaming` needs `data-pipelines`
- [ ] **Storage and File Formats** `storage-and-file-formats` needs `data-pipelines`
- [ ] **Data Warehouses and Lakes** `data-warehouses-and-lakes` needs `relational-data-and-sql`, `storage-and-file-formats`
- [ ] **Distributed Data Processing** `distributed-data-processing` needs `batch-vs-streaming`

## Production ML (0/7)

- [ ] **Model Deployment and Serving** `model-deployment-and-serving` needs `classification-metrics`
- [ ] **Model Monitoring and Drift** `model-monitoring-and-drift` needs `model-deployment-and-serving`
- [ ] **Feature Stores** `feature-stores` needs `feature-engineering`, `data-pipelines`
- [ ] **Experiment Tracking and Reproducibility** `experiment-tracking` needs `cross-validation`
- [ ] **Online Evaluation and Shadow Testing** `online-evaluation` needs `ab-testing`, `model-deployment-and-serving`
- [ ] **ML System Design** `ml-system-design` needs `model-deployment-and-serving`, `feature-stores`
- [ ] **Fairness and Bias in ML** `fairness-and-bias-in-ml` needs `classification-metrics`, `sampling-and-bias`
