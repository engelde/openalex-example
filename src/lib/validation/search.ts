import { z } from 'zod'

export const searchSchema = z
  .object({
    author: z
      .string({
        message: 'Invalid Author',
      })
      .min(1, {
        message: 'Invalid Author',
      }),
    startYear: z
      .string({
        message: 'Invalid Start Year',
      })
      .optional()
      .refine((value) => (value ? /^\d{4}$/.test(value) : true), 'Invalid Start Year'),
    endYear: z
      .string({
        message: 'Invalid End Year',
      })
      .optional()
      .refine((value) => (value ? /^\d{4}$/.test(value) : true), 'Invalid End Year'),
  })
  .required({
    author: true,
  })
