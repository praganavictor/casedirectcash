import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerEventRoutes } from './routes/event.routes.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

const createServer = () => {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
    },
  });

  return fastify;
};

const registerPlugins = async (fastify: ReturnType<typeof createServer>) => {
  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(fastifyStatic, {
    root: join(currentDirPath, '../public'),
    prefix: '/',
  });
};

const registerRoutes = async (fastify: ReturnType<typeof createServer>) => {
  await registerEventRoutes(fastify);
};

const setupErrorHandler = (fastify: ReturnType<typeof createServer>) => {
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error);

    const statusCode = (error as any).statusCode ?? 500;
    const message = statusCode === 500 ? 'Internal server error' : (error as Error).message;

    reply.status(statusCode).send({
      error: message,
      statusCode,
    });
  });
};

const startServer = async () => {
  const fastify = createServer();

  try {
    await registerPlugins(fastify);
    await registerRoutes(fastify);
    setupErrorHandler(fastify);

    const port = Number(process.env.PORT) || 3000;
    const host = '0.0.0.0';

    await fastify.listen({ port, host });

    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

startServer();
