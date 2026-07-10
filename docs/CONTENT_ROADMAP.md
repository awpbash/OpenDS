# OpenDS Content Roadmap

This is a menu for contributors, not a rigid curriculum. Browse the sections, find a topic that you want to understand more deeply, and claim it by opening an issue or a draft PR. Every page goes through peer review before it is marked curated, so pick something you are willing to defend and refine.

A few notes on how to read this file:

- Each topic has a working title and a suggested kebab-case slug in parentheses. Both are starting points, not contracts.
- The checkbox tracks whether a page exists. The two existing pages are placeholder drafts that will be rewritten before review.
- Topics marked "(early milestone)" belong to the project's first connected learning chain. These have priority.
- "Builds on" lists suggested prerequisites from within this roadmap, by slug. Treat them as graph hints for the frontmatter, not as gates on who may write what.
- The vision lines describe what the page should achieve, including the thing most explanations elsewhere get wrong or skip. Authors keep narrative freedom beyond that.

Sections appear in a sensible learning order, but the graph is the real structure. Write the page you care about.

## Foundations of data

- [x] **What Is Data?** (`what-is-data`) (early milestone) (drafted, needs rewrite and review)
  - Vision: The reader should understand that data is a recorded, partial view of the world, and that the shape of a dataset (rows as observations, columns as measured properties) decides what analysis is even possible. The core intuition is the gap between the world and its recording. Most explanations elsewhere treat data as synonymous with truth and never mention that gap.
  - Visuals: widget: click to record observations and watch each one appear simultaneously as a point on a plot, a row in a table, and a count in the mathematical notation.
  - Builds on: none
  - Difficulty: beginner

- [ ] **Types of Data** (`types-of-data`) (early milestone)
  - Vision: The reader should be able to classify columns as numeric, categorical, ordinal, or datetime, and understand that type is a constraint on valid operations, not a vocabulary exercise. The intuition to build is that averaging postcodes is nonsense for a reason. Most pages present type taxonomies as definitions to memorize instead of showing what breaks when you ignore them.
  - Visuals: widget: assign a type to a column and watch which summaries and chart types stay valid and which turn into visible nonsense.
  - Builds on: what-is-data
  - Difficulty: beginner

- [ ] **Data Collection** (`data-collection`)
  - Vision: The reader should understand how data comes into existence: instruments, logs, surveys, scraping, and the measurement decisions behind each. The intuition is that bias enters before the first row is written. Most tutorials start from a clean CSV and skip this stage entirely.
  - Visuals: diagram: a pipeline from the world through measurement decisions to a table, annotated with the exact points where error and bias enter.
  - Builds on: what-is-data
  - Difficulty: beginner

- [ ] **Sampling and Populations** (`sampling-and-populations`)
  - Vision: The reader should distinguish sample from population and understand random, stratified, and convenience sampling, plus selection bias. The intuition is that how you sample matters more than how much you sample. Popular treatments obsess over sample size while ignoring the sampling scheme.
  - Visuals: widget: draw repeated samples from a hidden population using different schemes and compare each sample mean against the true value.
  - Builds on: data-collection
  - Difficulty: beginner

- [ ] **Data Quality** (`data-quality`)
  - Vision: The reader should treat quality checks (duplicates, impossible values, unit mix-ups, inconsistent labels) as a first-class analysis step rather than a chore. The intuition is that one silent unit error can dominate every downstream conclusion. Most content mentions quality in a paragraph and moves on.
  - Visuals: widget: a small deliberately broken dataset where fixing each defect visibly changes the summary statistics.
  - Builds on: types-of-data
  - Difficulty: beginner

- [ ] **Tidy Data and Table Shapes** (`tidy-data`)
  - Vision: The reader should understand rows-as-observations, wide versus long layouts, and why the same measurements can be organized in shapes that make analysis easy or impossible. The intuition is that table shape encodes meaning. Elsewhere this is taught as reshaping commands rather than as a statement about what a row means.
  - Visuals: animation: the same set of measurements morphing between wide and long layouts, with the changing meaning of a single row highlighted.
  - Builds on: types-of-data
  - Difficulty: beginner

## Exploratory data analysis

- [ ] **Exploratory Data Analysis** (`exploratory-data-analysis`) (early milestone)
  - Vision: The reader should see EDA as a questioning loop (ask, plot, revise the question) rather than a gallery of chart types. The intuition is that every plot exists to answer or provoke a specific question. Most EDA content is a tour of plotting functions with no reasoning attached.
  - Visuals: annotated walkthrough of one real dataset where every chart is paired with the question it was made to answer and what was learned.
  - Builds on: types-of-data
  - Difficulty: beginner

- [ ] **Distributions** (`distributions`)
  - Vision: The reader should be able to read a histogram: shape, modes, tails, and gaps, and understand that a distribution is a summary of how values spread. The intuition is that most datasets are not bell-shaped and the shape is a finding in itself. Most pages show only the normal distribution and imply everything looks like it.
  - Visuals: widget: a bin-width slider on a histogram that shows how the visual story changes, with a rug of raw points underneath for honesty.
  - Builds on: exploratory-data-analysis
  - Difficulty: beginner

- [ ] **Missing Data** (`missing-data`)
  - Vision: The reader should understand that why data is missing matters more than how much, through the MCAR, MAR, and MNAR distinction in plain language. The intuition is that missingness itself is information. Most advice jumps straight to "drop or fill" without asking about the mechanism.
  - Visuals: widget: toggle the missingness mechanism on a scatterplot and watch the visible sample and its mean drift away from the truth.
  - Builds on: exploratory-data-analysis
  - Difficulty: intermediate

- [ ] **Outliers** (`outliers`)
  - Vision: The reader should learn that an outlier is a judgment call, not a formula output: it may be an error, a different population, or the most important point in the dataset. The intuition is how a single point can bend an entire analysis. Most content gives automatic deletion recipes and skips the judgment.
  - Visuals: Manim animation: one point walking slowly away from the cloud while the mean and a fitted regression line bend to chase it.
  - Builds on: distributions, mean-median-mode
  - Difficulty: beginner

- [ ] **Data Visualization Principles** (`data-visualisation`)
  - Vision: The reader should choose charts by the question being asked and encode data honestly (axes, baselines, area versus length). The intuition is that visualization is perception engineering, not decoration. Most guides are chart-type zoos with no grounding in how humans misread graphics.
  - Visuals: gallery: the same data shown with a misleading design and an honest design, with a toggle between them and a caption naming the trick.
  - Builds on: distributions
  - Difficulty: beginner

- [ ] **Simpson's Paradox** (`simpsons-paradox`)
  - Vision: The reader should understand how a trend can reverse when data is aggregated, and why this is a warning about hidden grouping variables rather than a curiosity. The intuition is that the same numbers can honestly support opposite headlines. Most explanations show one famous example without teaching the reader to suspect it in their own data.
  - Visuals: widget: drag a slider to split an aggregate scatterplot into subgroups and watch the fitted trend flip sign.
  - Builds on: correlation
  - Difficulty: intermediate

## Descriptive statistics

- [ ] **Measures of Central Tendency** (`mean-median-mode`) (early milestone)
  - Vision: The reader should know when the mean misleads and the median resists, and that "typical value" is a modeling choice. The intuition is robustness: what happens to each measure when one value goes wild. Most pages recite three formulas and never answer which one to use when.
  - Visuals: widget: drag one outlier point along an axis and watch the mean chase it while the median barely moves, paired with a Manim render for the article.
  - Builds on: distributions
  - Difficulty: beginner

