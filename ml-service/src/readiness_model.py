# ======================================================
# readiness_model.py
# Core Deterministic Readiness Engine
# ======================================================

import numpy as np
import logging
from typing import Optional
from sklearn.base import BaseEstimator
from sklearn.preprocessing import StandardScaler

from .utils import load_pickle
from .config import settings

logger = logging.getLogger("readiness_model")
logger.setLevel(logging.INFO)


class ReadinessModel:
    """
    Production-safe readiness model wrapper.

    Responsibilities:
    - Load trained model
    - Load scaler
    - Apply deterministic transformation
    - Return bounded readiness score
    """

    def __init__(self):
        self.model: Optional[BaseEstimator] = None
        self.scaler: Optional[StandardScaler] = None
        self._load_artifacts()

    def _load_artifacts(self):
        """
        Loads model and scaler from disk.
        Fails safely if artifacts missing.
        """
        try:
            logger.info("Loading readiness model...")
            self.model = load_pickle(settings.MODEL_PATH)

            logger.info("Loading scaler...")
            self.scaler = load_pickle(settings.SCALER_PATH)

            logger.info("Model and scaler loaded successfully.")

        except Exception as e:
            logger.error(f"Failed to load model artifacts: {str(e)}")
            raise RuntimeError("Model initialization failed.")

    def predict(self, features: np.ndarray) -> float:
        """
        Deterministic readiness score prediction.

        IMPORTANT:
        - No probability output
        - No classification exposure
        - No success prediction
        """

        if self.model is None or self.scaler is None:
            raise RuntimeError("Model not initialized properly.")

        if features.ndim != 2:
            raise ValueError("Feature vector must be 2D.")

        try:
            # Scale features
            scaled_features = self.scaler.transform(features)

            # Predict readiness score
            raw_score = self.model.predict(scaled_features)[0]

            # Convert to float safely
            score = float(raw_score)

            # Enforce 0-100 boundary (government compliance)
            score = max(0.0, min(100.0, score))

            return round(score, 2)

        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise RuntimeError("Readiness prediction failed.")
