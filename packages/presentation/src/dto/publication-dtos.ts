/**
 * Publications API DTOs (Sprint 8)
 */

export interface CreatePublicationApiRequestDto {
  profileId: string;
  title: string;
  type: string;
  status?: string;
  doi?: string;
  isbn?: string;
  abstract?: string;
  keywords?: string[];
  year?: number;
  url?: string;
  language?: string;
  authors?: Array<{
    name: string;
    email?: string;
    orcid?: string;
    authorOrder: number;
    isCorresponding?: boolean;
    affiliations?: Array<{
      institution: string;
      department?: string;
      location?: string;
    }>;
  }>;
  venue?: {
    name: string;
    venueType: 'JOURNAL' | 'CONFERENCE' | 'OTHER';
    issn?: string;
    isbn?: string;
    publisherId?: string;
    url?: string;
  };
  publisher?: {
    name: string;
    location?: string;
    websiteUrl?: string;
  };
  fundings?: Array<{
    funderName: string;
    fundingIdentifier?: string;
    grantTitle?: string;
    amountCurrency?: string;
    amountValue?: number;
  }>;
}

export interface UpdatePublicationApiRequestDto {
  title?: string;
  abstract?: string;
  keywords?: string[];
  year?: number;
  url?: string;
  doi?: string;
  isbn?: string;
}

export interface PublishPublicationApiRequestDto {
  publishedDate: string;
}

export interface SubmitPublicationApiRequestDto {
  submittedDate: string;
}

export interface CreateResearchProjectApiRequestDto {
  profileId: string;
  title: string;
  description: string;
  status?: string;
  startDate: string;
  endDate?: string;
  grantIdentifier?: string;
  fundingAgency?: string;
  budget?: number;
  members: Array<{
    profileId?: string;
    name: string;
    role: string;
    startDate: string;
    endDate?: string;
  }>;
}

export interface UpdateResearchProjectApiRequestDto {
  title?: string;
  description?: string;
  status?: string;
  grantIdentifier?: string;
  fundingAgency?: string;
  budget?: number;
}

export interface CompleteResearchProjectApiRequestDto {
  endDate: string;
}
