import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

type GetServerSidePropsFromSession<T> = (
  context: Parameters<GetServerSideProps<T>>[0] & { session: Session | null }
) => ReturnType<GetServerSideProps<T>>;

type GetServerSidePropsIncludingSession<T> = (
  context: Parameters<GetServerSideProps<T>>[0]
) => ReturnType<GetServerSideProps<T & { session: Session | null }>>;

export const withSession = <T>(
  getServerSideProps: GetServerSidePropsFromSession<T>
): GetServerSidePropsIncludingSession<T> => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const session = await getSession({ req });
    const pageProps = await getServerSideProps({ ...context, session });
    if ("props" in pageProps) {
      const props =
        pageProps.props instanceof Promise
          ? await pageProps.props
          : pageProps.props;
      return { props: { ...props, session } };
    }
    return pageProps;
  };
};
