/**
 * Publication Application Service Implementation
 */

import {
  Abstract,
  AffiliationSnapshot,
  Author,
  DOI,
  Funding,
  FundingIdentifier,
  ISBN,
  ISSN,
  IPublicationRepository,
  IResearchProjectRepository,
  IVenueRepository,
  Keywords,
  Language,
  ORCID,
  ProjectId,
  ProjectMember,
  ProjectRole,
  ProjectStatus,
  Publication,
  PublicationId,
  PublicationNotFoundError,
  PublicationStatus,
  PublicationTitle,
  PublicationType,
  PublicationYear,
  Publisher,
  ProjectNotFoundError,
  ResearchProject,
  URL,
  Venue,
} from '@rios/domain';
import { Result, UniqueId } from '@rios/shared';

import type {
  AuthorInputDto,
  CreatePublicationDto,
  CreateResearchProjectDto,
  FundingInputDto,
  ProjectMemberInputDto,
  PublicationOutputDto,
  PublicationStatisticsDto,
  PublisherInputDto,
  ResearchProjectOutputDto,
  UpdatePublicationDto,
  UpdateResearchProjectDto,
  VenueInputDto,
} from '../dto/publication-dtos.js';

import type { PublicationApplicationService } from './publication-application-service.js';

export class PublicationApplicationServiceImpl implements PublicationApplicationService {
  constructor(
    private readonly publicationRepository: IPublicationRepository,
    private readonly projectRepository: IResearchProjectRepository,
    private readonly venueRepository: IVenueRepository,
  ) {}

  public async createPublication(dto: CreatePublicationDto): Promise<Result<PublicationOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const titleRes = PublicationTitle.create(dto.title);
      if (titleRes.isFailure) return Result.fail<PublicationOutputDto>(titleRes.error);

      const typeRes = PublicationType.create(dto.type);
      if (typeRes.isFailure) return Result.fail<PublicationOutputDto>(typeRes.error);

      let status: PublicationStatus | undefined;
      if (typeof dto.status === 'string' && dto.status.length > 0) {
        const statusRes = PublicationStatus.create(dto.status);
        if (statusRes.isFailure) return Result.fail<PublicationOutputDto>(statusRes.error);
        status = statusRes.value;
      }

      let doi: DOI | undefined;
      if (typeof dto.doi === 'string' && dto.doi.length > 0) {
        const doiRes = DOI.create(dto.doi);
        if (doiRes.isFailure) return Result.fail<PublicationOutputDto>(doiRes.error);
        doi = doiRes.value;

        // Ensure DOI uniqueness
        const existingDoi = await this.publicationRepository.findByDOI(doi);
        if (existingDoi) {
          return Result.fail<PublicationOutputDto>(
            `Publication with DOI ${dto.doi} already exists.`,
          );
        }
      }

      let isbn: ISBN | undefined;
      if (typeof dto.isbn === 'string' && dto.isbn.length > 0) {
        const isbnRes = ISBN.create(dto.isbn);
        if (isbnRes.isFailure) return Result.fail<PublicationOutputDto>(isbnRes.error);
        isbn = isbnRes.value;
      }

      let abstractVal: Abstract | undefined;
      if (typeof dto.abstract === 'string' && dto.abstract.length > 0) {
        const abstractRes = Abstract.create(dto.abstract);
        if (abstractRes.isFailure) return Result.fail<PublicationOutputDto>(abstractRes.error);
        abstractVal = abstractRes.value;
      }

      let keywordsVal: Keywords | undefined;
      if (dto.keywords && dto.keywords.length > 0) {
        const keywordsRes = Keywords.create(dto.keywords);
        if (keywordsRes.isFailure) return Result.fail<PublicationOutputDto>(keywordsRes.error);
        keywordsVal = keywordsRes.value;
      }

      let yearVal: PublicationYear | undefined;
      if (dto.year !== undefined) {
        const yearRes = PublicationYear.create(dto.year);
        if (yearRes.isFailure) return Result.fail<PublicationOutputDto>(yearRes.error);
        yearVal = yearRes.value;
      }

      let urlVal: URL | undefined;
      if (typeof dto.url === 'string' && dto.url.length > 0) {
        const urlRes = URL.create(dto.url);
        if (urlRes.isFailure) return Result.fail<PublicationOutputDto>(urlRes.error);
        urlVal = urlRes.value;
      }

