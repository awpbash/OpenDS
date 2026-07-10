/**
 * Planned concepts: the skeleton of the knowledge map.
 *
 * These are topics that do not have articles yet. They exist so the map
 * shows the shape of the field from day one, and so real articles can
 * declare prerequisites that are not written yet. The moment an article
 * lands in content/concepts with one of these slugs, the real node
 * replaces the planned one automatically (merge happens in buildGraph,
 * keyed by slug).
 *
 * This file never duplicates relationships of published content. It only
 * describes content that does not exist yet.
 *
 * Granularity rule (agreed 2026-07): a topic earns a node when it can fill
 * a rigorous 15 to 25 minute article without padding, an interviewer would
 * ask about it by name, and at least one other node needs it first. Merge
 * anything thinner into its parent, and split a node only when a real
 * draft overflows. The target reader should come out prepared for ML
 * engineer, data scientist, and GenAI interview loops.
 */

import type { Family } from "@opends/content-schema";

export interface PlannedConcept {
  slug: string;
  title: string;
  family: Family;
  prerequisites: string[];
}

export const PLANNED_CONCEPTS: PlannedConcept[] = [
  // ── Foundations ────────────────────────────────────────────────────
  {
    slug: "types-of-data",
    title: "Types of Data",
    family: "foundations",
    prerequisites: ["what-is-data"],
  },
  {
    slug: "exploratory-data-analysis",
    title: "Exploratory Data Analysis",
    family: "foundations",
    prerequisites: ["types-of-data"],
  },
  {
    slug: "missing-data",
    title: "Missing Data",
    family: "foundations",
    prerequisites: ["exploratory-data-analysis"],
  },
  {
    slug: "outliers",
    title: "Outliers",
    family: "foundations",
    prerequisites: ["exploratory-data-analysis"],
  },
  {
    slug: "data-visualisation",
    title: "Data Visualisation",
    family: "foundations",
    prerequisites: ["exploratory-data-analysis"],
  },

  // ── Probability & Statistics ───────────────────────────────────────
  {
    slug: "probability-basics",
    title: "Probability Basics",
    family: "probability-statistics",
    prerequisites: [],
  },
  {
    slug: "random-variables",
    title: "Random Variables",
    family: "probability-statistics",
    prerequisites: ["probability-basics"],
  },
  {
    slug: "distributions",
    title: "Distributions",
    family: "probability-statistics",
    prerequisites: ["random-variables"],
  },
  {
    slug: "expectation-and-variance",
    title: "Expectation and Variance",
    family: "probability-statistics",
    prerequisites: ["random-variables"],
  },
  {
    slug: "bayes-theorem",
    title: "Bayes' Theorem",
    family: "probability-statistics",
    prerequisites: ["probability-basics"],
  },
  {
    slug: "mean-median-mode",
    title: "Mean, Median, and Mode",
    family: "probability-statistics",
    prerequisites: ["exploratory-data-analysis"],
  },
  {
    slug: "variance-and-spread",
    title: "Variance and Spread",
    family: "probability-statistics",
    prerequisites: ["mean-median-mode"],
  },
  {
    slug: "correlation",
    title: "Correlation",
    family: "probability-statistics",
    prerequisites: ["variance-and-spread"],
  },
  {
    slug: "sampling-and-bias",
    title: "Sampling and Bias",
    family: "probability-statistics",
    prerequisites: ["what-is-data"],
  },
  {
    slug: "central-limit-theorem",
    title: "The Central Limit Theorem",
    family: "probability-statistics",
    prerequisites: ["distributions", "expectation-and-variance"],
  },
  {
    slug: "estimation-and-confidence-intervals",
    title: "Estimation and Confidence Intervals",
    family: "probability-statistics",
    prerequisites: ["central-limit-theorem"],
  },
  {
    slug: "hypothesis-testing",
    title: "Hypothesis Testing",
    family: "probability-statistics",
    prerequisites: ["estimation-and-confidence-intervals"],
  },
  {
    slug: "p-values-and-significance",
    title: "P-Values and Significance",
    family: "probability-statistics",
    prerequisites: ["hypothesis-testing"],
  },
  {
    slug: "statistical-power",
    title: "Statistical Power",
    family: "probability-statistics",
    prerequisites: ["hypothesis-testing"],
  },
  {
    slug: "ab-testing",
    title: "A/B Testing",
    family: "probability-statistics",
    prerequisites: ["hypothesis-testing", "sampling-and-bias"],
  },
  {
    slug: "experiment-pitfalls",
    title: "Experiment Pitfalls",
    family: "probability-statistics",
    prerequisites: ["ab-testing", "p-values-and-significance"],
  },
  {
    slug: "maximum-likelihood",
    title: "Maximum Likelihood",
    family: "probability-statistics",
    prerequisites: ["distributions", "derivatives-gradients-chain-rule"],
  },
  {
    slug: "bootstrap-and-resampling",
    title: "Bootstrap and Resampling",
    family: "probability-statistics",
    prerequisites: ["estimation-and-confidence-intervals"],
  },

  // ── Linear Algebra & Optimization ──────────────────────────────────
  {
    slug: "vectors-and-matrices",
    title: "Vectors and Matrices",
    family: "linear-algebra-optimization",
    prerequisites: [],
  },
  {
    slug: "matrix-multiplication",
    title: "Matrix Multiplication",
    family: "linear-algebra-optimization",
    prerequisites: ["vectors-and-matrices"],
  },
  {
    slug: "eigenvalues-and-eigenvectors",
    title: "Eigenvalues and Eigenvectors",
    family: "linear-algebra-optimization",
    prerequisites: ["matrix-multiplication"],
  },
  {
    slug: "derivatives-gradients-chain-rule",
    title: "Derivatives, Gradients, and the Chain Rule",
    family: "linear-algebra-optimization",
    prerequisites: [],
  },
  {
    slug: "convexity",
    title: "Convexity",
    family: "linear-algebra-optimization",
    prerequisites: ["derivatives-gradients-chain-rule"],
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    family: "linear-algebra-optimization",
    prerequisites: ["derivatives-gradients-chain-rule", "loss-functions"],
  },
  {
    slug: "stochastic-gradient-descent",
    title: "Stochastic Gradient Descent",
    family: "linear-algebra-optimization",
    prerequisites: ["gradient-descent"],
  },
  {
    slug: "optimizers-momentum-and-adam",
    title: "Optimizers: Momentum and Adam",
    family: "linear-algebra-optimization",
    prerequisites: ["stochastic-gradient-descent"],
  },

  // ── Machine Learning ───────────────────────────────────────────────
  {
    slug: "prediction-error",
    title: "Prediction and Error",
    family: "machine-learning",
    prerequisites: ["correlation"],
  },
  {
    slug: "train-validation-test-split",
    title: "Train / Validation / Test Split",
    family: "machine-learning",
    prerequisites: ["prediction-error"],
  },
  {
    slug: "data-leakage",
    title: "Data Leakage",
    family: "machine-learning",
    prerequisites: ["train-validation-test-split"],
  },
  {
    slug: "bias-variance-tradeoff",
    title: "The Bias-Variance Tradeoff",
    family: "machine-learning",
    prerequisites: ["prediction-error"],
  },
  {
    slug: "cross-validation",
    title: "Cross-Validation",
    family: "machine-learning",
    prerequisites: ["train-validation-test-split"],
  },
  {
    slug: "linear-regression",
    title: "Linear Regression",
    family: "machine-learning",
    prerequisites: ["correlation", "prediction-error"],
  },
  {
    slug: "loss-functions",
    title: "Loss Functions",
    family: "machine-learning",
    prerequisites: ["linear-regression"],
  },
  {
    slug: "logistic-regression",
    title: "Logistic Regression",
    family: "machine-learning",
    prerequisites: ["linear-regression"],
  },
  {
    slug: "cross-entropy-and-log-likelihood",
    title: "Cross-Entropy and Log-Likelihood",
    family: "machine-learning",
    prerequisites: ["maximum-likelihood", "logistic-regression"],
  },
  {
    slug: "regularization",
    title: "Regularization",
    family: "machine-learning",
    prerequisites: ["linear-regression", "bias-variance-tradeoff"],
  },
  {
    slug: "feature-engineering",
    title: "Feature Engineering",
    family: "machine-learning",
    prerequisites: ["exploratory-data-analysis"],
  },
  {
    slug: "feature-scaling-and-encoding",
    title: "Feature Scaling and Encoding",
    family: "machine-learning",
    prerequisites: ["feature-engineering"],
  },
  {
    slug: "decision-trees",
    title: "Decision Trees",
    family: "machine-learning",
    prerequisites: ["prediction-error"],
  },
  {
    slug: "ensembles-and-bagging",
    title: "Ensembles and Bagging",
    family: "machine-learning",
    prerequisites: ["decision-trees"],
  },
  {
    slug: "random-forests",
    title: "Random Forests",
    family: "machine-learning",
    prerequisites: ["ensembles-and-bagging"],
  },
  {
    slug: "gradient-boosting",
    title: "Gradient Boosting",
    family: "machine-learning",
    prerequisites: ["ensembles-and-bagging", "gradient-descent"],
  },
  {
    slug: "k-nearest-neighbors",
    title: "K-Nearest Neighbors",
    family: "machine-learning",
    prerequisites: ["feature-scaling-and-encoding"],
  },
  {
    slug: "support-vector-machines",
    title: "Support Vector Machines",
    family: "machine-learning",
    prerequisites: ["linear-regression", "regularization"],
  },
  {
    slug: "naive-bayes",
    title: "Naive Bayes",
    family: "machine-learning",
    prerequisites: ["bayes-theorem"],
  },
  {
    slug: "kmeans-clustering",
    title: "K-Means and Clustering",
    family: "machine-learning",
    prerequisites: ["feature-scaling-and-encoding"],
  },
  {
    slug: "pca",
    title: "PCA and Dimensionality Reduction",
    family: "machine-learning",
    prerequisites: [
      "eigenvalues-and-eigenvectors",
      "feature-scaling-and-encoding",
    ],
  },
  {
    slug: "classification-metrics",
    title: "Classification Metrics",
    family: "machine-learning",
    prerequisites: ["logistic-regression"],
  },
  {
    slug: "calibration",
    title: "Calibration",
    family: "machine-learning",
    prerequisites: ["classification-metrics"],
  },
  {
    slug: "class-imbalance",
    title: "Class Imbalance",
    family: "machine-learning",
    prerequisites: ["classification-metrics"],
  },
  {
    slug: "hyperparameter-tuning",
    title: "Hyperparameter Tuning",
    family: "machine-learning",
    prerequisites: ["cross-validation"],
  },

  // ── Time Series ────────────────────────────────────────────────────
  {
    slug: "time-series-basics",
    title: "Time Series Basics",
    family: "time-series",
    prerequisites: ["exploratory-data-analysis"],
  },
  {
    slug: "stationarity-and-autocorrelation",
    title: "Stationarity and Autocorrelation",
    family: "time-series",
    prerequisites: ["time-series-basics", "correlation"],
  },
  {
    slug: "smoothing-and-moving-averages",
    title: "Smoothing and Moving Averages",
    family: "time-series",
    prerequisites: ["time-series-basics"],
  },
  {
    slug: "arima",
    title: "ARIMA",
    family: "time-series",
    prerequisites: ["stationarity-and-autocorrelation"],
  },
  {
    slug: "forecast-backtesting",
    title: "Forecast Evaluation and Backtesting",
    family: "time-series",
    prerequisites: ["time-series-basics", "train-validation-test-split"],
  },

  // ── Recommender Systems ────────────────────────────────────────────
  {
    slug: "collaborative-filtering",
    title: "Collaborative Filtering",
    family: "recommender-systems",
    prerequisites: ["correlation"],
  },
  {
    slug: "matrix-factorization",
    title: "Matrix Factorization",
    family: "recommender-systems",
    prerequisites: ["collaborative-filtering", "matrix-multiplication"],
  },
  {
    slug: "content-based-filtering",
    title: "Content-Based Filtering",
    family: "recommender-systems",
    prerequisites: ["feature-engineering"],
  },
  {
    slug: "ranking-metrics",
    title: "Ranking Metrics",
    family: "recommender-systems",
    prerequisites: ["classification-metrics"],
  },
  {
    slug: "embedding-based-retrieval",
    title: "Embedding-Based Retrieval",
    family: "recommender-systems",
    prerequisites: ["embeddings", "matrix-factorization"],
  },
  {
    slug: "cold-start",
    title: "The Cold-Start Problem",
    family: "recommender-systems",
    prerequisites: ["collaborative-filtering"],
  },

  // ── Deep Learning ──────────────────────────────────────────────────
  {
    slug: "neural-networks",
    title: "Neural Networks",
    family: "deep-learning",
    prerequisites: ["logistic-regression", "gradient-descent"],
  },
  {
    slug: "backpropagation",
    title: "Backpropagation",
    family: "deep-learning",
    prerequisites: ["neural-networks", "derivatives-gradients-chain-rule"],
  },
  {
    slug: "activation-functions",
    title: "Activation Functions",
    family: "deep-learning",
    prerequisites: ["neural-networks"],
  },
  {
    slug: "training-neural-networks",
    title: "Training Neural Networks",
    family: "deep-learning",
    prerequisites: ["backpropagation", "optimizers-momentum-and-adam"],
  },
  {
    slug: "regularization-in-deep-learning",
    title: "Regularization in Deep Learning",
    family: "deep-learning",
    prerequisites: ["neural-networks", "regularization"],
  },
  {
    slug: "normalization-layers",
    title: "Normalization Layers",
    family: "deep-learning",
    prerequisites: ["training-neural-networks"],
  },
  {
    slug: "embeddings",
    title: "Embeddings",
    family: "deep-learning",
    prerequisites: ["neural-networks"],
  },
  {
    slug: "rnn",
    title: "Recurrent Neural Networks",
    family: "deep-learning",
    prerequisites: ["neural-networks", "backpropagation"],
  },
  {
    slug: "lstm-and-gru",
    title: "LSTM and GRU",
    family: "deep-learning",
    prerequisites: ["rnn"],
  },
  {
    slug: "encoder-decoder",
    title: "Encoder-Decoder Architectures",
    family: "deep-learning",
    prerequisites: ["lstm-and-gru"],
  },
  {
    slug: "attention",
    title: "Attention",
    family: "deep-learning",
    prerequisites: ["encoder-decoder", "embeddings"],
  },

  // ── NLP ────────────────────────────────────────────────────────────
  {
    slug: "tokenization",
    title: "Tokenization",
    family: "nlp",
    prerequisites: ["types-of-data"],
  },
  {
    slug: "bag-of-words-and-tfidf",
    title: "Bag-of-Words and TF-IDF",
    family: "nlp",
    prerequisites: ["feature-engineering"],
  },
  {
    slug: "word-embeddings",
    title: "Word Embeddings",
    family: "nlp",
    prerequisites: ["embeddings", "bag-of-words-and-tfidf"],
  },
  {
    slug: "language-models",
    title: "Language Models",
    family: "nlp",
    prerequisites: ["probability-basics", "tokenization"],
  },

  // ── LLMs & GenAI ───────────────────────────────────────────────────
  {
    slug: "pretraining-and-next-token-prediction",
    title: "Pretraining and Next-Token Prediction",
    family: "llms-genai",
    prerequisites: ["transformers", "language-models"],
  },
  {
    slug: "sampling-and-decoding",
    title: "Sampling and Decoding",
    family: "llms-genai",
    prerequisites: ["language-models"],
  },
  {
    slug: "prompting-and-in-context-learning",
    title: "Prompting and In-Context Learning",
    family: "llms-genai",
    prerequisites: ["pretraining-and-next-token-prediction"],
  },
  {
    slug: "fine-tuning",
    title: "Fine-Tuning",
    family: "llms-genai",
    prerequisites: ["pretraining-and-next-token-prediction"],
  },
  {
    slug: "lora-and-peft",
    title: "LoRA and Parameter-Efficient Fine-Tuning",
    family: "llms-genai",
    prerequisites: ["fine-tuning"],
  },
  {
    slug: "instruction-tuning-and-rlhf",
    title: "Instruction Tuning and RLHF",
    family: "llms-genai",
    prerequisites: ["fine-tuning"],
  },
  {
    slug: "vector-search",
    title: "Vector Search",
    family: "llms-genai",
    prerequisites: ["embeddings"],
  },
  {
    slug: "rag",
    title: "Retrieval-Augmented Generation",
    family: "llms-genai",
    prerequisites: ["prompting-and-in-context-learning", "vector-search"],
  },
  {
    slug: "llm-evaluation",
    title: "Evaluating LLMs",
    family: "llms-genai",
    prerequisites: [
      "prompting-and-in-context-learning",
      "classification-metrics",
    ],
  },
  {
    slug: "agents-and-tool-use",
    title: "Agents and Tool Use",
    family: "llms-genai",
    prerequisites: ["prompting-and-in-context-learning"],
  },
  {
    slug: "llm-inference-optimization",
    title: "LLM Inference Optimization",
    family: "llms-genai",
    prerequisites: ["transformers"],
  },
  {
    slug: "ai-safety-basics",
    title: "AI Safety Basics",
    family: "llms-genai",
    prerequisites: ["instruction-tuning-and-rlhf"],
  },

  // ── Computer Vision ────────────────────────────────────────────────
  {
    slug: "image-representation",
    title: "Image Representation",
    family: "computer-vision",
    prerequisites: ["types-of-data"],
  },
  {
    slug: "convolutional-networks",
    title: "Convolutional Networks",
    family: "computer-vision",
    prerequisites: ["neural-networks", "image-representation"],
  },
  {
    slug: "cnn-architectures",
    title: "CNN Architectures",
    family: "computer-vision",
    prerequisites: ["convolutional-networks"],
  },
  {
    slug: "transfer-learning",
    title: "Transfer Learning",
    family: "computer-vision",
    prerequisites: ["convolutional-networks"],
  },
  {
    slug: "data-augmentation",
    title: "Data Augmentation",
    family: "computer-vision",
    prerequisites: ["convolutional-networks"],
  },

  // ── Data Engineering ───────────────────────────────────────────────
  {
    slug: "data-cleaning",
    title: "Data Cleaning",
    family: "data-engineering",
    prerequisites: ["types-of-data"],
  },
  {
    slug: "data-pipelines",
    title: "Data Pipelines",
    family: "data-engineering",
    prerequisites: ["data-cleaning"],
  },
  {
    slug: "batch-vs-streaming",
    title: "Batch vs Streaming",
    family: "data-engineering",
    prerequisites: ["data-pipelines"],
  },
  {
    slug: "storage-and-file-formats",
    title: "Storage and File Formats",
    family: "data-engineering",
    prerequisites: ["data-pipelines"],
  },

  // ── Production ML ──────────────────────────────────────────────────
  {
    slug: "model-deployment-and-serving",
    title: "Model Deployment and Serving",
    family: "production-ml",
    prerequisites: ["classification-metrics"],
  },
  {
    slug: "model-monitoring-and-drift",
    title: "Model Monitoring and Drift",
    family: "production-ml",
    prerequisites: ["model-deployment-and-serving"],
  },
  {
    slug: "feature-stores",
    title: "Feature Stores",
    family: "production-ml",
    prerequisites: ["feature-engineering", "data-pipelines"],
  },
  {
    slug: "experiment-tracking",
    title: "Experiment Tracking and Reproducibility",
    family: "production-ml",
    prerequisites: ["cross-validation"],
  },
  {
    slug: "online-evaluation",
    title: "Online Evaluation and Shadow Testing",
    family: "production-ml",
    prerequisites: ["ab-testing", "model-deployment-and-serving"],
  },
  {
    slug: "ml-system-design",
    title: "ML System Design",
    family: "production-ml",
    prerequisites: ["model-deployment-and-serving", "feature-stores"],
  },
];

/**
 * The canonical entry path for a brand-new learner, shown as "Start here"
 * on the homepage. Slugs, in order. Real articles render as links, planned
 * ones as "soon".
 */
export const START_HERE: string[] = [
  "what-is-data",
  "types-of-data",
  "exploratory-data-analysis",
];