- [ ] **Variance and Spread** (`variance-and-spread`) (early milestone)
  - Vision: The reader should understand why deviations are squared, what standard deviation means in the data's own units, and when IQR is the better tool. The intuition is spread as a second, independent fact about data beyond the center. Most explanations present the variance formula without ever justifying the squaring.
  - Visuals: widget: drag points and watch deviation segments, their squared areas, and the standard deviation readout all update live.
  - Builds on: mean-median-mode
  - Difficulty: beginner

- [ ] **Percentiles and Quantiles** (`percentiles-and-quantiles`)
  - Vision: The reader should understand ranks, quartiles, and boxplots as statements about position in a sorted dataset. The intuition is the sweep: what fraction of the data sits below this value. Most content presents the boxplot as a finished object without deriving its parts.
  - Visuals: animation: points sorting themselves, then a percentile cursor sweeping across and shading the fraction below, assembling a boxplot at the end.
  - Builds on: distributions
  - Difficulty: beginner

- [ ] **Correlation** (`correlation`) (early milestone)
  - Vision: The reader should understand correlation as a measure of linear co-movement, with direction and strength, and see concretely why correlation is not causation and why r can be zero for a strong curved relationship. The intuition is co-variation as shared movement around two means. Most pages state the causation warning as a slogan without ever showing a mechanism that produces spurious correlation.
  - Visuals: widget: a scatterplot you sculpt by dragging points while r updates live, including a preset curved pattern with r near zero.
  - Builds on: variance-and-spread
  - Difficulty: beginner

- [ ] **Skewness and Heavy Tails** (`skewness-and-heavy-tails`)
  - Vision: The reader should recognize asymmetric and heavy-tailed distributions and know why the mean misleads there (income is the classic case). The intuition is that in skewed data, "average" and "typical" part ways. Most content treats skew as a definition rather than a practical reading skill.
  - Visuals: widget: a skew slider that morphs a distribution while mean and median markers visibly separate.
  - Builds on: variance-and-spread
  - Difficulty: intermediate

- [ ] **Summary Statistics Can Lie** (`summary-statistics-can-lie`)
  - Vision: The reader should internalize that identical means, variances, and correlations can hide wildly different data, and therefore always plot first. The intuition comes from Anscombe's quartet and the Datasaurus. This lesson is usually a footnote elsewhere when it deserves its own page.
  - Visuals: animation: a Datasaurus-style morph between datasets that share the same mean, variance, and correlation to two decimal places.
  - Builds on: correlation
  - Difficulty: beginner

## Probability essentials

- [ ] **Probability Foundations** (`probability-foundations`)
  - Vision: The reader should understand probability both as long-run frequency and as degree of belief, along with sample spaces and events in plain language. The intuition is probability as a bookkeeping system for uncertainty. Most introductions drill coin-flip arithmetic without ever saying what a probability means.
  - Visuals: widget: run repeated coin and dice simulations and watch empirical frequencies converge toward the stated probabilities.
  - Builds on: sampling-and-populations
  - Difficulty: beginner

- [ ] **Conditional Probability** (`conditional-probability`)
  - Vision: The reader should see conditioning as shrinking the universe: filtering to the rows where the condition holds and recounting. The intuition is that P(A given B) is counting inside a smaller world. Most pages teach the formula first and the filtering picture never arrives, which is why base-rate errors persist.
  - Visuals: widget: an interactive population grid where clicking a condition dims everything outside it and the fraction recomputes before your eyes.
  - Builds on: probability-foundations
  - Difficulty: beginner

- [ ] **Bayes' Theorem** (`bayes-theorem`)
  - Vision: The reader should be able to solve the classic medical-test problem with natural frequencies (counts of people) and understand Bayes as belief updating. The intuition is that a positive test on a rare disease is usually a false alarm. Most explanations present the algebra and skip the counting frame that actually makes it click.
  - Visuals: widget: a tree of 1000 people flowing through disease and test branches, with a prevalence slider that visibly changes the posterior.
  - Builds on: conditional-probability
  - Difficulty: intermediate

- [ ] **Random Variables and Expectation** (`random-variables-and-expectation`)
  - Vision: The reader should understand a random variable as a numeric measurement wrapped in probability, and expectation as the long-run average of playing the game many times. The intuition is expected value as a fair price. Most treatments define E[X] symbolically without the repeated-play picture.
  - Visuals: widget: a simple bet simulator where the running average converges to the expected value, plus a heavy-tailed variant where it refuses to settle.
  - Builds on: probability-foundations
  - Difficulty: intermediate

- [ ] **Common Distributions** (`common-distributions`)
  - Vision: The reader should learn Bernoulli, binomial, Poisson, uniform, and exponential as generative stories (counting successes, counting arrivals, waiting times) rather than as a formula catalogue. The intuition is that a distribution is the shadow of a process. Most references list PDFs with no story attached.
  - Visuals: widget: pick a story such as summing coin flips or counting arrivals per minute, simulate it, and watch the histogram assemble into the matching named shape.
  - Builds on: random-variables-and-expectation
  - Difficulty: intermediate

- [ ] **The Normal Distribution** (`normal-distribution`)
  - Vision: The reader should understand why the bell curve appears so often (sums of many small effects), the 68-95-99.7 rule, and z-scores as a universal ruler. The intuition is that normality is an emergent property, not a law of nature. Most content assumes normality everywhere without saying where it comes from or when it fails.
  - Visuals: Manim animation: a Galton board dropping balls through pegs into an emerging bell curve.
  - Builds on: common-distributions
  - Difficulty: beginner

- [ ] **Independence and Joint Distributions** (`independence-and-joint-distributions`)
  - Vision: The reader should be able to read a two-way table or joint distribution, extract marginals, and understand independence as factorization: knowing one variable tells you nothing about the other. The intuition is the joint table as the complete truth about two variables. Most courses rush past joints to get to formulas, leaving conditional reasoning shaky.
  - Visuals: widget: a heatmap of a 2D joint distribution with its marginals on the axes and a toggle that forces independence so you can see what changes.
  - Builds on: conditional-probability
  - Difficulty: intermediate

- [ ] **Law of Large Numbers** (`law-of-large-numbers`)
  - Vision: The reader should understand why averages stabilize as samples grow, and why this is a statement about averages, not about streaks correcting themselves. The intuition kills the gambler's fallacy. Most pages state the theorem without confronting the fallacy it is most often mistaken for.
  - Visuals: widget: running-mean paths for many simulated players overlaid, wild at first, funneling toward the true value.
  - Builds on: random-variables-and-expectation
  - Difficulty: intermediate

- [ ] **Central Limit Theorem** (`central-limit-theorem`)
  - Vision: The reader should understand that means of samples from almost any distribution become approximately normal, and that this is about the distribution of the mean, not the data. The intuition is why sample size buys you normality for free. The single most common error elsewhere is claiming the data itself becomes normal.
  - Visuals: widget: choose a deliberately wild parent distribution, draw thousands of sample means, and watch their histogram turn bell-shaped while the raw data stays wild.
  - Builds on: law-of-large-numbers, normal-distribution
  - Difficulty: intermediate

## Data preparation

- [ ] **Data Cleaning** (`data-cleaning`)
  - Vision: The reader should treat cleaning as analysis with consequences: every fix is a decision that should be recorded and defensible. The intuition is that cleaning choices are part of the result. Most content frames cleaning as a boring chore of recipes rather than a chain of judgment calls.
  - Visuals: before-and-after walkthrough of one genuinely messy dataset with each decision logged and its effect on the summary statistics shown.
  - Builds on: data-quality
  - Difficulty: beginner

