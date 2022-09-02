import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { getSdkWithHooks } from "../lib/client/generated/index";
import { makeGetServerSidePropsWithSession } from "../lib/server/auth/withSession";

type HomeProps = {};

export const getServerSideProps: GetServerSideProps<HomeProps> =
  makeGetServerSidePropsWithSession(async (_context, _session) => {
    return { props: {} };
  });

const graphqlClient = new GraphQLClient("/api/graphql");
const sdk = getSdkWithHooks(graphqlClient);
const PER_PAGE = 20;

const Home: NextPage<HomeProps> = () => {
  const { status } = useSession();
  const { data, error, size, setSize } = sdk.useGetPostsInfinite(
    (_pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.posts.pageInfo.hasPreviousPage)
        return null;
      return [
        "page",
        previousPageData?.posts?.pageInfo &&
        previousPageData.posts.pageInfo.hasPreviousPage &&
        previousPageData.posts.pageInfo.startCursor
          ? {
              before: previousPageData.posts.pageInfo.startCursor,
              last: PER_PAGE,
            }
          : null,
      ];
    },
    {
      page: {
        last: PER_PAGE,
      },
    }
  );

  return (
    <div>
      <Head>
        <title>next-prisma-graphql-example</title>
      </Head>

      <div>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "authenticated" ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default Home;
