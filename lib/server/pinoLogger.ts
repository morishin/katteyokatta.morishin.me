import { IncomingMessage, ServerResponse } from "http";
import pinoHttp from "pino-http";

export const pinoLogger = pinoHttp({
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
  serializers: {
    req(req: IncomingMessage) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: (req as any).query,
        headers: {
          referer: req.headers["referer"],
          "user-agent": req.headers["user-agent"],
        },
      };
    },
    res(res: ServerResponse) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