- [ ] **Imputation** (`imputation`)
  - Vision: The reader should understand mean, median, and model-based imputation, and the cost each one pays: filled values are guesses that shrink variance and fake certainty. The intuition is that imputation manufactures data. Most guides present mean imputation as a harmless default, which it is not.
  - Visuals: widget: impute the missing half of a scatterplot with different strategies and watch the variance and the correlation get visibly distorted.
  - Builds on: missing-data
  - Difficulty: intermediate

- [ ] **Feature Scaling** (`feature-scaling`)
  - Vision: The reader should know what standardization and min-max scaling do, which models care (distance-based and gradient-based) and which do not (trees). The intuition is that unscaled features let one unit choice dominate a distance. Most tutorials apply scaling ritually, sometimes fitting the scaler on test data without noticing.
  - Visuals: animation: a kNN decision boundary before and after scaling, on data where one axis is in kilometers and the other in millimeters.
  - Builds on: variance-and-spread
  - Difficulty: beginner

- [ ] **Encoding Categorical Variables** (`encoding-categorical-variables`)
  - Vision: The reader should understand one-hot encoding, the trap of assigning arbitrary integers to unordered categories, and why target encoding invites leakage. The intuition is that encodings invent geometry, so the invented distances must be meaningful. Most pages list encoders without showing the fake-distance failure.
  - Visuals: widget: encode a categorical column as arbitrary integers and watch a linear model take the invented ordering seriously, then switch to one-hot and watch it recover.
  - Builds on: types-of-data
  - Difficulty: beginner

- [ ] **Feature Transformations** (`feature-transformations`)
  - Vision: The reader should know when and why to apply logs and power transforms: to straighten multiplicative relationships and tame skew, not as ritual. The intuition is that a log turns multiplication into addition. Most content applies log transforms without ever explaining what relationship they linearize.
  - Visuals: widget: toggle a log axis on skewed data and watch a curved multiplicative relationship straighten into a line.
  - Builds on: skewness-and-heavy-tails
  - Difficulty: intermediate

- [ ] **Data Leakage** (`data-leakage`)
  - Vision: The reader should recognize the many faces of leakage: preprocessing fit on the full dataset, features that encode the target, and future information in the past. The intuition is that leakage produces scores that are honestly computed and completely wrong. Most content reduces leakage to "do not test on training data" and misses the subtle forms that cause real failures.
  - Visuals: widget: two side-by-side pipelines, one scaling before the split and one after, showing the inflated versus honest test scores.
  - Builds on: train-test-split
  - Difficulty: intermediate

- [ ] **Preprocessing Pipelines** (`preprocessing-pipelines`)
  - Vision: The reader should understand the fit-on-train, apply-everywhere discipline as a concept, independent of any library. The intuition is that every preprocessing step is itself a small model with parameters learned from data. Most tutorials teach pipeline APIs without the principle, so the discipline evaporates when the tool changes.
  - Visuals: diagram: data flowing through fit and transform stages with the exact points where leakage would enter marked in red.
  - Builds on: data-leakage
  - Difficulty: intermediate

## Statistical inference

- [ ] **Sampling Distributions** (`sampling-distributions`)
  - Vision: The reader should grasp the idea that a statistic computed from a sample is itself a random quantity with its own distribution. This is the single load-bearing idea of inference, and the intuition is imagining the study repeated a thousand times. Most courses skip straight to test recipes, which is why inference feels like magic to so many people.
  - Visuals: widget: repeatedly resample and watch the histogram of sample means build up next to the one sample you actually got to see.
  - Builds on: central-limit-theorem
  - Difficulty: intermediate

- [ ] **Standard Error** (`standard-error`)
  - Vision: The reader should cleanly separate the spread of the data from the spread of the estimate, and see why the latter shrinks with sample size. The intuition is two different rulers for two different questions. Conflating standard error with standard deviation is among the most common errors in published analysis.
  - Visuals: animation: two distributions side by side, the data's spread staying fixed while the mean's spread narrows as n grows.
  - Builds on: sampling-distributions
  - Difficulty: intermediate

- [ ] **Confidence Intervals** (`confidence-intervals`)
  - Vision: The reader should understand what 95% coverage actually promises: the procedure captures the truth in 95% of repeated studies, not that this interval has a 95% chance of containing it. The intuition is the interval as a net cast by a procedure. Nearly every popular explanation states the wrong interpretation.
  - Visuals: widget: simulate 100 studies and watch which of their intervals capture the fixed true value, with the misses highlighted.
  - Builds on: standard-error
  - Difficulty: intermediate

- [ ] **Hypothesis Testing** (`hypothesis-testing`)
  - Vision: The reader should understand the logic: assume a skeptical null, compute how surprising the data would be under it, and decide. The intuition comes from permutation: shuffle the labels and see if the observed difference is special. Most content is a cookbook of named tests with the shared logic never stated once.
  - Visuals: widget: shuffle labels between two groups repeatedly to build the null distribution, then place the observed difference on it.
  - Builds on: sampling-distributions
  - Difficulty: intermediate

- [ ] **p-values** (`p-values`)
  - Vision: The reader should know precisely what a p-value is (probability of data this extreme, assuming the null) and the long list of things it is not, including the probability the hypothesis is true. The intuition is the p-value as a surprise index under skepticism. Most pages either state the definition and flee, or repeat the misinterpretations they meant to correct.
  - Visuals: widget: slide the observed effect along the null distribution and watch the shaded tail area, the p-value, recompute live.
  - Builds on: hypothesis-testing
  - Difficulty: intermediate

- [ ] **Statistical Power** (`statistical-power`)
  - Vision: The reader should understand power as the probability of detecting an effect that is really there, and how effect size, sample size, and alpha trade off. The intuition is that a non-significant result from an underpowered study is nearly information-free. Power is routinely ignored elsewhere until a study has already failed.
  - Visuals: widget: sliders for effect size, n, and alpha over two overlapping distributions with the power region shaded.
  - Builds on: p-values
  - Difficulty: intermediate

- [ ] **Multiple Comparisons** (`multiple-comparisons`)
  - Vision: The reader should understand why running twenty tests almost guarantees a false discovery, and the basic corrections (Bonferroni, FDR) as different bargains. The intuition is that significance thresholds are per-test promises, not per-project promises. Most content teaches corrections as formulas without simulating the problem they fix.
  - Visuals: widget: a jellybean-style simulator that runs many tests on pure noise and highlights the spurious wins as they accumulate.
  - Builds on: p-values
  - Difficulty: intermediate

- [ ] **The Bootstrap** (`bootstrap`)
  - Vision: The reader should see resampling with replacement as a general-purpose way to estimate a sampling distribution when no formula exists. The intuition is treating the sample as a stand-in for the population. Most treatments present the bootstrap as a trick rather than as the sampling-distribution idea made computational.
  - Visuals: animation: resamples being pulled from the observed data, each one's statistic dropping into a growing histogram that becomes an interval.
  - Builds on: sampling-distributions
  - Difficulty: intermediate

- [ ] **A/B Testing** (`ab-testing`)
  - Vision: The reader should understand randomized online experiments end to end: metric choice, randomization units, duration, and why peeking at results early inflates false positives. The intuition is that an A/B test is a hypothesis test wearing product clothes. Most industry blog posts skip the peeking problem entirely.
  - Visuals: widget: a live simulated experiment where a "check early and stop when significant" policy measurably inflates the false positive rate.
  - Builds on: hypothesis-testing, statistical-power
  - Difficulty: intermediate

