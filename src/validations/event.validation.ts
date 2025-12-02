import { z } from 'zod';

const eventTypeEnum = z.enum(['payment', 'upsell'], {
  errorMap: () => ({ message: 'Type must be either "payment" or "upsell"' }),
});

export const createEventSchema = z.object({
  type: eventTypeEnum,
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  value: z.number().positive('Value must be a positive number'),
  timestamp: z.string().datetime().optional(),
});

export const createEventQuerySchema = z.object({
  type: eventTypeEnum,
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  value: z.coerce.number().positive('Value must be a positive number'),
  timestamp: z.string().datetime().optional(),
});

const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine(isValidDate, { message: 'Invalid date' })
  .optional();

export const getEventsQuerySchema = z.object({
  date_from: dateSchema,
  date_to: dateSchema,
});
