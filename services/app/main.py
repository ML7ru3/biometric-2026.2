from fastapi import FastAPI
from app.core.config import settings
from app.api.api import api_router

app = FastAPI()
app.include_router(api_router, prefix=settings.API_STR)

@app.get("/")
def root():
    return {"messages": "Welcome to your FastAPI Project!"}
