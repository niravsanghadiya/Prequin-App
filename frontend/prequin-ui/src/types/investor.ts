export interface Commitment {
    id: number;
    asset_class: string;
    amount: number;
    currency: string;
  }

  export interface InvestorSummary {
    id: number;
    name: string;
    type: string;
    country: string;
    date_added: string; // Keep as string for simplicity
    total_commitment: number;
  }

  export interface InvestorDetail extends InvestorSummary {
    commitments: Commitment[];
  }