- [ ] **Experiment Design** (`experiment-design`)
  - Vision: The reader should understand randomization, control groups, and blocking as tools that cut confounding by construction. The intuition is that a designed experiment answers a question observation alone cannot. Most content treats experiments and observational analysis as interchangeable ways to get data.
  - Visuals: diagram: the same question studied observationally and experimentally, with arrows marking exactly where randomization severs the confounding path.
  - Builds on: ab-testing
  - Difficulty: intermediate

## Supervised learning fundamentals

- [ ] **Prediction and Error** (`prediction-error`) (early milestone)
  - Vision: The reader should understand residuals as the gap between prediction and reality, and MAE, MSE, and RMSE as different ways to aggregate those gaps. The core intuition is that squared error punishes large misses disproportionately. Most pages define the metrics without ever showing how the choice changes which model wins.
  - Visuals: widget: drag a line through a scatterplot while residual segments and live MAE, MSE, and RMSE readouts update, with an add-an-outlier button.
  - Builds on: correlation
  - Difficulty: beginner

- [ ] **Train / Validation / Test Split** (`train-test-split`) (early milestone)
  - Vision: The reader should understand that the entire point of modeling is performance on unseen data, and the distinct jobs of the three sets: fit, choose, and final verdict. The intuition is the test set as a sealed exam paper. Most content conflates validation and test, which is exactly how test sets get quietly burned.
  - Visuals: widget: a memorizing model and a simple model scored on seen and unseen points as you drag the split boundary.
  - Builds on: prediction-error
  - Difficulty: beginner

- [ ] **Cross-Validation** (`cross-validation`)
  - Vision: The reader should understand k-fold as a way to get a more stable estimate from limited data, and when naive CV breaks: time series, grouped records, and leaky preprocessing. The intuition is averaging many small exams instead of trusting one. Most tutorials show the happy path and never the failure cases.
  - Visuals: animation: folds rotating through a dataset, per-fold scores accumulating into a mean with a visible spread.
  - Builds on: train-test-split
  - Difficulty: intermediate

- [ ] **Overfitting and Underfitting** (`overfitting-and-underfitting`)
  - Vision: The reader should recognize fitting noise versus missing signal, and learn the diagnosis: compare training and validation error, not either alone. The intuition is a student who memorized past exams. Most pages show the polynomial cartoon and stop before teaching the actual diagnostic workflow.
  - Visuals: widget: a model-complexity slider with the fitted curve wiggling live while train and validation error curves diverge.
  - Builds on: train-test-split
  - Difficulty: beginner

- [ ] **Bias-Variance Tradeoff** (`bias-variance-tradeoff`)
  - Vision: The reader should understand bias and variance as properties of a model family across repeated datasets, not of one fitted model. The intuition is retraining on many resamples and watching whether the fits agree with each other or with the truth. Almost everyone shows the static U-curve and skips the simulation that makes it real.
  - Visuals: widget: retrain the same model class on many bootstrap resamples and watch the family of fitted curves either fan out (variance) or agree on the wrong answer (bias).
  - Builds on: overfitting-and-underfitting, bootstrap
  - Difficulty: intermediate

- [ ] **Regularization** (`regularization`)
  - Vision: The reader should understand penalties as a price on complexity, and the ridge versus lasso difference: shrinking coefficients versus zeroing them. The intuition is a budget on how strong the model's opinions may be. Most content tunes lambda as a knob without showing what the penalty does to the coefficients.
  - Visuals: widget: a lambda slider with coefficient paths shrinking smoothly under ridge and snapping to exact zero under lasso.
  - Builds on: bias-variance-tradeoff, linear-regression
  - Difficulty: intermediate

- [ ] **Loss Functions** (`loss-functions`) (early milestone)
  - Vision: The reader should understand a loss function as the formal statement of what the model is punished for, and therefore what it learns to care about. The intuition is that changing the loss changes the optimal answer, not just the score. Most pages catalogue losses without showing that the fitted model itself moves.
  - Visuals: widget: switch the loss (MSE, MAE, Huber) on the same data and watch the optimal fitted line move toward or away from the outliers.
  - Builds on: prediction-error
  - Difficulty: intermediate

- [ ] **Gradient Descent** (`gradient-descent`) (early milestone)
  - Vision: The reader should understand following the negative slope downhill, the role of the learning rate, and local minima. The intuition is a hiker in fog feeling the ground. Most explanations show pretty 2D bowls and never let the reader experience divergence or oscillation firsthand.
  - Visuals: widget: click a starting point on a loss surface, pick a learning rate, and watch the descent path converge, zigzag, or explode.
  - Builds on: loss-functions
  - Difficulty: intermediate

- [ ] **Hyperparameters and Tuning** (`hyperparameter-tuning`)
  - Vision: The reader should distinguish learned parameters from chosen hyperparameters, understand grid and random search, and know that tuning must be scored on validation data only. The intuition is that tuning is itself a form of learning that can overfit. Most guides tune against the test set without blinking.
  - Visuals: diagram: the nested loop of searching over configurations, with the untouched test set drawn behind glass until the very end.
  - Builds on: cross-validation
  - Difficulty: intermediate

- [ ] **Learning Curves** (`learning-curves`)
  - Vision: The reader should learn to answer the most practical question in ML: would more data help, or is the model the bottleneck. The intuition is reading convergence of train and validation curves as the dataset grows. This diagnostic is nearly absent from popular tutorials despite being cheap and decisive.
  - Visuals: widget: grow the training set step by step and watch train and validation curves converge, or plateau apart when capacity is the problem.
  - Builds on: overfitting-and-underfitting
  - Difficulty: intermediate

- [ ] **Baseline Models** (`baseline-models`)
  - Vision: The reader should always start with predict-the-mean or predict-the-majority-class and measure everything against it. The intuition is that a score means nothing without a floor to compare against. Most content celebrates model accuracy numbers that a constant prediction would nearly match.
  - Visuals: widget: compare a tuned model against the trivial baseline on the same metric and see how small the real gap often is.
  - Builds on: prediction-error
  - Difficulty: beginner

## Classical models

- [ ] **Linear Regression** (`linear-regression`) (early milestone)
  - Vision: The reader should understand least squares as minimizing total squared residual area, how to read coefficients, and what the assumptions actually cost when violated. The intuition is the line as the best compromise among competing points. Most pages list assumptions as commandments without showing the consequence of breaking each one.
  - Visuals: widget: fit a line by hand with the residual squares rendered as literal squares whose total area you are trying to minimize, then reveal the least-squares answer.
  - Builds on: prediction-error, correlation
  - Difficulty: beginner

- [ ] **Multiple Regression** (`multiple-regression`)
  - Vision: The reader should understand what "holding other variables constant" really means, and how interactions let one variable's effect depend on another. The intuition is a coefficient as a slice through a higher-dimensional fit. The phrase "holding constant" is said everywhere and shown almost nowhere.
  - Visuals: widget: a rotatable 3D plane fit over two features, with a slider that takes slices to show one coefficient's meaning.
  - Builds on: linear-regression
  - Difficulty: intermediate

- [ ] **Logistic Regression** (`logistic-regression`)
  - Vision: The reader should understand logistic regression as a probability model, not a black-box classifier: linear score, sigmoid squash, threshold last. The intuition is separating the probability estimate from the decision. Most content jumps straight to predicted classes and loses the probabilistic heart of the model.
  - Visuals: widget: drag points near the boundary and watch the sigmoid curve and each point's predicted probability respond in real time.
  - Builds on: linear-regression, probability-foundations
  - Difficulty: intermediate

- [ ] **k-Nearest Neighbors** (`k-nearest-neighbors`)
  - Vision: The reader should understand prediction by memory and proximity, the smoothing role of k, and why distance breaks down in high dimensions. The intuition is asking your k most similar neighbors to vote. Most pages skip the curse of dimensionality, which is the most important thing about kNN.
  - Visuals: widget: a k slider that redraws the decision boundary from jagged (k=1) to oversmoothed (large k).
  - Builds on: feature-scaling, overfitting-and-underfitting
  - Difficulty: beginner