      let languageVal: Language | undefined;
      if (typeof dto.language === 'string' && dto.language.length > 0) {
        const langRes = Language.create(dto.language);
        if (langRes.isFailure) return Result.fail<PublicationOutputDto>(langRes.error);
        languageVal = langRes.value;
      }

      // Build Authors
      const authors: Author[] = [];
      if (dto.authors) {
        for (const aDto of dto.authors) {
          const authorRes = this.buildAuthor(aDto);
          if (authorRes.isFailure) return Result.fail<PublicationOutputDto>(authorRes.error);
          authors.push(authorRes.value);
        }
      }

      // Build Venue if provided
      let venue: Venue | undefined;
      if (dto.venue) {
        const venueRes = this.buildVenue(dto.venue);
        if (venueRes.isFailure) return Result.fail<PublicationOutputDto>(venueRes.error);
        venue = venueRes.value;
        await this.venueRepository.save(venue);
      }

      // Build Publisher if provided
      let publisher: Publisher | undefined;
      if (dto.publisher) {
        const publisherRes = this.buildPublisher(dto.publisher);
        if (publisherRes.isFailure) return Result.fail<PublicationOutputDto>(publisherRes.error);
        publisher = publisherRes.value;
      }

      // Build Fundings
      const fundings: Funding[] = [];
      if (dto.fundings) {
        for (const fDto of dto.fundings) {
          const fundingRes = this.buildFunding(fDto);
          if (fundingRes.isFailure) return Result.fail<PublicationOutputDto>(fundingRes.error);
          fundings.push(fundingRes.value);
        }
      }

      const publicationRes = Publication.create({
        profileId,
        title: titleRes.value,
        type: typeRes.value,
        status,
        doi,
        isbn,
        abstract: abstractVal,
        keywords: keywordsVal,
        year: yearVal,
        url: urlVal,
        language: languageVal,
        authors,
        venue,
        publisher,
        fundings,
      });

      if (publicationRes.isFailure) {
        return Result.fail<PublicationOutputDto>(publicationRes.error);
      }

      const publication = publicationRes.value;
      await this.publicationRepository.save(publication);

