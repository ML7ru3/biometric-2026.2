import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import io

class AntiSpoofModel:
    def __init__(self, model_path: str, device: str = None):
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)
            
        self.model = self._load_model(model_path)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.classes = ['Spoof', 'Live']

    def _load_model(self, model_path: str):
        # Initialize EfficientNet-B3
        model = models.efficientnet_b3(weights=None)
        # Modify the classifier to match the training setup (2 output classes)
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_ftrs, 2)
        
        # Load weights
        state_dict = torch.load(model_path, map_location=self.device)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model

    def predict(self, image_bytes: bytes):
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Preprocess
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Inference
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
            
        prob_list = probabilities.cpu().numpy().tolist()
        pred_idx = np.argmax(prob_list)
        
        return {
            "prediction": self.classes[pred_idx],
            "confidence": prob_list[pred_idx],
            "probabilities": {
                self.classes[0]: prob_list[0],
                self.classes[1]: prob_list[1]
            }
        }
