import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import {
  createEventSchema,
  getEventsQuerySchema,
} from '../validations/event.validation.js';
import { createEvent, getEvents } from '../services/event.service.js';

const handleValidationError = (error: ZodError) => {
  const formattedErrors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return {
    error: 'Validation failed',
    details: formattedErrors,
  };
};

export const registerEventRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/api/events', async (request, reply) => {
    try {
      const validatedData = createEventSchema.parse(request.body);
      const event = await createEvent(validatedData);

      return reply.status(201).send(event);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error));
      }

      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/api/events', async (request, reply) => {
    try {
      const validatedQuery = getEventsQuerySchema.parse(request.query);
      const events = await getEvents(validatedQuery.date_from, validatedQuery.date_to);

      return reply.status(200).send(events);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error));
      }

      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};