- [ ] **Naive Bayes** (`naive-bayes`)
  - Vision: The reader should understand classification by counting, the independence assumption that makes it "naive", and why it works surprisingly well anyway. The intuition is each word in a spam email casting an independent vote. Most explanations never address why a false assumption still produces good rankings.
  - Visuals: widget: a toy spam classifier over a small vocabulary where you can watch word counts multiply into a posterior for each class.
  - Builds on: bayes-theorem
  - Difficulty: intermediate

- [ ] **Decision Trees** (`decision-trees`)
  - Vision: The reader should understand recursive splitting, impurity as a splitting criterion, and the tree's twin character: highly interpretable and highly prone to overfitting. The intuition is the tree carving feature space into rectangles. Most content leads with impurity formulas before the geometric picture that makes them meaningful.
  - Visuals: widget: grow a tree split by split and watch axis-aligned rectangles carve up the scatterplot, with a depth limit toggle showing overfit.
  - Builds on: overfitting-and-underfitting
  - Difficulty: beginner

- [ ] **Support Vector Machines** (`support-vector-machines`)
  - Vision: The reader should understand maximum-margin separation, why only the support vectors matter, and the kernel idea as implicitly working in a lifted space. The intuition is the widest possible street between classes. The kernel trick is usually presented as a magic incantation instead of a change of coordinates you can see.
  - Visuals: animation: inseparable 1D points lifted into 2D where a straight line separates them, then projected back down as a curved boundary.
  - Builds on: logistic-regression
  - Difficulty: advanced

- [ ] **Bagging** (`bagging`)
  - Vision: The reader should understand averaging many models trained on bootstrap resamples as a variance-reduction machine. The intuition is that individually jumpy models can be collectively stable. Most content jumps to random forests without isolating the averaging idea that does the actual work.
  - Visuals: widget: one tree's jagged decision boundary next to the average of 50 bootstrapped trees, the jitter visibly smoothing out.
  - Builds on: decision-trees, bootstrap
  - Difficulty: intermediate

- [ ] **Random Forests** (`random-forests`)
  - Vision: The reader should understand random forests as bagging plus per-split feature randomness to decorrelate the trees, and read feature importances with proper suspicion. The intuition is a crowd of deliberately diverse experts. Most content presents importances as ground truth and skips their known biases.
  - Visuals: diagram: many shallow, deliberately different trees voting, plus an importance bar chart with its bias caveat annotated directly on it.
  - Builds on: bagging
  - Difficulty: intermediate

- [ ] **Gradient Boosting** (`gradient-boosting`)
  - Vision: The reader should understand boosting as sequentially fitting small models to the current residuals, with shrinkage controlling how boldly each round corrects. The intuition is a committee where each new member fixes the last one's mistakes. XGBoost-era content is mostly tool flags, with the residual game itself left unexplained.
  - Visuals: Manim animation: fit, plot residuals, fit the residuals, repeat, with the ensemble's curve tightening around the data each round.
  - Builds on: decision-trees, gradient-descent
  - Difficulty: advanced

## Unsupervised learning

- [ ] **Clustering** (`clustering`)
  - Vision: The reader should understand the goal of finding structure without labels, that "similar" is a choice you make via the distance metric, and that there is no ground truth to score against. The intuition is that different reasonable definitions of similarity give different honest answers. Most content treats k-means as a synonym for clustering.
  - Visuals: widget: the same dataset clustered under different algorithms and distance choices, with visibly different verdicts side by side.
  - Builds on: feature-scaling
  - Difficulty: intermediate

- [ ] **k-Means** (`k-means`)
  - Vision: The reader should understand the assign-then-recenter iteration, how to think about choosing k, and the shapes k-means cannot find. The intuition is centroids as tug-of-war anchors. Most tutorials never show the algorithm failing, so readers deploy it on data it cannot handle.
  - Visuals: widget: step the algorithm manually, assignments then centroid moves, on a crescent-shaped dataset where it visibly fails.
  - Builds on: clustering
  - Difficulty: intermediate

- [ ] **Hierarchical Clustering** (`hierarchical-clustering`)
  - Vision: The reader should understand agglomerative merging, linkage choices, and the dendrogram as a family tree of the data. The intuition is that cutting the tree at different heights gives different clusterings from one computation. Dendrograms are usually shown without teaching how to actually read one.
  - Visuals: widget: drag a cut line up and down a dendrogram and watch the scatterplot regroup live.
  - Builds on: clustering
  - Difficulty: intermediate

- [ ] **Density-Based Clustering** (`dbscan`)
  - Vision: The reader should understand clusters as dense regions separated by sparse ones, why this finds non-spherical shapes, and the honest concept of noise points that belong to nothing. The intuition is connectivity through crowded neighborhoods. Most content buries DBSCAN's real gift, the permission to label points as noise.
  - Visuals: widget: an epsilon slider growing neighborhood circles until crescent shapes connect into clusters while stragglers remain noise.
  - Builds on: k-means
  - Difficulty: intermediate

- [ ] **Gaussian Mixture Models** (`gaussian-mixture-models`)
  - Vision: The reader should understand soft clustering, where points belong to clusters by degree, and the EM loop of guessing responsibilities and re-fitting. The intuition is k-means with uncertainty made explicit. Most treatments derive EM algebraically without the alternation picture.
  - Visuals: animation: the EM alternation, point colors blending by responsibility while the Gaussian ellipses re-fit each round.
  - Builds on: k-means, normal-distribution
  - Difficulty: advanced

- [ ] **Principal Component Analysis** (`pca`)
  - Vision: The reader should understand PCA as finding the directions of greatest variance and projecting onto them, plus when the result is meaningless (unscaled features, nonlinear structure). The intuition is choosing the best shadow of a high-dimensional object. Most explanations start at eigendecomposition and never arrive at the shadow.
  - Visuals: widget: rotate a projection axis through a 2D point cloud, watch retained variance change, then snap to the principal axis.
  - Builds on: variance-and-spread, correlation
  - Difficulty: intermediate

- [ ] **t-SNE and UMAP** (`tsne-and-umap`)
  - Vision: The reader should learn to read nonlinear embedding maps without overreading them: cluster membership is meaningful, distances between clusters and cluster sizes mostly are not. The intuition is that these maps preserve neighborhoods, not geometry. Almost every blog post interprets t-SNE distances literally.
  - Visuals: widget: a perplexity slider on fixed data showing the map's apparent clusters morphing, splitting, and merging.
  - Builds on: pca
  - Difficulty: advanced

- [ ] **Anomaly Detection** (`anomaly-detection`)
  - Vision: The reader should understand that an anomaly is only defined relative to a model of normal, and survey the main approaches: distance, density, and isolation. The intuition is that easy-to-isolate points are suspicious. Most content presents one algorithm without the framing that anomaly is model-relative.
  - Visuals: widget: draw your own points onto a canvas and watch an isolation-forest anomaly score heatmap update beneath them.
  - Builds on: distributions, clustering
  - Difficulty: intermediate

## Model evaluation

- [ ] **Regression Metrics** (`regression-metrics`)
  - Vision: The reader should interpret MAE, RMSE, and R-squared in the units and context of the problem, and always compare against the baseline. The intuition is that a metric is only meaningful relative to a floor and a use case. R-squared worship is the standard failure elsewhere.
  - Visuals: widget: the same predictions scored by each metric while you inject one large error and watch which metrics panic.
  - Builds on: prediction-error, baseline-models
  - Difficulty: beginner

