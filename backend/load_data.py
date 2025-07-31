import pandas as pd
from datetime import datetime
from . import models, database, operations

def load_data(csv_path: str):
    db = database.SessionLocal()
    df = pd.read_csv(csv_path)
    
    grouped = df.groupby(['Investor Name', 'Investory Type', 'Investor Country', 'Investor Date Added', 'Investor Last Updated'])

    for (name, inv_type, country, date_added, last_updated), group in grouped:
        investor = operations.create_investor(db, {
            "name": name,
            "type": inv_type,
            "country": country,
            "date_added": datetime.strptime(date_added, "%Y-%m-%d"),
            "last_updated": datetime.strptime(last_updated, "%Y-%m-%d")
        })

        for _, row in group.iterrows():
            operations.create_commitment(db, {
                "asset_class": row["Commitment Asset Class"],
                "amount": row["Commitment Amount"],
                "currency": row["Commitment Currency"],
                "investor_id": investor.id
            })

    db.close()
