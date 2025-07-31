from sqlalchemy.orm import Session
from . import models

def create_investor(db: Session, inv_data):
    db_investor = models.Investor(**inv_data)
    db.add(db_investor)
    db.commit()
    db.refresh(db_investor)
    return db_investor

def create_commitment(db: Session, commit_data):
    db_commit = models.Commitment(**commit_data)
    db.add(db_commit)
    db.commit()
    db.refresh(db_commit)
    return db_commit
