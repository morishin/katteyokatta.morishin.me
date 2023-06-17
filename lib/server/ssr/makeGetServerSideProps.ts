import { createServerSideHelpers } from "@trpc/react-query/server";
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

const _helperGen = () => {
  throw new Error("Only for type inference");
  return createServerSideHelpers<AppRouter>({} as any);
};
type CreateServerSideHelpersReturnType = ReturnType<typeof _helperGen>;
type GetServerSidePropsWithParams<
  P extends { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>,
  params: {
    session: Session | null;
    ssrHelper: CreateServerSideHelpersReturnType;
    url: string | null;
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

    const ssrHelper = createServerSideHelpers<AppRouter>({
      router: appRouter,
      ctx: createContext as any, // TODO: type mismatch??
      transformer: superjson,
    });

    const url = req.url
      ? new URL(req.url, `https://${req.headers.host}`).toString()
      : null;

    const pageProps = await getServerSideProps(context, {
      session,
      ssrHelper,
      url,
    });
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
