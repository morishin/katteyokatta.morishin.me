import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { IncomingMessage, ServerResponse } from "http";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import superjson from "superjson";
import { pinoLogger } from "~/lib/server/pinoLogger";
import { createContext } from "~/lib/server/trpc/context";
import { AppRouter, appRouter } from "~/lib/server/trpc/routers/appRouter";

const _ssgHelperGen = () => {
  throw new Error("Only for type inference");
  return createProxySSGHelpers<AppRouter>({} as any);
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
    url: string | undefined;
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

    const ssg = createProxySSGHelpers<AppRouter>({
      router: appRouter,
      ctx: createContext as any, // TODO: type mismatch??
      transformer: superjson,
    });

    const url = req.url
      ? new URL(req.url, `https://${req.headers.host}`).toString()
      : undefined;

    const pageProps = await getServerSideProps(context, { session, ssg, url });
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
