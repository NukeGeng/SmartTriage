from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "SmartTriage AI Service"
    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    MODEL_DIR: str = "models"
    DATASET_PATH: str = "data/raw/ticket_samples.csv"
    DUPLICATE_INDEX_PATH: str = "data/tickets_index/sample_existing_tickets.csv"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
