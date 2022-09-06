import { Button } from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useMemo } from "react";
import { PostGrid } from "~/components/post/PostGrid";
import { encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";
import {
  getSdkWithHooks,
  PostForTopPageFragment,
} from "../lib/client/generated/index";
import { makeGetServerSidePropsWithSession } from "../lib/server/auth/withSession";

type HomeProps = {
  initialData: {
    posts: PostForTopPageFragment[];
    nextCursor: string | null;
  };
};

const PER_PAGE = 24;

export const getServerSideProps: GetServerSideProps<HomeProps> =
  makeGetServerSidePropsWithSession<HomeProps>(async (_context, _session) => {
    const posts = await prisma.post.findMany({
      take: PER_PAGE,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        item: {
          select: {
            id: true,
            asin: true,
            name: true,
            image: true,
          },
        },
      },
    });
    const hasPreviousPage = posts.length === PER_PAGE;
    const startCursor = encodeCursor(posts.slice(-1)[0].id);
    return {
      props: {
        initialData: {
          posts: posts.map((post) => ({
            ...post,
            createdAt: post.createdAt.toISOString(),
          })),
          nextCursor: hasPreviousPage ? startCursor : null,
        },
      },
    };
  });

const graphqlClient = new GraphQLClient("/api/graphql");
const sdk = getSdkWithHooks(graphqlClient);

const Home: NextPage<HomeProps> = ({ initialData }) => {
  const { status } = useSession();

  const { data, error, size, setSize, isValidating, mutate } =
    sdk.useGetPostsInfinite(
      (_pageIndex, previousPageData) => {
        if (previousPageData === null) {
          // first request
          return [
            "page",
            {
              before: initialData.nextCursor,
              last: PER_PAGE,
            },
          ];
        }
        if (!previousPageData.posts.pageInfo.hasPreviousPage) {
          // reached the end
          return null;
        }
        if (previousPageData.posts.pageInfo.startCursor === null) {
          throw new Error("startCursor is null");
        }
        // load next page
        return [
          "page",
          {
            before: previousPageData.posts.pageInfo.startCursor,
            last: PER_PAGE,
          },
        ];
      },
      // variables for the first request
      {
        page: {
          before: initialData.nextCursor,
          last: PER_PAGE,
        },
      },
      { initialSize: 0 }
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
    () =>
      initialData.posts.concat(
        data
          ?.reverse()
          .flatMap((page) => page.posts.edges.map((edge) => edge.node)) || []
      ),
    [data, initialData.posts]
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
      {isEmpty ? <p>Yay, no posts found.</p> : <PostGrid posts={posts} />}
    </div>
  );
};

export default Home;
