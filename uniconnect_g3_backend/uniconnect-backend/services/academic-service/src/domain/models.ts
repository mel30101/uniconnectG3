import { z } from 'zod';

export const FacultySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type Faculty = z.infer<typeof FacultySchema>;

export const CareerSchema = z.object({
  id: z.string(),
  name: z.string(),
  facultyId: z.string(),
  description: z.string().optional(),
});

export type Career = z.infer<typeof CareerSchema>;

export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  sectionId: z.string().optional(),
  credits: z.number().optional(),
  code: z.string().optional(),
});

export type Subject = z.infer<typeof SubjectSchema>;

export const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  careerId: z.string(),
});

export type Section = z.infer<typeof SectionSchema>;

export const AcademicLevelSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g. "Primer Año", "Segundo Año"
});

export type AcademicLevel = z.infer<typeof AcademicLevelSchema>;

export const FormationLevelSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g. "Tecnología", "Profesional"
});

export type FormationLevel = z.infer<typeof FormationLevelSchema>;

export const AcademicMappingSchema = z.object({
  id: z.string(),
  facultyId: z.string(),
  academicLevelId: z.string(),
  formationLevelId: z.string(),
  careerId: z.string(),
});

export type AcademicMapping = z.infer<typeof AcademicMappingSchema>;
