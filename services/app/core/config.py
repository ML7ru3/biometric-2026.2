from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "My FastAPI Project"
    API_STR: str = "/api"
    model_config = SettingsConfigDict(env_file = ".env", extra="ignore")

settings = Settings()
