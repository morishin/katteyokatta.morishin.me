import { createSSGHelpers } from "@trpc/react/ssg";
import { IncomingMessage, ServerResponse } from "http";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import pinoHttp from "pino-http";
import { ParsedUrlQuery } from "querystring";
import { createContext } from "react";
import superjson from "superjson";
import { AppRouter, appRouter } from "~/lib/server/trpc/routers/_app";

const _ssgHelperGen = () => {
  throw new Error("Only for type inference");
  return createSSGHelpers<AppRouter>({} as any);
};
type CreateSSGHelpersReturnType = ReturnType<typeof _ssgHelperGen>;
type GetServerSidePropsWithParams<
  P extends { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>,
  params: {
    session: Session | null;
    ssg: CreateSSGHelpersReturnType;
  }
) => Promise<GetServerSidePropsResult<P>>;

export const makeGetServerSideProps =
  <
    P extends { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  >(
    getServerSideProps: GetServerSidePropsWithParams<P, Q, D>,
    logger: Logger = pinoLogger
  ): GetServerSideProps<P & { session: Session | null }, Q, D> =>
  async (context) => {
    logger(context.req, context.res);
    const { req } = context;
    const session = await getSession({ req });

    const ssg = createSSGHelpers<AppRouter>({
      router: appRouter,
      ctx: createContext,
      transformer: superjson,
    });

    const pageProps = await getServerSideProps(context, { session, ssg });
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