- [ ] **Confusion Matrix** (`confusion-matrix`)
  - Vision: The reader should read the four cells fluently and understand that the two kinds of error usually have very different costs. The intuition is that a single accuracy number hides an asymmetric story. Most pages present the matrix as a static table instead of something a threshold moves.
  - Visuals: widget: drag the decision threshold and watch individual points flow between the four cells in real time.
  - Builds on: logistic-regression
  - Difficulty: beginner

- [ ] **Precision, Recall, and F1** (`precision-and-recall`)
  - Vision: The reader should understand the precision-recall tradeoff as a statement about which error hurts more, and F1 as one specific compromise rather than a default. The intuition is a smoke alarm: sensitivity versus false alarms. Most content recommends F1 reflexively without any cost reasoning.
  - Visuals: widget: cost sliders for false alarms versus misses, with the recommended threshold shifting as the costs change.
  - Builds on: confusion-matrix
  - Difficulty: intermediate

- [ ] **ROC Curves and AUC** (`roc-and-auc`)
  - Vision: The reader should understand the ROC curve as the trace of all possible thresholds and AUC as ranking quality, plus when precision-recall curves are the better lens under heavy imbalance. The intuition is one dot per threshold, swept into a curve. Most explanations present the finished curve without the sweep that generates it.
  - Visuals: widget: drag a threshold across the two score distributions and watch the ROC point trace out the curve while confusion matrix cells update.
  - Builds on: confusion-matrix
  - Difficulty: intermediate

- [ ] **Calibration** (`calibration`)
  - Vision: The reader should understand that a predicted 0.8 should come true about 80% of the time, that many models are systematically over- or under-confident, and how reliability diagrams expose this. The intuition is confidence as a promise that can be audited. Calibration is skipped by almost all introductory material despite deciding whether probabilities are usable.
  - Visuals: widget: a reliability diagram where you can deliberately miscalibrate a model and watch the gap open between stated confidence and observed frequency.
  - Builds on: logistic-regression
  - Difficulty: advanced

- [ ] **Imbalanced Data** (`imbalanced-data`)
  - Vision: The reader should understand the accuracy trap, the options (reweighting, resampling, threshold moving), and which metrics stay honest under imbalance. The intuition is that a model predicting "no fraud" every time scores 99% accuracy. Most content applies SMOTE ritually without asking whether the threshold was the real problem.
  - Visuals: widget: a 99-to-1 dataset where the do-nothing classifier proudly reports 99% accuracy while its recall reads zero.
  - Builds on: precision-and-recall
  - Difficulty: intermediate

- [ ] **Error Analysis** (`error-analysis`)
  - Vision: The reader should learn to look at individual failures and slice metrics by segment, turning "the model is 87% accurate" into "the model fails on short inputs from segment B". The intuition is that aggregate metrics hide clusters of failure. Almost all content stops at the metric, which is where real model improvement starts.
  - Visuals: worked walkthrough: one model's twenty worst errors, grouped by hand into named failure modes with per-segment metrics.
  - Builds on: confusion-matrix
  - Difficulty: intermediate

## Neural networks and deep learning

- [ ] **The Perceptron** (`perceptron`)
  - Vision: The reader should understand the weighted-sum-plus-threshold unit, linear separability, and the XOR wall that motivated hidden layers. The intuition is one unit as one straight cut through feature space. Most content skips XOR, which is the whole historical and conceptual reason deep networks exist.
  - Visuals: widget: tune two weights and a bias by hand to separate points, then face XOR and discover no setting works.
  - Builds on: logistic-regression
  - Difficulty: beginner

- [ ] **Neural Networks and the Forward Pass** (`neural-networks`)
  - Vision: The reader should understand a network as composed simple functions, where hidden units learn intermediate features and depth buys expressiveness. The intuition is function composition, not brain metaphor. Most popular explanations lean on neuron imagery and never show what a hidden unit actually computes.
  - Visuals: widget: a two-layer network fitting a 2D dataset with each hidden unit's learned region visualized as its own small panel.
  - Builds on: perceptron
  - Difficulty: intermediate

- [ ] **Activation Functions** (`activation-functions`)
  - Vision: The reader should understand why nonlinearity is mandatory (stacked linear layers collapse into one), and the practical differences between sigmoid, tanh, and ReLU, including dead and saturated units. The intuition is the activation as the bend that makes depth matter. Most content lists functions without showing the collapse that happens without them.
  - Visuals: widget: swap activations in a tiny network and watch both the fitted function and the gradient magnitudes change, including a linear-only mode that flattens into a line.
  - Builds on: neural-networks
  - Difficulty: intermediate

- [ ] **Backpropagation** (`backpropagation`)
  - Vision: The reader should understand backprop as the chain rule with careful bookkeeping over a computational graph, solving credit assignment: how much each weight contributed to the error. The intuition is blame flowing backward. Most derivations drown in indices and never show the graph picture that makes it mechanical.
  - Visuals: Manim animation: gradients flowing backward through a small computational graph node by node, each edge labeled with its local derivative.
  - Builds on: neural-networks, gradient-descent
  - Difficulty: advanced

- [ ] **Optimizers** (`optimizers`)
  - Vision: The reader should understand SGD, momentum, and Adam as different strategies for the same downhill walk, plus what learning-rate schedules buy. The intuition is momentum as a heavy ball and Adam as per-parameter step sizes. Most content declares Adam the default without showing where each optimizer wins or stalls.
  - Visuals: widget: race the optimizers from the same starting point across a ravine-shaped loss surface and watch their paths diverge.
  - Builds on: gradient-descent, backpropagation
  - Difficulty: advanced

- [ ] **Regularization for Deep Learning** (`deep-learning-regularization`)
  - Vision: The reader should understand dropout, weight decay, early stopping, and data augmentation as different answers to the same overfitting problem. The intuition is dropout as training an ensemble of thinned networks. Most content lists the techniques without connecting them back to the bias-variance story.
  - Visuals: widget: toggle dropout on a deliberately overfitting network and watch the gap between train and validation loss close.
  - Builds on: regularization, neural-networks
  - Difficulty: advanced

- [ ] **Convolutional Neural Networks** (`convolutional-neural-networks`)
  - Vision: The reader should understand convolution as a sliding pattern detector with shared weights, and the hierarchy from edges to textures to objects. The intuition is one small filter reused everywhere because a cat ear is a cat ear anywhere in the image. Most content opens with padding arithmetic before the pattern-matching idea that motivates everything.
  - Visuals: widget: drag a learned filter across an image and watch the activation map light up exactly where the pattern matches.
  - Builds on: neural-networks
  - Difficulty: advanced

- [ ] **Recurrent Neural Networks** (`recurrent-neural-networks`)
  - Vision: The reader should understand carrying a hidden state through time, why gradients vanish over long sequences, and why this limitation set the stage for attention. The intuition is a fixed-size memory being overwritten at every step. Most content teaches LSTM gate equations without the compression problem they were built to ease.
  - Visuals: animation: a hidden state passing through time steps, with early information visibly fading as the sequence grows.
  - Builds on: neural-networks
  - Difficulty: advanced

- [ ] **Embeddings** (`embeddings`)
  - Vision: The reader should understand embeddings as learned coordinates where similarity in meaning becomes proximity in space. The intuition is meaning as geometry. Most explanations lead with king-minus-man-plus-woman arithmetic and skip the training pressure that produces the geometry in the first place.
  - Visuals: widget: explore a 2D projection of word embeddings, search for a word, and see its nearest neighbors highlighted with distances.
  - Builds on: neural-networks
  - Difficulty: intermediate

