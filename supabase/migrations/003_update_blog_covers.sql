-- Replace placeholder blog cover images with local brand covers
UPDATE blog_posts SET cover_image = '/images/blog/time-series-forecasting-arima.svg' WHERE slug = 'time-series-forecasting-arima';
UPDATE blog_posts SET cover_image = '/images/blog/nlp-document-classifier-distilbert.svg' WHERE slug = 'nlp-document-classifier-distilbert';
UPDATE blog_posts SET cover_image = '/images/blog/transformer-time-series.svg' WHERE slug = 'transformer-time-series';
UPDATE blog_posts SET cover_image = '/images/blog/mlops-pipeline-production.svg' WHERE slug = 'mlops-pipeline-production';
UPDATE blog_posts SET cover_image = '/images/blog/cnn-cifar10-from-scratch.svg' WHERE slug = 'cnn-cifar10-from-scratch';
