import axios from 'axios';
import type { InvestorSummary, InvestorDetail } from '../types/investor';


const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getInvestors = async (): Promise<InvestorSummary[]> => {
  const response = await apiClient.get<InvestorSummary[]>('/investors');
  return response.data;
};

export const getInvestorDetails = async (investorId: number): Promise<InvestorDetail> => {
    const response = await apiClient.get<InvestorDetail>(`/investors/${investorId}`);
    return response.data;
};



