import { Center, Spinner } from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import { PostGrid } from "~/components/post/PostGrid";
import { ReachedEndMark } from "~/components/post/ReachedEndMark";
import {
  DefaultPostFragment,
  getSdkWithHooks,
} from "~/lib/client/generated/index";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";
import { encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";

type HomeProps = {
  initialData: {
    posts: DefaultPostFragment[];
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
    const lastPost = posts[posts.length - 1];
    const startCursor = lastPost ? encodeCursor(lastPost.id) : null;
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
  const { data, size, setSize, isValidating } = sdk.useGetAllPostsInfinite(
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
    { initialSize: 0, revalidateFirstPage: false }
  );

  const isReachingEnd =
    data && data.slice(-1)[0]?.posts.pageInfo.hasPreviousPage === false;

  const posts = useMemo(
    () =>
      initialData.posts.concat(
        data
          ?.reverse()
          .flatMap((page) => page.posts.edges.map((edge) => edge.node)) || []
      ),
    [data, initialData.posts]
  );

  const bottomRef = useRef(null);
  const intersection = useIntersection(bottomRef, {
    root: null,
  });

  const previousIsIntersecting = useRef<boolean | undefined>(false);
  useEffect(() => {
    if (
      intersection?.isIntersecting &&
      !previousIsIntersecting.current &&
      !isValidating
    ) {
      setSize(size + 1);
    }
    previousIsIntersecting.current = intersection?.isIntersecting;
  }, [intersection?.isIntersecting, isValidating, setSize, size]);

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>

      <PostGrid posts={posts} />
      <Center ref={bottomRef} marginY="70px" opacity={isValidating ? 1 : 0}>
        <Spinner color="secondary" size="xl" />
      </Center>
      {isReachingEnd && <ReachedEndMark />}
    </div>
  );
};

export default Home;
