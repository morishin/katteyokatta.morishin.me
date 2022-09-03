import { Button } from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useMemo } from "react";
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
  const { data, error, size, setSize, isValidating, mutate } =
    sdk.useGetPostsInfinite(
      (_pageIndex, previousPageData) => {
        if (
          previousPageData &&
          !previousPageData.posts.pageInfo.hasPreviousPage
        )
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

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.posts.edges.length === 0;
  const isReachingEnd =
    isEmpty || (data && data.slice(-1)[0]?.posts.edges.length < PER_PAGE);
  const isRefreshing = isValidating && data && data.length === size;

  const posts = useMemo(
    () => data?.reverse().flatMap((page) => page.posts.edges) || [],
    [data]
  );

  useEffect(() => {
  }, [posts]);

  return (
    <div>
      <Head>
        <title>next-prisma-graphql-example</title>
      </Head>

      <div>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "authenticated" ? (
          <Button onClick={() => signOut()}>Sign out</Button>
        ) : (
          <Button onClick={() => signIn()}>Sign in</Button>
        )}
      </div>

      <p>
        showing {size} page(s) of {isLoadingMore ? "..." : posts.length} post(s){" "}
        <Button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "loading..."
            : isReachingEnd
            ? "no more posts"
            : "load more"}
        </Button>
        <Button disabled={isRefreshing} onClick={() => mutate()}>
          {isRefreshing ? "refreshing..." : "refresh"}
        </Button>
        <Button disabled={!size} onClick={() => setSize(0)}>
          clear
        </Button>
      </p>
      {isEmpty ? <p>Yay, no posts found.</p> : null}
      {posts.map((edge) => {
        return (
          <p key={edge.node.id} style={{ margin: "6px 0" }}>
            - {edge.node.id}
          </p>
        );
      })}
    </div>
  );
};

export default Home;