- [ ] **Attention** (`attention`)
  - Vision: The reader should understand attention as a soft lookup: queries matched against keys producing weights that blend values. The intuition is retrieving a little of everything in proportion to relevance. The standard error elsewhere is treating attention heatmaps as explanations of model decisions, which they are not.
  - Visuals: widget: an interactive query-key matching panel on a short sentence, with the score, softmax weights, and blended value shown at each step.
  - Builds on: embeddings
  - Difficulty: advanced

- [x] **Transformers** (`transformers`) (drafted, needs rewrite and review)
  - Vision: The reader should understand how next-token prediction, attention, and stacked blocks combine into the architecture behind modern language models, and that scale rather than architectural cleverness separates a toy from an assistant. The intuition is the prediction game forcing everything else to be learned. Most content either drowns in tensor shapes or hand-waves entirely.
  - Visuals: widget: a real tiny transformer running in the browser, with live next-token probability bars and an attention heatmap while you type.
  - Builds on: attention, embeddings
  - Difficulty: advanced

- [ ] **Transfer Learning and Fine-Tuning** (`fine-tuning`)
  - Vision: The reader should understand reusing a pretrained model's learned features, when to freeze layers versus tune everything, and roughly how much data each strategy needs. The intuition is standing on a mountain of prior training instead of starting in the valley. Most content shows the API call and skips the reasoning about what transfers and why.
  - Visuals: diagram: a pretrained backbone with progressively unfrozen layers, each option annotated with the data budget it realistically requires.
  - Builds on: convolutional-neural-networks, transformers
  - Difficulty: advanced

- [ ] **LoRA and Parameter-Efficient Fine-Tuning** (`lora`)
  - Vision: The reader should understand the low-rank idea: approximate the weight update with two thin matrices, tuning a fraction of a percent of the parameters. The intuition is that adaptation lives in a low-dimensional subspace. LoRA is usually presented as a config flag, with the rank picture that explains the whole method left out.
  - Visuals: Manim animation: a giant weight matrix beside the thin pair of low-rank matrices, their product deforming the original with a fraction of the numbers.
  - Builds on: fine-tuning
  - Difficulty: advanced

## Modern NLP and large language models

- [ ] **Tokenization** (`tokenization`)
  - Vision: The reader should understand subword tokenization (BPE-style) as a compromise between characters and words, and how it explains familiar LLM quirks like miscounting letters and mangling rare names. The intuition is that models never see words, only pieces. Most content treats tokenization as plumbing when it explains a whole family of failures.
  - Visuals: widget: type text and watch it split into tokens live, with numbers and rare words visibly shattering into fragments.
  - Builds on: embeddings
  - Difficulty: intermediate

- [ ] **Language Modeling** (`language-modeling`)
  - Vision: The reader should understand next-token prediction as the core objective, perplexity as its scorecard, and what a model must implicitly learn to predict well. The intuition is that compression pressure forces the learning of grammar, facts, and style. This bridge topic is usually skipped between n-gram history and GPT hype.
  - Visuals: widget: an n-gram model and a tiny neural model completing the same prompts side by side, with per-token probabilities exposed.
  - Builds on: tokenization, transformers
  - Difficulty: advanced

- [ ] **Pretraining vs Instruction Tuning** (`pretraining-vs-instruction-tuning`)
  - Vision: The reader should understand the difference between a base model that continues text and an assistant model shaped by instruction data. The intuition is that helpfulness is a learned costume over a raw predictor. Popular accounts conflate the two stages into one training run, which breeds wrong mental models of what LLMs are.
  - Visuals: side-by-side demo: the same prompt answered by a base-style raw continuation and an instruction-tuned answer.
  - Builds on: language-modeling
  - Difficulty: advanced

- [ ] **RLHF and Preference Tuning** (`rlhf`)
  - Vision: The reader should understand the pipeline from human preference pairs to a reward model to a tuned policy, and both what it fixes and what it distorts, such as sycophancy and hedging. The intuition is training on "which answer do you prefer" rather than "what comes next". Most coverage is either marketing or heavy RL math with nothing in between.
  - Visuals: diagram: the three-stage pipeline followed by one concrete example pair being ranked, scored, and reinforced.
  - Builds on: pretraining-vs-instruction-tuning
  - Difficulty: advanced

- [ ] **Prompting** (`prompting`)
  - Vision: The reader should understand the context window as the model's entire working world, and few-shot examples and reasoning instructions as ways of conditioning the predictor. The intuition is prompting as steering a distribution, not casting spells. Most prompting content is incantation lists with no model of why anything works.
  - Visuals: widget: toggle few-shot examples and a reasoning instruction on a fixed task and watch accuracy over a small evaluation set change.
  - Builds on: pretraining-vs-instruction-tuning
  - Difficulty: intermediate

- [ ] **Retrieval-Augmented Generation** (`rag`)
  - Vision: The reader should understand RAG as retrieval quality plus grounded generation, with embedding search doing the retrieval, and the failure modes: bad chunks in, confident nonsense out. The intuition is an open-book exam where the book pages are chosen by similarity. Most content shops for vector databases before asking whether retrieval is finding the right passages at all.
  - Visuals: widget: ask a question, see the retrieved chunks ranked by similarity score, then the generated answer with each claim linked to its source chunk.
  - Builds on: embeddings, prompting
  - Difficulty: advanced

- [ ] **Evaluating LLMs** (`llm-evaluation`)
  - Vision: The reader should understand benchmarks and their contamination problem, human evaluation, and LLM-as-judge with its biases. The intuition is that evaluating open-ended text is fundamentally harder than scoring a classifier. Most coverage reports leaderboard numbers without the honest limits of how those numbers were produced.
  - Visuals: worked example: one model's outputs scored on the same task by exact match, a human rubric, and an LLM judge, with the disagreements laid bare.
  - Builds on: prompting
  - Difficulty: advanced

- [ ] **Hallucination and Factuality** (`hallucination`)
  - Vision: The reader should understand why plausible and true are different targets, and why hallucination is a direct consequence of the training objective rather than a bug to patch. The intuition is that a confident wrong answer can be a perfectly good next-token prediction. Most articles treat hallucination as mysterious misbehavior instead of expected behavior.
  - Visuals: widget: probe a small language model with questions inside and outside its training data and watch its confidence stay eerily flat across both.
  - Builds on: language-modeling
  - Difficulty: intermediate

- [ ] **LLM Agents** (`llm-agents`)
  - Vision: The reader should understand the observe-think-act loop, tool calling, and the sobering arithmetic of error compounding across steps: a 95% reliable step is 60% reliable after ten steps. The intuition is a capable but fallible worker in a loop with the world. Most agent content is hype that never multiplies the error rates.
  - Visuals: diagram: the agent loop annotated with per-step success probabilities and the compounding failure curve alongside.
  - Builds on: prompting, rag
  - Difficulty: advanced

## Practical data science and ML systems

- [ ] **Feature Engineering** (`feature-engineering`)
  - Vision: The reader should understand feature engineering as translating domain knowledge into representations a model can use, and why it still often beats model swapping. The intuition is that a good feature does work the model would otherwise have to learn from scratch. Most content jumps from raw data to model choice and skips the step with the highest leverage.
  - Visuals: worked example: raw timestamps becoming hour-of-day and weekend features, with model accuracy stepping up as each feature lands.
  - Builds on: encoding-categorical-variables, feature-transformations
  - Difficulty: intermediate

