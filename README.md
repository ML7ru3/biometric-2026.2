# Face Liveness Detection and Basic Security Evaluation Against Presentation Attacks

## 1. Project Objective

This project aims to develop a lightweight face liveness detection system that distinguishes live faces from simple presentation attacks, such as printed photos and screen/video replays.  

In addition to a CNN-based liveness model, the system integrates blink detection to improve robustness against spoofing.  

A simple webcam-based demo will illustrate real-time detection performance. The project will also evaluate attack success rates, analyze vulnerabilities, and provide insights for enhancing biometric security.

---

## 2. Dataset

We will use:

- **CASIA Face Anti-Spoofing Dataset (CASIA-FASD)**

---

## 3. Proposed Methodology

### Data Processing
- Face detection  
- Resizing  
- Normalization  

### Model Development
- Train a lightweight CNN  
- Or fine-tune a pre-trained model (e.g., MobileNet)

### System Implementation
- Build a simple web interface  
- Capture webcam input  
- Send frames to the model for inference  

### Attack Evaluation
Perform basic attacks:
- Printed photo  
- Screen replay  

### Evaluation Metrics
- Accuracy  
- FAR (False Acceptance Rate)  
- FRR (False Rejection Rate)  

---

## 4. Expected Outcomes

- A functional liveness detection model  
- A simple real-time webcam demo  
- Experimental results on dataset and basic attacks  
- Discussion of limitations and possible improvements  
