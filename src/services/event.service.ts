import { prisma } from '../database/prisma.js';
import type { CreateEventInput, EventResponse } from '../types/event.types.js';

const calculateDefaultDateRange = () => {
  const dateTo = new Date();
  dateTo.setUTCHours(23, 59, 59, 999);

  const dateFrom = new Date(dateTo);
  dateFrom.setDate(dateFrom.getDate() - 7);
  dateFrom.setUTCHours(0, 0, 0, 0);

  return { dateFrom, dateTo };
};

const parseDate = (dateString: string, isEndOfDay: boolean = false): Date => {
  const date = new Date(dateString);

  if (isEndOfDay) {
    date.setUTCHours(23, 59, 59, 999);
  } else {
    date.setUTCHours(0, 0, 0, 0);
  }

  return date;
};

const transformEventToResponse = (event: {
  id: string;
  type: string;
  name: string;
  email: string;
  value: any;
  timestamp: Date;
}): EventResponse => {
  return {
    id: event.id,
    type: event.type as 'payment' | 'upsell',
    name: event.name,
    email: event.email,
    value: Number(event.value),
    timestamp: event.timestamp.toISOString(),
  };
};

export const createEvent = async (input: CreateEventInput): Promise<EventResponse> => {
  const timestamp = input.timestamp ? new Date(input.timestamp) : new Date();

  const event = await prisma.event.create({
    data: {
      type: input.type,
      name: input.name,
      email: input.email,
      value: input.value,
      timestamp,
    },
  });

  return transformEventToResponse(event);
};

export const getEvents = async (
  dateFrom?: string,
  dateTo?: string
): Promise<EventResponse[]> => {
  const { dateFrom: defaultFrom, dateTo: defaultTo } = calculateDefaultDateRange();

  const startDate = dateFrom ? parseDate(dateFrom, false) : defaultFrom;
  const endDate = dateTo ? parseDate(dateTo, true) : defaultTo;

  const events = await prisma.event.findMany({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  return events.map(transformEventToResponse);
};