      return Result.ok<PublicationOutputDto>(this.mapPublicationToDto(publication));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create publication';
      return Result.fail<PublicationOutputDto>(msg);
    }
  }

  public async updatePublication(dto: UpdatePublicationDto): Promise<Result<PublicationOutputDto>> {
    try {
      const pubId = PublicationId.from(dto.id);
      const publication = await this.publicationRepository.findById(pubId);
      if (!publication) {
        return Result.fail<PublicationOutputDto>(new PublicationNotFoundError(dto.id).message);
      }

      if (typeof dto.title === 'string' && dto.title.length > 0) {
        const titleRes = PublicationTitle.create(dto.title);
        if (titleRes.isFailure) return Result.fail<PublicationOutputDto>(titleRes.error);
        publication.updateTitle(titleRes.value);
      }

      await this.publicationRepository.save(publication);
      return Result.ok<PublicationOutputDto>(this.mapPublicationToDto(publication));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update publication';
      return Result.fail<PublicationOutputDto>(msg);
    }
  }

  public async publishPublication(
    id: string,
    publishedDateStr: string,
  ): Promise<Result<PublicationOutputDto>> {
    try {
      const pubId = PublicationId.from(id);
      const publication = await this.publicationRepository.findById(pubId);
      if (!publication) {
        return Result.fail<PublicationOutputDto>(new PublicationNotFoundError(id).message);
      }

      const publishedDate = new Date(publishedDateStr);
      const res = publication.publish(publishedDate);
      if (res.isFailure) return Result.fail<PublicationOutputDto>(res.error);

      await this.publicationRepository.save(publication);
      return Result.ok<PublicationOutputDto>(this.mapPublicationToDto(publication));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish publication';
      return Result.fail<PublicationOutputDto>(msg);
    }
  }

  public async submitPublication(
    id: string,
    submittedDateStr: string,
  ): Promise<Result<PublicationOutputDto>> {
    try {
      const pubId = PublicationId.from(id);
      const publication = await this.publicationRepository.findById(pubId);
      if (!publication) {
        return Result.fail<PublicationOutputDto>(new PublicationNotFoundError(id).message);
      }

      const submittedDate = new Date(submittedDateStr);
      const res = publication.submit(submittedDate);
      if (res.isFailure) return Result.fail<PublicationOutputDto>(res.error);

      await this.publicationRepository.save(publication);
      return Result.ok<PublicationOutputDto>(this.mapPublicationToDto(publication));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit publication';
      return Result.fail<PublicationOutputDto>(msg);
    }
  }

  public async deletePublication(id: string): Promise<Result<void>> {
    try {
      const pubId = PublicationId.from(id);
      const publication = await this.publicationRepository.findById(pubId);
      if (!publication) {
        return Result.fail<void>(new PublicationNotFoundError(id).message);
      }
      await this.publicationRepository.delete(pubId);
      return Result.ok<void>();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete publication';
      return Result.fail<void>(msg);
    }
  }

  public async getPublicationById(id: string): Promise<Result<PublicationOutputDto>> {
    try {
      const pubId = PublicationId.from(id);
      const publication = await this.publicationRepository.findById(pubId);
      if (!publication) {
        return Result.fail<PublicationOutputDto>(new PublicationNotFoundError(id).message);
      }
      return Result.ok<PublicationOutputDto>(this.mapPublicationToDto(publication));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch publication';
      return Result.fail<PublicationOutputDto>(msg);
    }
  }

  public async searchPublications(
    query: string,
    filters?: { type?: string; status?: string; year?: number; profileId?: string },
  ): Promise<Result<PublicationOutputDto[]>> {
    try {
      const results = await this.publicationRepository.search(query, filters);
      return Result.ok<PublicationOutputDto[]>(results.map((p) => this.mapPublicationToDto(p)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to search publications';
      return Result.fail<PublicationOutputDto[]>(msg);
    }
  }

  public async getPublicationsByProfileId(
    profileIdStr: string,
  ): Promise<Result<PublicationOutputDto[]>> {
    try {
      const profileId = UniqueId.from(profileIdStr);
      const publications = await this.publicationRepository.findByResearchProfile(profileId);
      return Result.ok<PublicationOutputDto[]>(
        publications.map((p) => this.mapPublicationToDto(p)),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch profile publications';
      return Result.fail<PublicationOutputDto[]>(msg);
    }
  }

  public async getPublicationStatistics(
    profileIdStr: string,
  ): Promise<Result<PublicationStatisticsDto>> {
    try {
      const profileId = UniqueId.from(profileIdStr);
      const publications = await this.publicationRepository.findByResearchProfile(profileId);

      const totalPublications = publications.length;
      let publishedCount = 0;
      let underReviewCount = 0;
      let totalCitations = 0;
      const citationCounts: number[] = [];
      const byType: Record<string, number> = {};
      const byYear: Record<number, number> = {};

      for (const pub of publications) {
        if (pub.status.isPublished()) publishedCount++;
        if (pub.status.isUnderReview()) underReviewCount++;

        const count = pub.citationCount.value;
        totalCitations += count;
        citationCounts.push(count);

        const typeStr = pub.type.value;
        byType[typeStr] = (byType[typeStr] ?? 0) + 1;

        if (pub.year) {
          const yr = pub.year.value;
          byYear[yr] = (byYear[yr] ?? 0) + 1;
        }
      }

      // Calculate h-index
      citationCounts.sort((a, b) => b - a);
      let hIndex = 0;
      for (let i = 0; i < citationCounts.length; i++) {
        const count = citationCounts[i];
        if (count !== undefined && count >= i + 1) {
          hIndex = i + 1;
        } else {
          break;
        }
      }

      // Calculate i10-index
      const i10Index = citationCounts.filter((c) => c >= 10).length;

      return Result.ok<PublicationStatisticsDto>({
        totalPublications,
        publishedCount,
        underReviewCount,
        totalCitations,
        hIndex,
        i10Index,
        byType,
        byYear,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate statistics';
      return Result.fail<PublicationStatisticsDto>(msg);
    }
  }

  public async createResearchProject(
    dto: CreateResearchProjectDto,
  ): Promise<Result<ResearchProjectOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const startDate = new Date(dto.startDate);
      const endDate =
        typeof dto.endDate === 'string' && dto.endDate.length > 0
          ? new Date(dto.endDate)
          : undefined;

      let grantId: FundingIdentifier | undefined;
      if (typeof dto.grantIdentifier === 'string' && dto.grantIdentifier.length > 0) {
        const grantRes = FundingIdentifier.create(dto.grantIdentifier);
        if (grantRes.isFailure) return Result.fail<ResearchProjectOutputDto>(grantRes.error);
        grantId = grantRes.value;
      }

      const members: ProjectMember[] = [];
      for (const mDto of dto.members) {
        const memberRes = this.buildProjectMember(mDto);
        if (memberRes.isFailure) return Result.fail<ResearchProjectOutputDto>(memberRes.error);
        members.push(memberRes.value);
      }

      if (!members.some((m) => m.role.isPI())) {
        const piRoleRes = ProjectRole.create('PRINCIPAL_INVESTIGATOR');
        if (piRoleRes.isSuccess) {
          const piMemberRes = ProjectMember.create({
            profileId: dto.profileId,
            name: 'Principal Investigator',
            role: piRoleRes.value,
            startDate,
          });
          if (piMemberRes.isSuccess) {
            members.unshift(piMemberRes.value);
          }
        }
      }

      const projectRes = ResearchProject.create({
        profileId,
        title: dto.title,
        description: dto.description,
        status: (typeof dto.status === 'string' && dto.status.length > 0
          ? dto.status
          : 'ACTIVE') as ProjectStatus,
        startDate,
        endDate,
        grantIdentifier: grantId,
        fundingAgency: dto.fundingAgency,
        budget: dto.budget,
        members,
      });

      if (projectRes.isFailure) return Result.fail<ResearchProjectOutputDto>(projectRes.error);

      const project = projectRes.value;
      await this.projectRepository.save(project);
      return Result.ok<ResearchProjectOutputDto>(this.mapProjectToDto(project));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create research project';
      return Result.fail<ResearchProjectOutputDto>(msg);
    }
  }

  public async updateResearchProject(
    dto: UpdateResearchProjectDto,
  ): Promise<Result<ResearchProjectOutputDto>> {
    try {
      const pId = ProjectId.from(dto.id);
      const project = await this.projectRepository.findById(pId);
      if (!project)
        return Result.fail<ResearchProjectOutputDto>(new ProjectNotFoundError(dto.id).message);

      await this.projectRepository.save(project);
      return Result.ok<ResearchProjectOutputDto>(this.mapProjectToDto(project));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update research project';
      return Result.fail<ResearchProjectOutputDto>(msg);
    }
  }

  public async completeResearchProject(
    id: string,
    endDateStr: string,
  ): Promise<Result<ResearchProjectOutputDto>> {
    try {
      const pId = ProjectId.from(id);
      const project = await this.projectRepository.findById(pId);
      if (!project)
        return Result.fail<ResearchProjectOutputDto>(new ProjectNotFoundError(id).message);

      const endDate = new Date(endDateStr);
      const res = project.complete(endDate);
      if (res.isFailure) return Result.fail<ResearchProjectOutputDto>(res.error);

      await this.projectRepository.save(project);
      return Result.ok<ResearchProjectOutputDto>(this.mapProjectToDto(project));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete project';
      return Result.fail<ResearchProjectOutputDto>(msg);
    }
  }

  public async deleteResearchProject(id: string): Promise<Result<void>> {
    try {
      const pId = ProjectId.from(id);
      const project = await this.projectRepository.findById(pId);
      if (!project) return Result.fail<void>(new ProjectNotFoundError(id).message);

      await this.projectRepository.delete(pId);
      return Result.ok<void>();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete research project';
      return Result.fail<void>(msg);
    }
  }

  public async getResearchProjectById(id: string): Promise<Result<ResearchProjectOutputDto>> {
    try {
      const pId = ProjectId.from(id);
      const project = await this.projectRepository.findById(pId);
      if (!project)
        return Result.fail<ResearchProjectOutputDto>(new ProjectNotFoundError(id).message);

      return Result.ok<ResearchProjectOutputDto>(this.mapProjectToDto(project));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch project';
      return Result.fail<ResearchProjectOutputDto>(msg);
    }
  }

  public async getResearchProjectsByProfileId(
    profileIdStr: string,
  ): Promise<Result<ResearchProjectOutputDto[]>> {
    try {
      const profileId = UniqueId.from(profileIdStr);
      const projects = await this.projectRepository.findByResearchProfile(profileId);
      return Result.ok<ResearchProjectOutputDto[]>(projects.map((p) => this.mapProjectToDto(p)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch profile projects';
      return Result.fail<ResearchProjectOutputDto[]>(msg);
    }
  }

  public async addProjectMember(
    projectId: string,
    memberDto: ProjectMemberInputDto,
  ): Promise<Result<ResearchProjectOutputDto>> {
    try {
      const pId = ProjectId.from(projectId);
      const project = await this.projectRepository.findById(pId);
      if (!project)
        return Result.fail<ResearchProjectOutputDto>(new ProjectNotFoundError(projectId).message);

      const memberRes = this.buildProjectMember(memberDto);
      if (memberRes.isFailure) return Result.fail<ResearchProjectOutputDto>(memberRes.error);

      const addRes = project.addMember(memberRes.value);
      if (addRes.isFailure) return Result.fail<ResearchProjectOutputDto>(addRes.error);

      await this.projectRepository.save(project);
      return Result.ok<ResearchProjectOutputDto>(this.mapProjectToDto(project));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add project member';
      return Result.fail<ResearchProjectOutputDto>(msg);
    }
  }

  public async removeProjectMember(
    projectId: string,
    memberId: string,
  ): Promise<Result<ResearchProjectOutputDto>> {
    try {
      const pId = ProjectId.from(projectId);
      const project = await this.projectRepository.findById(pId);
      if (!project)
        return Result.fail<ResearchProjectOutputDto>(new ProjectNotFoundError(projectId).message);

      const remRes = project.removeMember(memberId);
      if (remRes.isFailure) return Result.fail<ResearchProjectOutputDto>(remRes.error);

      await this.projectRepository.save(project);
      return Result.ok<ResearchProjectOutputDto>(this.mapProjectToDto(project));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove project member';
      return Result.fail<ResearchProjectOutputDto>(msg);
    }
  }

  // Private Helper Methods
  private buildAuthor(dto: AuthorInputDto): Result<Author> {
    let orcidVal: ORCID | undefined;
    if (typeof dto.orcid === 'string' && dto.orcid.length > 0) {
      const oRes = ORCID.create(dto.orcid);
      if (oRes.isFailure) return Result.fail<Author>(oRes.error);
      orcidVal = oRes.value;
    }

    const affiliations: AffiliationSnapshot[] = [];
    if (dto.affiliations) {
      for (const aff of dto.affiliations) {
        const affRes = AffiliationSnapshot.create(aff);
        if (affRes.isFailure) return Result.fail<Author>(affRes.error);
        affiliations.push(affRes.value);
      }
    }

    return Author.create({
      name: dto.name,
      email: dto.email,
      orcid: orcidVal,
      authorOrder: dto.authorOrder,
      isCorresponding: dto.isCorresponding,
      affiliations,
    });
  }

  private buildVenue(dto: VenueInputDto): Result<Venue> {
    let issn: ISSN | undefined;
    if (typeof dto.issn === 'string' && dto.issn.length > 0) {
      const res = ISSN.create(dto.issn);
      if (res.isFailure) return Result.fail<Venue>(res.error);
      issn = res.value;
    }

    let isbn: ISBN | undefined;
    if (typeof dto.isbn === 'string' && dto.isbn.length > 0) {
      const res = ISBN.create(dto.isbn);
      if (res.isFailure) return Result.fail<Venue>(res.error);
      isbn = res.value;
    }

    let url: URL | undefined;
    if (typeof dto.url === 'string' && dto.url.length > 0) {
      const res = URL.create(dto.url);
      if (res.isFailure) return Result.fail<Venue>(res.error);
      url = res.value;
    }

    return Venue.create({
      name: dto.name,
      venueType: dto.venueType,
      issn,
      isbn,
      publisherId: dto.publisherId,
      url,
    });
  }

  private buildPublisher(dto: PublisherInputDto): Result<Publisher> {
    let websiteUrl: URL | undefined;
    if (typeof dto.websiteUrl === 'string' && dto.websiteUrl.length > 0) {
      const res = URL.create(dto.websiteUrl);
      if (res.isFailure) return Result.fail<Publisher>(res.error);
      websiteUrl = res.value;
    }

    return Publisher.create({
      name: dto.name,
      location: dto.location,
      websiteUrl,
    });
  }

  private buildFunding(dto: FundingInputDto): Result<Funding> {
    let fId: FundingIdentifier | undefined;
    if (typeof dto.fundingIdentifier === 'string' && dto.fundingIdentifier.length > 0) {
      const res = FundingIdentifier.create(dto.fundingIdentifier);
      if (res.isFailure) return Result.fail<Funding>(res.error);
      fId = res.value;
    }

    return Funding.create({
      funderName: dto.funderName,
      fundingIdentifier: fId,
      grantTitle: dto.grantTitle,
      amountCurrency: dto.amountCurrency,
      amountValue: dto.amountValue,
    });
  }

  private buildProjectMember(dto: ProjectMemberInputDto): Result<ProjectMember> {
    const roleRes = ProjectRole.create(dto.role);
    if (roleRes.isFailure) return Result.fail<ProjectMember>(roleRes.error);

    const startDate = new Date(dto.startDate);
    const endDate =
      typeof dto.endDate === 'string' && dto.endDate.length > 0 ? new Date(dto.endDate) : undefined;

    return ProjectMember.create({
      profileId: dto.profileId,
      name: dto.name,
      role: roleRes.value,
      startDate,
      endDate,
    });
  }

  private mapPublicationToDto(pub: Publication): PublicationOutputDto {
    return {
      id: pub.id.value,
      profileId: pub.profileId.value,
      title: pub.title.value,
      type: pub.type.value,
      status: pub.status.value,
      doi: pub.doi?.value,
      isbn: pub.isbn?.value,
      abstract: pub.abstract?.value,
      keywords: pub.keywords ? pub.keywords.values : [],
      year: pub.year?.value,
      citationCount: pub.citationCount.value,
      url: pub.url?.value,
      language: pub.language?.value,
      authors: pub.authors.map((a) => ({
        id: a.id.value,
        name: a.name,
        email: a.email,
        orcid: a.orcid?.value,
        authorOrder: a.authorOrder,
        isCorresponding: a.isCorresponding,
        affiliations: a.affiliations.map((aff) => ({
          institution: aff.institution,
          department: aff.department,
          location: aff.location,
        })),
      })),
      venue: pub.venue
        ? {
            id: pub.venue.id.value,
            name: pub.venue.name,
            venueType: pub.venue.venueType,
            issn: pub.venue.issn?.value,
            isbn: pub.venue.isbn?.value,
            publisherId: pub.venue.publisherId,
            url: pub.venue.url?.value,
          }
        : undefined,
      publisher: pub.publisher
        ? {
            id: pub.publisher.id.value,
            name: pub.publisher.name,
            location: pub.publisher.location,
            websiteUrl: pub.publisher.websiteUrl?.value,
          }
        : undefined,
      fundings: pub.fundings.map((f) => ({
        id: f.id.value,
        funderName: f.funderName,
        fundingIdentifier: f.fundingIdentifier?.value,
        grantTitle: f.grantTitle,
        amountCurrency: f.amountCurrency,
        amountValue: f.amountValue,
      })),
      submittedDate: pub.submittedDate?.toISOString(),
      acceptedDate: pub.acceptedDate?.toISOString(),
      publishedDate: pub.publishedDate?.toISOString(),
      createdAt: pub.createdAt.toISOString(),
      updatedAt: pub.updatedAt.toISOString(),
    };
  }

  private mapProjectToDto(project: ResearchProject): ResearchProjectOutputDto {
    return {
      id: project.id.value,
      profileId: project.profileId.value,
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate.toISOString(),
      endDate: project.endDate?.toISOString(),
      grantIdentifier: project.grantIdentifier?.value,
      fundingAgency: project.fundingAgency,
      budget: project.budget,
      members: project.members.map((m) => ({
        id: m.id.value,
        profileId: m.profileId,
        name: m.name,
        role: m.role.value,
        startDate: m.startDate.toISOString(),
        endDate: m.endDate?.toISOString(),
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
