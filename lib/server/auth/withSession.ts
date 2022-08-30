import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import pinoHttp from "pino-http";
import { IncomingMessage, ServerResponse } from "http";

type GetServerSidePropsWithSession<
  P extends { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>,
  session: Session | null
) => Promise<GetServerSidePropsResult<P>>;

export const makeGetServerSidePropsWithSession =
  <
    P extends { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  >(
    getServerSideProps: GetServerSidePropsWithSession<P, Q, D>,
    logger: Logger = pinoLogger
  ): GetServerSideProps<P & { session: Session | null }, Q, D> =>
  async (context) => {
    logger(context.req, context.res);
    const { req } = context;
    const session = await getSession({ req });
    const pageProps = await getServerSideProps(context, session);
    if ("props" in pageProps) {
      const props =
        pageProps.props instanceof Promise
          ? await pageProps.props
          : pageProps.props;
      return { props: { ...props, session } };
    }
    return pageProps;
  };

type Logger = (req: IncomingMessage, res: ServerResponse) => void;
const pinoLogger = pinoHttp({
  serializers: {
    req(req: IncomingMessage) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        headers: {
          "x-amzn-trace-id": req.headers["x-amzn-trace-id"],
        },
      };
    },
    res(res: ServerResponse) {
      return {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      };
    },
  },
});
