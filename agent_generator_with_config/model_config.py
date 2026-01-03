"""
Central configuration for Gemini models across the project.
This ensures consistent model usage and easy updates.

IMPORTANT: ADK uses model names WITHOUT the "models/" prefix.
The model must be supported by Google's Gemini API.
"""

import os

# Production-safe Gemini model for ADK (NO "models/" prefix)
# Using gemini-pro which is the most stable and widely supported by ADK
DEFAULT_GEMINI_MODEL = "gemini-pro"

# Alternative models (for reference) - ADK format
GEMINI_MODELS = {
    "flash_1_5": "gemini-flash-latest",          # Recommended - stable and fast
    "flash_1_5_001": "gemini-flash-latest",  # Specific version
    "flash_8b": "gemini-flash-latest-8b",        # Smaller, faster
    "pro_1_5": "gemini-1.5-pro",              # More capable
    "pro_1_5_001": "gemini-1.5-pro-001",      # Specific version
}

def get_default_model() -> str:
    """
    Get the default Gemini model from environment or use fallback.
    
    Returns:
        str: Model name to use for agent generation (ADK format, no "models/" prefix)
    """
    return os.getenv("DEFAULT_MODEL", DEFAULT_GEMINI_MODEL)


def get_model(model_name: str = None) -> str:
    """
    Get a specific model or default model.
    
    Args:
        model_name: Optional model name or key from GEMINI_MODELS
        
    Returns:
        str: Model name in ADK format (no "models/" prefix)
    """
    if not model_name:
        return get_default_model()
    
    # If it's a key in our models dict, return the full name
    if model_name in GEMINI_MODELS:
        return GEMINI_MODELS[model_name]
    
    # Remove "models/" prefix if present (for compatibility)
    if model_name.startswith("models/"):
        return model_name.replace("models/", "")
    
    # Otherwise, return as-is
    return model_name
