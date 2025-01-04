export type DealStage = 
  | 'prospect'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'
  | 'lead'
  | 'meeting'
  | 'closed';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  owner: string;
  company: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}
