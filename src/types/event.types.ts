export type EventType = 'payment' | 'upsell';

export interface CreateEventInput {
  type: EventType;
  name: string;
  email: string;
  value: number;
  timestamp?: string;
}

export interface EventResponse {
  id: string;
  type: EventType;
  name: string;
  email: string;
  value: number;
  timestamp: string;
}

export interface GetEventsQuery {
  date_from?: string;
  date_to?: string;
}
