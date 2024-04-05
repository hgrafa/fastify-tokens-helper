import fastify from "fastify";
import cookie from "@fastify/cookie";

import { z } from "zod";

const app = fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

app.register(cookie);

const tokensBodySchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

app.get("/", (request, reply) => {
  return reply.status(200).send({ message: "im working :)" });
});

app.post("/tokens", async (request, reply) => {
  try {
    const { access, refresh } = tokensBodySchema.parse(request.body);

    reply.setCookie("frontendadda.token.access", access, {
      path: "/",
      maxAge: 1000 * 60, // 1 minute
    });

    reply.setCookie("frontendadda.token.refresh", refresh, {
      path: "/",
      maxAge: 1000 * 60 * 2, // 2 minutes
    });

    return reply.status(201).send({ message: "tokens should be set" });
  } catch (error) {
    return reply.status(400).send({ message: "invalid body" });
  }
});

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
  }

  console.log(`Server listening at ${address}`);
});