- [ ] **Time Series Basics** (`time-series-basics`)
  - Vision: The reader should understand trend, seasonality, and autocorrelation, and why time-ordered data breaks the independence assumptions behind standard tools. The intuition is that yesterday predicts today, which is both the opportunity and the trap. The classic error elsewhere is applying shuffled cross-validation to time series.
  - Visuals: widget: decompose a real series into trend, seasonal, and residual layers you can toggle on and off.
  - Builds on: data-visualisation, correlation
  - Difficulty: intermediate

- [ ] **Forecasting and Backtesting** (`forecasting-and-backtesting`)
  - Vision: The reader should understand naive baselines (repeat last value, repeat last season) and rolling-origin evaluation as the honest way to score a forecaster. The intuition is only ever grading predictions on data from the future of the training window. Fancy models quietly losing to the naive baseline is the field's most under-reported result.
  - Visuals: widget: a rolling-origin backtest animation with naive and model errors accumulating side by side.
  - Builds on: time-series-basics, baseline-models
  - Difficulty: advanced

- [ ] **Recommendation Systems** (`recommendation-systems`)
  - Vision: The reader should understand collaborative versus content-based filtering, matrix factorization as learning taste dimensions, and feedback loops where the system shapes the data it later trains on. The intuition is filling in a mostly empty ratings grid using patterns from similar users. The feedback-loop problem is almost always omitted.
  - Visuals: widget: a small user-by-item ratings grid you can factorize and watch the missing cells fill in with predictions.
  - Builds on: correlation, embeddings
  - Difficulty: advanced

- [ ] **Causal Inference Basics** (`causal-inference-basics`)
  - Vision: The reader should understand confounding through simple causal diagrams, why prediction and intervention are different questions, and why controlling for the wrong variable (a collider) creates bias instead of removing it. The intuition is drawing the arrows before running the regression. Correlation-is-not-causation is warned about everywhere and operationalized almost nowhere.
  - Visuals: widget: a three-node causal diagram where toggling adjustment for a confounder or a collider flips the estimated effect.
  - Builds on: simpsons-paradox, experiment-design
  - Difficulty: advanced

- [ ] **Interpretability and SHAP** (`interpretability-and-shap`)
  - Vision: The reader should understand global versus local explanations, SHAP values as fair credit assignment across features for a single prediction, and their limits. The intuition is asking how the prediction shifts as each feature joins the coalition. The standard error elsewhere is reading SHAP plots as causal statements about the world.
  - Visuals: widget: perturb one feature of a single prediction and watch its SHAP attribution respond, with the additivity to the final prediction shown.
  - Builds on: random-forests
  - Difficulty: advanced

- [ ] **Data Ethics and Bias** (`data-ethics-and-bias`)
  - Vision: The reader should trace how bias enters at every pipeline stage, from collection to labels to deployment, and understand that common fairness criteria can be mathematically incompatible. The intuition is that a model faithfully learns the world's recorded unfairness. Most treatments are either checklists or philosophy, with the concrete mechanics missing.
  - Visuals: widget: a toy lending model where equalizing one fairness metric across groups visibly breaks another.
  - Builds on: sampling-and-populations, precision-and-recall
  - Difficulty: intermediate

- [ ] **Model Deployment Basics** (`model-deployment-basics`)
  - Vision: The reader should understand a deployed model as software with a contract: batch versus real-time serving, versioning, and keeping training and serving preprocessing identical. The intuition is that the notebook was the easy part. Most educational content ends at the metric and never ships anything.
  - Visuals: diagram: the path from notebook artifact to versioned service, with each contract point (inputs, preprocessing, outputs) marked.
  - Builds on: preprocessing-pipelines
  - Difficulty: intermediate

- [ ] **Data Drift and Model Monitoring** (`drift-and-monitoring`)
  - Vision: The reader should understand that models decay silently as the world shifts, the difference between input drift and concept drift, and why monitoring is harder when true labels arrive late or never. The intuition is a map slowly going out of date while still looking like a map. Almost everything ends at deployment elsewhere, as if the story stops there.
  - Visuals: widget: feed a deployed model slowly shifting data and watch accuracy sag well before any input-distribution alert fires.
  - Builds on: model-deployment-basics, distributions
  - Difficulty: advanced

- [ ] **Reproducible Analysis** (`reproducible-analysis`)
  - Vision: The reader should understand seeds, pinned environments, and versioned data as the minimum for an analysis someone else can rerun, including themselves in six months. The intuition is the result as the end of a dependency chain where any unrecorded link breaks it. Reproducibility is preached in science and barely taught in data science tutorials.
  - Visuals: diagram: the dependency chain from raw data to final figure with each breakable, unrecorded link labeled.
  - Builds on: data-cleaning
  - Difficulty: beginner

- [ ] **Communicating Results** (`communicating-results`)
  - Vision: The reader should learn to report findings with honest uncertainty, match the message to the audience, and lead with the decision the analysis supports. The intuition is that an analysis nobody understands changes nothing. This skill is skipped by nearly all technical curricula despite deciding whether the work matters.
  - Visuals: side-by-side: the same finding reported with and without uncertainty, and the different decision each version invites.
  - Builds on: confidence-intervals, data-visualisation
  - Difficulty: intermediate

## Papers worth explaining

Future paper pages, in the OpenDS style: the problem before the paper, why it mattered, the core idea with intuition, and what changed afterward. Not abstract paraphrases.

- [ ] **Attention Is All You Need** (Vaswani et al., 2017). The transformer paper. Pairs with the `attention` and `transformers` concept pages.
- [ ] **Efficient Estimation of Word Representations (word2vec)** (Mikolov et al., 2013). Where meaning-as-geometry became practical. Pairs with `embeddings`.
- [ ] **Deep Residual Learning (ResNet)** (He et al., 2015). Why skip connections let networks go deep. Pairs with `convolutional-neural-networks`.
- [ ] **Adam: A Method for Stochastic Optimization** (Kingma and Ba, 2014). The default optimizer and its actual mechanics. Pairs with `optimizers`.
- [ ] **Random Forests** (Breiman, 2001). A masterclass in variance reduction. Pairs with `random-forests` and `bagging`.
- [ ] **BERT** (Devlin et al., 2018). Pretraining plus fine-tuning as the new default workflow. Pairs with `fine-tuning`.
- [ ] **Language Models are Few-Shot Learners (GPT-3)** (Brown et al., 2020). Scale as a capability strategy. Pairs with `language-modeling` and `prompting`.
- [ ] **Chain-of-Thought Prompting** (Wei et al., 2022). Reasoning coaxed out of predictors. Pairs with `prompting`.
- [ ] **LoRA: Low-Rank Adaptation** (Hu et al., 2021). Fine-tuning at a fraction of the cost. Pairs with `lora`.
- [ ] **ImageNet Classification with Deep CNNs (AlexNet)** (Krizhevsky et al., 2012). The moment deep learning became undeniable. Pairs with `convolutional-neural-networks`.

## Cheat sheet ideas

Concise revision artifacts that summarize and link back to concept pages, never replacements for them.

- [ ] **Which metric when**: a decision guide from problem type and error costs to regression and classification metrics.
- [ ] **Choosing a statistical test**: from data types and question shape to the appropriate test, with assumptions listed.
- [ ] **Common distributions at a glance**: each distribution's generative story, shape, parameters, and a typical use.
- [ ] **Loss functions reference**: formula, gradient behavior, outlier sensitivity, and when to prefer each.
- [ ] **Data leakage checklist**: the known leak patterns to audit before trusting any score.
- [ ] **Model selection field guide**: classical models compared by interpretability, data appetite, scaling needs, and failure modes.
- [ ] **Reading LLM outputs**: tokenization quirks, hallucination patterns, and what confidence does and does not mean.
