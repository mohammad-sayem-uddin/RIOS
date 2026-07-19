/**
 * Publications Domain Errors
 */

import { DomainError } from '@rios/shared';

export class PublicationsDomainError extends DomainError {
  constructor(message: string, code: string = 'PUBLICATIONS_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class PublicationNotFoundError extends DomainError {
  constructor(publicationId: string) {
    super(`Publication with ID ${publicationId} was not found`, 'PUBLICATION_NOT_FOUND');
  }
}

export class ProjectNotFoundError extends DomainError {
  constructor(projectId: string) {
    super(`Research Project with ID ${projectId} was not found`, 'PROJECT_NOT_FOUND');
  }
}

export class InvalidDOIError extends DomainError {
  constructor(doi: string) {
    super(`Invalid DOI provided: ${doi}`, 'INVALID_DOI');
  }
}

export class InvalidPublicationStateError extends DomainError {
  constructor(reason: string) {
    super(`Invalid publication state transition: ${reason}`, 'INVALID_PUBLICATION_STATE');
  }
}

export class MissingPIRoleError extends DomainError {
  constructor() {
    super(
      'A research project must have at least one Principal Investigator (PI)',
      'MISSING_PI_ROLE',
    );
  }
}

export class DuplicateAuthorError extends DomainError {
  constructor(identifier: string) {
    super(`Duplicate author detected: ${identifier}`, 'DUPLICATE_AUTHOR');
  }
}

export class DuplicateORCIDError extends DomainError {
  constructor(orcid: string) {
    super(`Author with ORCID ${orcid} is already added`, 'DUPLICATE_ORCID');
  }
}
