/**
 * RIOS — Domain Form Schemas
 *
 * Zod schemas for the create/edit forms. Field names mirror the ✅ VERIFIED
 * backend create DTOs in @rios/application (NOT the display types in
 * @/types/api, which differ) so a valid form maps 1:1 to a valid request body:
 *   - Award    → CreateAwardDto      (category, sponsorOrAgency, awardDate)
 *   - Grant    → CreateGrantDto       (grantNumber, fundingAgency)
 *   - Patent   → CreatePatentDto      (patentNumber, patentType, filingDate)
 *   - Activity → CreateProfessionalActivityDto (category)
 *   - Dataset  → CreateDatasetDto
 *   - Publication / Project → publication-dtos.ts
 *
 * `profileId` is required by every create endpoint but is injected by the page
 * from the resolved research profile, so it is intentionally NOT part of these
 * user-facing schemas.
 *
 * Client validation improves UX before a request is sent; the backend remains
 * the source of truth.
 */

import { z } from 'zod';

const requiredText = (label: string, max = 300) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const optionalText = (max = 2000) =>
  z.string().trim().max(max, 'This field is too long').optional().or(z.literal(''));

/** A comma-separated list transformed into a clean string[]. */
const commaList = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

/* ── Publication ── */
export const PUBLICATION_TYPES = [
  'JOURNAL_ARTICLE',
  'CONFERENCE_PAPER',
  'BOOK',
  'BOOK_CHAPTER',
  'PREPRINT',
  'THESIS',
  'TECHNICAL_REPORT',
  'OTHER',
] as const;

export const publicationSchema = z.object({
  title: requiredText('Title', 500),
  type: z.enum(PUBLICATION_TYPES, { errorMap: () => ({ message: 'Select a publication type' }) }),
  year: z
    .union([
      z.coerce.number().int().min(1900, 'Enter a valid year').max(2100, 'Enter a valid year'),
      z.literal(''),
    ])
    .optional(),
  doi: optionalText(200),
  url: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  abstract: optionalText(5000),
  keywords: commaList,
  authors: z.string().optional(), // "Name, Name" — split + ordered on submit
});
export type PublicationFormValues = z.input<typeof publicationSchema>;

/* ── Research Project ── */
export const projectSchema = z.object({
  title: requiredText('Title', 300),
  description: requiredText('Description', 5000),
  startDate: requiredText('Start date', 40),
  endDate: z.string().optional().or(z.literal('')),
  fundingAgency: optionalText(200),
  grantIdentifier: optionalText(120),
});
export type ProjectFormValues = z.input<typeof projectSchema>;

/* ── Dataset ── */
export const datasetSchema = z.object({
  title: requiredText('Title', 300),
  description: requiredText('Description', 5000),
  license: optionalText(120),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'INTERNAL', 'RESTRICTED']).optional(),
  datasetUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
});
export type DatasetFormValues = z.input<typeof datasetSchema>;

/* ── Award ── */
export const awardSchema = z.object({
  title: requiredText('Title', 300),
  category: requiredText('Category', 120),
  sponsorOrAgency: optionalText(200),
  awardDate: z.string().optional().or(z.literal('')),
  description: optionalText(2000),
});
export type AwardFormValues = z.input<typeof awardSchema>;

/* ── Grant ── */
export const grantSchema = z.object({
  title: requiredText('Title', 300),
  grantNumber: requiredText('Grant number', 120),
  fundingAgency: requiredText('Funding agency', 200),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter an amount' })
    .min(0, 'Amount must be positive'),
  currency: requiredText('Currency', 8),
  startDate: requiredText('Start date', 40),
  endDate: requiredText('End date', 40),
  description: optionalText(2000),
});
export type GrantFormValues = z.input<typeof grantSchema>;

/* ── Patent ── */
export const PATENT_TYPES = ['UTILITY', 'DESIGN', 'PLANT', 'PROVISIONAL', 'OTHER'] as const;

export const patentSchema = z.object({
  title: requiredText('Title', 300),
  patentNumber: requiredText('Patent number', 120),
  patentType: z.enum(PATENT_TYPES, { errorMap: () => ({ message: 'Select a patent type' }) }),
  status: requiredText('Status', 40),
  filingDate: requiredText('Filing date', 40),
  assigneeOrganization: optionalText(200),
  abstract: optionalText(2000),
});
export type PatentFormValues = z.input<typeof patentSchema>;

/* ── Professional Activity ── */
export const ACTIVITY_CATEGORIES = [
  'EDITORIAL',
  'REVIEW',
  'COMMITTEE',
  'TALK',
  'TEACHING',
  'MENTORSHIP',
  'SERVICE',
  'OTHER',
] as const;

export const activitySchema = z.object({
  title: requiredText('Title', 300),
  category: z.enum(ACTIVITY_CATEGORIES, { errorMap: () => ({ message: 'Select a category' }) }),
  organization: optionalText(200),
  role: optionalText(120),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  description: optionalText(2000),
});
export type ActivityFormValues = z.input<typeof activitySchema>;

/* ── Profile biography (PUT /research-profiles/:id/biography) ── */
export const biographySchema = z.object({
  headline: optionalText(200),
  biography: optionalText(5000),
});
export type BiographyFormValues = z.input<typeof biographySchema>;
