from pydantic import BaseModel
from datetime import date
from typing import List

class CommitmentSchema(BaseModel):
    id: int
    asset_class: str
    amount: float
    currency: str

    class Config:
        orm_mode = True

class InvestorSchema(BaseModel):
    id: int
    name: str
    type: str
    date_added: date
    address: str

    class Config:
        orm_mode = True

class InvestorWithTotal(BaseModel):
    id: int
    name: str
    type: str
    date_added: date
    address: str
    total_commitment: float
