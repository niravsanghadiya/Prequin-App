import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path # Import Path from pathlib


class Commitment(BaseModel):
    id: int
    asset_class: str
    amount: int
    currency: str

class InvestorBase(BaseModel):
    id: int
    name: str
    type: str
    country: str
    date_added: date

class InvestorSummary(InvestorBase):
    total_commitment: int

class InvestorDetail(InvestorSummary):
    commitments: List[Commitment]

# ------------------- Data Loading and Processing -------------------

# This dictionary will store our data in memory after loading it on startup.
investor_data_store: Dict[int, InvestorDetail] = {}

def load_investor_data(filepath: Path) -> Dict[int, InvestorDetail]:
    """
    Reads investor data from a CSV, processes it, and returns a
    dictionary of investor objects, indexed by a unique ID.
    """
    # Define the column names to use, which corrects the "Investory Type" typo
    COLUMN_NAMES = [
        "name", "type", "country", "date_added", "last_updated",
        "asset_class", "amount", "currency"
    ]

    # Use header=0 to skip the header row in the CSV and apply our clean names
    df = pd.read_csv(filepath, header=0, names=COLUMN_NAMES)

    investors_dict = {}
    investor_id_counter = 1
    commitment_id_counter = 1

    # Group data by investor name to process each investor's commitments together
    for name, group in df.groupby("name"):
        investor_info = group.iloc[0]
        investor_id = investor_id_counter

        commitments_list = []
        for _, row in group.iterrows():
            commitments_list.append(
                Commitment(
                    id=commitment_id_counter,
                    asset_class=row["asset_class"],
                    amount=row["amount"],
                    currency=row["currency"],
                )
            )
            commitment_id_counter += 1
        
        investors_dict[investor_id] = InvestorDetail(
            id=investor_id,
            name=investor_info["name"],
            type=investor_info["type"],
            country=investor_info["country"],
            date_added=pd.to_datetime(investor_info["date_added"]).date(),
            total_commitment=group["amount"].sum(),
            commitments=commitments_list,
        )
        investor_id_counter += 1

    return investors_dict


# ------------------- FastAPI Application Setup -------------------

app = FastAPI(
    title="Investor API",
    description="An API to serve investor and commitment data.",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    """
    This function runs when the application starts.
    It locates and loads the data from data.csv.
    """
    # Build a reliable path to the data.csv file
    # It assumes data.csv is in the same directory as main.py
    script_dir = Path(__file__).parent
    data_file_path = script_dir / "data.csv"

    if not data_file_path.is_file():
        # If the file doesn't exist, raise an error to stop the server
        raise FileNotFoundError(
            f"Error: data.csv not found at {data_file_path}. "
            "Please make sure the file is in the same directory as main.py."
        )

    # Load data into the global store
    global investor_data_store
    investor_data_store = load_investor_data(data_file_path)
    print(f"Successfully loaded data for {len(investor_data_store)} investors.")



origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- API Endpoints -------------------

@app.get("/api/investors", response_model=List[InvestorSummary], summary="Get a list of all investors", tags=["Investors"])
async def get_investors():
    """Returns a summarized list of all investors."""
    if not investor_data_store:
        return []
    return [InvestorSummary(**investor.dict()) for investor in investor_data_store.values()]


@app.get("/api/investors/{investor_id}", response_model=InvestorDetail, summary="Get details for a specific investor", tags=["Investors"])
async def get_investor_details(investor_id: int):
    """Returns all details for a single investor, identified by their unique ID."""
    investor = investor_data_store.get(investor_id)
    if not investor:
       
        raise HTTPException(status_code=404, detail=f"Investor with ID {investor_id} not found")
    return investor


# ------------------- Main Execution  -------------------

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)