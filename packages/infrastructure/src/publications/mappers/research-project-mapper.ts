/**
 * ResearchProject Mapper
 */

import {
  FundingIdentifier,
  ProjectMember,
  ProjectRole,
  ProjectRoleType,
  ProjectStatus,
  ResearchProject,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export interface PrismaProjectFull {
  id: string;
  profileId: string;
  title: string;
  description: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  grantIdentifier: string | null;
  fundingAgency: string | null;
  budget: number | null;
  createdAt: Date;
  updatedAt: Date;
  members?: Array<{
    id: string;
    projectId: string;
    profileId: string | null;
    name: string;
    role: string;
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
  }>;
}

export class ResearchProjectMapper {
  public static toDomain(raw: PrismaProjectFull): ResearchProject {
    const profileId = UniqueId.from(raw.profileId);
    const grantId =
      typeof raw.grantIdentifier === 'string' && raw.grantIdentifier.length > 0
        ? FundingIdentifier.from(raw.grantIdentifier)
        : undefined;

    const members: ProjectMember[] = [];
    if (raw.members) {
      for (const m of raw.members) {
        const role = ProjectRole.from(m.role as ProjectRoleType);
        const mRes = ProjectMember.create(
          {
            profileId: m.profileId ?? undefined,
            name: m.name,
            role,
            startDate: m.startDate,
            endDate: m.endDate ?? undefined,
          },
          UniqueId.from(m.id),
        );
        if (mRes.isSuccess) members.push(mRes.value);
      }
    }

    const pRes = ResearchProject.create(
      {
        profileId,
        title: raw.title,
        description: raw.description,
        status: raw.status as ProjectStatus,
        startDate: raw.startDate,
        endDate: raw.endDate ?? undefined,
        grantIdentifier: grantId,
        fundingAgency: raw.fundingAgency ?? undefined,
        budget: raw.budget ?? undefined,
        members,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      UniqueId.from(raw.id),
    );

    if (pRes.isFailure) {
      throw new Error(`Failed to map ResearchProject from persistence: ${pRes.error}`);
    }

    return pRes.value;
  }

  public static toPersistence(project: ResearchProject): {
    id: string;
    profileId: string;
    title: string;
    description: string;
    status: string;
    startDate: Date;
    endDate: Date | null;
    grantIdentifier: string | null;
    fundingAgency: string | null;
    budget: number | null;
  } {
    return {
      id: project.id.value,
      profileId: project.profileId.value,
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate ?? null,
      grantIdentifier: project.grantIdentifier?.value ?? null,
      fundingAgency: project.fundingAgency ?? null,
      budget: project.budget ?? null,
    };
  }
}
