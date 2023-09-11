from typing import TypedDict


# Define the expected error type
class AppError(TypedDict):
    error: str
