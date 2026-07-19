/**
 * DTOs for Academic Recognition Application Service
 */

export interface CreateAwardDto {
  profileId: string;
  title: string;
  category: string;
  sponsorOrAgency?: string;
  amount?: number;
  currency?: string;
  awardDate?: string;
  description?: string;
  field?: string;
  area?: string;
}

export interface AwardOutputDto {
  id: string;
  profileId: string;
  title: string;
  category: string;
  sponsorOrAgency?: string;
  amount?: number;
  currency?: string;
  awardDate: string;
  description?: string;
  field?: string;
  area?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGrantDto {
  profileId: string;
  grantNumber: string;
  title: string;
  fundingAgency: string;
  amount: number;
  currency?: string;
  startDate: string;
  endDate: string;
  status?: string;
  principalInvestigatorId?: string;
  coInvestigators?: string[];
  description?: string;
  deliverables?: string[];
}

export interface GrantOutputDto {
  id: string;
  profileId: string;
  grantNumber: string;
  title: string;
  fundingAgency: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: string;
  principalInvestigatorId?: string;
  coInvestigators: string[];
  description?: string;
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatentDto {
  profileId: string;
  patentNumber: string;
  title: string;
  status: string;
  patentType: string;
  filingDate: string;
  grantDate?: string;
  assigneeOrganization?: string;
  inventors?: string[];
  abstract?: string;
}

export interface UpdatePatentStatusDto {
  patentId: string;
  nextStatus: string;
  grantDate?: string;
}

export interface PatentOutputDto {
  id: string;
  profileId: string;
  patentNumber: string;
  title: string;
  status: string;
  patentType: string;
  filingDate: string;
  grantDate?: string;
  assigneeOrganization?: string;
  inventors: string[];
  abstract?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfessionalActivityDto {
  profileId: string;
  category: string;
  title: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  conferenceName?: string;
  journalName?: string;
  country?: string;
  description?: string;
}

export interface ProfessionalActivityOutputDto {
  id: string;
  profileId: string;
  category: string;
  title: string;
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  conferenceName?: string;
  journalName?: string;
  country?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
