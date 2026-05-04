# Face Anti-Spoofing Model Documentation

## Overview
This model is designed to distinguish between genuine faces ("Live") and spoofing attacks ("Spoof"). It is part of a biometric security system to prevent unauthorized access using photos, videos, or masks.

## Model Details

### Architecture
- **Base Model:** EfficientNet-B3 (pre-trained on ImageNet).
- **Modification:** The final classification head was replaced with a Linear layer having 2 outputs (Spoof, Live).
- **Input Size:** 224x224 pixels (3-channel RGB).

### Training Process
The model was trained using a cross-dataset approach to improve generalization:
- **Datasets:** CelebA-Spoof, CASIA-FASD, and LCC-FASD.
- **Strategy:** Two-phase transfer learning:
  1. **Phase 1 (Feature Extraction):** Backbone frozen, training only the classification head for 10 epochs using Adam (LR=1e-3).
  2. **Phase 2 (Fine-tuning):** Entire model unfrozen, training for 12 epochs using AdamW (LR=1e-4, weight_decay=1e-4).
- **Class Balancing:** Utilized `WeightedRandomSampler` and class-weighted `CrossEntropyLoss` to handle class imbalance in the training data.

### Data Preprocessing & Augmentation
- **Normalization:** ImageNet statistics (Mean: [0.485, 0.456, 0.406], Std: [0.229, 0.224, 0.225]).
- **Training Augmentations:** RandomResizedCrop, RandomHorizontalFlip, RandomRotation (25°), ColorJitter, GaussianBlur, and RandomErasing.
- **Inference Preprocessing:** Resize to 224x224, RGB conversion, and Normalization.

## Performance
The model was evaluated on a combined test set from CelebA-Spoof, CASIA-FASD, and LCC-FASD (Cross-Dataset Evaluation).
- **Key Metrics:**
    - Accuracy
    - Precision
    - Recall
    - F1-Score

## Implementation on FastAPI
The model is integrated into the FastAPI server via a dedicated ML service module.
- **Endpoint:** `POST /api/anti-spoof/predict`
- **Input:** Image file (Multipart form data).
- **Output:** JSON object containing:
    - `prediction`: "Live" or "Spoof"
    - `confidence`: Probability score.
    - `probabilities`: Detailed scores for both classes.
