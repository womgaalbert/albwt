-- ============================================================
-- Seed Data — Blog Posts
-- ============================================================
-- Run this after the schema migration to populate sample data.

INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, cover_image, read_time, published, published_date) VALUES
(
  'Time Series Forecasting with ARIMA: A Practical Guide',
  'time-series-forecasting-arima',
  'A deep dive into applying ARIMA and SARIMA models for industrial energy demand forecasting, with step-by-step implementation in Python.',
  E'# Time Series Forecasting with ARIMA: A Practical Guide\n\nTime series forecasting is one of the most valuable skills in a data scientist''s toolkit. In this guide, I''ll walk through applying **ARIMA (AutoRegressive Integrated Moving Average)** models to predict industrial energy production.\n\n## Why ARIMA?\n\nARIMA models are particularly well-suited for univariate time series data that exhibits clear patterns over time — trends, seasonality, and cyclical behavior. They work by decomposing the series into three components:\n\n- **AR (AutoRegressive)**: The relationship between an observation and lagged observations\n- **I (Integrated)**: Differencing to make the series stationary\n- **MA (Moving Average)**: The relationship between an observation and residual errors\n\n## The Data\n\nFor this analysis, I used **U.S. industrial energy production data (1939–2025)** sourced from the Federal Reserve Economic Data (FRED) database.\n\n## Key Takeaways\n\n1. ARIMA models can capture complex temporal patterns with relatively simple parameterization\n2. Proper stationarity testing is critical for model validity\n3. Seasonal decomposition helps identify hidden patterns\n4. Rolling validation provides more realistic performance estimates\n\nThis methodology has been applied successfully to energy demand forecasting and can be adapted to any domain with temporal data.',
  'Tutorials',
  ARRAY['ARIMA', 'Forecasting', 'Time Series', 'Python'],
  'https://placehold.co/800x400/1e2a3a/00d4b8?text=ARIMA+Forecasting',
  12, true, '2025-06-15'
),
(
  'Building an NLP Document Classifier with DistilBERT',
  'nlp-document-classifier-distilbert',
  'How I built a two-stage NLP classification pipeline combining DistilBERT embeddings with XGBoost for automated legal document routing.',
  E'# Building an NLP Document Classifier with DistilBERT\n\nLegal document processing is a perfect use case for NLP automation. I built a classification pipeline that reduced document routing time from **3–4 minutes to under 2 seconds**.\n\n## The Architecture\n\nI designed a **two-stage pipeline**:\n\n### Stage 1: DistilBERT Embedding\n- Fine-tuned DistilBERT on legal domain text\n- Generated 768-dimensional embeddings per document\n\n### Stage 2: XGBoost Classification\n- Used DistilBERT embeddings as input features\n- Hyperparameter tuning with Optuna\n\n## Results\n\n| Metric | Before | After |\n|--------|--------|-------|\n| Routing time | 3-4 min | < 2 sec |\n| Accuracy | ~85% (human) | 96.4% |\n\n## Lessons Learned\n\n1. **Two-stage beats end-to-end**: Separating embedding from classification gave better control\n2. **Domain fine-tuning matters**: Legal-domain model outperformed general by 12%\n3. **Confidence thresholds**: Documents below 90% confidence are flagged for human review',
  'Case Studies',
  ARRAY['NLP', 'DistilBERT', 'XGBoost', 'Legal Tech'],
  'https://placehold.co/800x400/1e2a3a/8b5cf6?text=NLP+Classifier',
  10, true, '2025-04-22'
),
(
  'Transformer Models for Time Series: Beyond Text',
  'transformer-time-series',
  'Exploring how transformer architectures — originally designed for NLP — can be adapted for time series forecasting with impressive results.',
  E'# Transformer Models for Time Series: Beyond Text\n\nWhen we think of transformers, we typically think of NLP — GPT, BERT, Claude. But the **attention mechanism** at their core is fundamentally about modeling relationships in sequential data. Time series is sequential data too.\n\n## Why Transformers for Time Series?\n\nTraditional approaches like ARIMA and LSTM have limitations:\n- **ARIMA** struggles with complex non-linear patterns\n- **LSTM** suffers from vanishing gradients on very long sequences\n\nTransformers address these via **self-attention** — every time step can directly attend to every other time step.\n\n## Architecture Adaptations\n\n1. **Learnable positional encodings** for domain-specific patterns\n2. **Causal masking** prevents future information leakage\n3. **Multi-head attention** captures different temporal patterns\n\n## Performance\n\nOn U.S. energy production data:\n- ARIMA: MAE = 2.34\n- LSTM: MAE = 1.89\n- **Transformer: MAE = 1.42**\n\n## When to Use\n\nBest for long sequences (200+ steps), complex non-linear data, and when you have sufficient training data.',
  'Research',
  ARRAY['Transformers', 'Deep Learning', 'Time Series', 'PyTorch'],
  'https://placehold.co/800x400/1e2a3a/0066ff?text=Transformer+TS',
  14, true, '2025-03-10'
),
(
  'MLOps Pipeline: From Notebook to Production',
  'mlops-pipeline-production',
  'Building a Level 1 MLOps pipeline with MLflow experiment tracking, model registry, and automated retraining — lessons from a real educational data project.',
  E'# MLOps Pipeline: From Notebook to Production\n\nMoving from a Jupyter notebook to a production-grade ML pipeline is one of the hardest transitions in data science. Here''s how I approached it.\n\n## MLOps Maturity Levels\n\n### Level 0: Manual Process\n- Everything in notebooks\n- No experiment tracking\n- Manual deployment\n\n### Level 1: ML Pipeline Automation\n- Automated data validation\n- Experiment tracking (MLflow)\n- Model registry\n- CI/CD for training\n\n## Key Infrastructure\n\n| Component | Tool |\n|-----------|------|\n| Experiment Tracking | MLflow |\n| Model Registry | MLflow |\n| Data Versioning | DVC |\n| Pipeline Orchestration | Prefect |\n| Deployment | FastAPI + Docker |\n\n## Lessons Learned\n\n1. **Start tracking early**: Log experiments from notebook stage\n2. **SMOTE is powerful but dangerous**: Always split before resampling\n3. **Hypothesis-driven beats grid search**: Domain knowledge guides exploration\n4. **Docker from day one**: Avoids "it works on my machine" syndrome',
  'Tutorials',
  ARRAY['MLOps', 'MLflow', 'XGBoost', 'Python'],
  'https://placehold.co/800x400/1e2a3a/10b981?text=MLOps+Pipeline',
  11, true, '2025-02-28'
),
(
  'Computer Vision from Scratch: CNN on CIFAR-10',
  'cnn-cifar10-from-scratch',
  'Building a convolutional neural network without transfer learning — understanding every layer, every decision, and achieving 85%+ accuracy on CIFAR-10.',
  E'# Computer Vision from Scratch: CNN on CIFAR-10\n\nTransfer learning is great for production, but to truly understand CNNs, you need to build one from scratch.\n\n## Architecture Design\n\n```\nInput (32x32x3)\n  ↓\nConv2D(32, 3x3) → BatchNorm → ReLU → Dropout(0.25)\n  ↓\nConv2D(64, 3x3) → BatchNorm → ReLU → Dropout(0.25)\n  ↓\nConv2D(128, 3x3) → BatchNorm → ReLU → Dropout(0.3)\n  ↓\nFlatten → Dense(256) → Dropout(0.5)\n  ↓\nDense(10) → Softmax\n```\n\n### Design Decisions\n\n1. **3x3 kernels**: Small filters capture fine-grained features\n2. **Progressive channels (32→64→128)**: Deeper layers detect complex patterns\n3. **BatchNorm after every conv**: Stabilizes training\n4. **Increasing dropout**: Regularization grows with depth\n\n## Results\n\n| Epoch | Train Acc | Val Acc |\n|-------|-----------|--------|\n| 50 | 91.2% | 84.5% |\n| 100 | 95.8% | **86.2%** |\n\nBuilding from scratch gave me intuition that transfer learning alone never would.',
  'Tutorials',
  ARRAY['CNN', 'Computer Vision', 'PyTorch', 'Deep Learning'],
  'https://placehold.co/800x400/1e2a3a/f59e0b?text=CNN+CIFAR-10',
  9, true, '2025-01-15'
);
