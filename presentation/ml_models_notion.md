# 🧠 Notion: ML Models for Financial Behavior Analysis

## 🎯 Overview
While the current working prototype of the **Fintech Auca** project uses **Rule-Based Smart Logic** to generate immediate financial advice, the next step involves scaling the system using genuine Machine Learning (ML). 

Below is the theoretical architecture and ML roadmap for how advanced models can be plugged into the existing Django backend.

---

## 1. Automated Expense Categorization
**The Objective**: Remove the need for users to manually select categories by automatically predicting them based on transaction descriptions or merchants.
* **Model Choice**: **Multinomial Naive Bayes** or a standard **Random Forest Classifier**.
* **How it works**: 
  1. The Django API takes the unstructured string (e.g., "Uber Eat Kigali").
  2. The NLP pipeline parses the text strings.
  3. The model classifies it into a strict category ID (e.g., `Food`).
* **Why it fits**: It's highly lightweight, requires small initial datasets to become accurate, and integrates cleanly using Python's `scikit-learn`.

## 2. Spending Pattern & Anomaly Detection
**The Objective**: Alert the user to unusual spending behaviors, such as unexpected spikes in transport fees.
* **Model Choice**: **Isolation Forest** (Unsupervised Learning).
* **How it works**:
  1. The algorithm establishes a "normal" baseline evaluating the frequency, standard deviation, and amounts of a user's past 30 days of transactions.
  2. If a new transaction lands far outside the statistical norm, it is flagged.
* **Why it fits**: Doesn't require rigidly labeled data. It naturally adapts to different economic habits (e.g., someone who normally spends 100k RWF suddenly spending 500k RWF).

## 3. Predictive Cash Flow & Savings Goal
**The Objective**: Predict if the user is on track to hit their monthly savings goal based on current pacing.
* **Model Choice**: **ARIMA** (Time-Series Forecasting) or **Linear Regression**.
* **How it works**: 
  1. Predicts the remaining expenditure for the month based on the trajectory of the first two weeks.
  2. Generates dynamic advice: *"You are projected to overspend on transport by 15%. Consider reducing moving forward."*

---

## 🛠 Integration into Current Django Stack
To integrate any of these models into your current `fintech_backend` structure:
1. **Training Phase**: Export SQLite data -> Train on Jupyter Notebook using `pandas` and `scikit-learn` -> Export model as `.pkl` (Pickle file).
2. **Deployment**: Load the `.pkl` file in `api/views.py` when the Django server boots. 
3. **Execution**: Pass the `.predict()` function during the `POST /api/transactions/` request cycle.
