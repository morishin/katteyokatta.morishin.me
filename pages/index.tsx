import { Center, Spinner } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import { PostGrid } from "~/components/post/PostGrid";
import { ReachedEndMark } from "~/components/post/ReachedEndMark";
import { trpc } from "~/lib/client/trpc/trpc";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type HomeProps = {};

const PER_PAGE = 20;

export const getServerSideProps: GetServerSideProps<HomeProps> =
  makeGetServerSideProps<HomeProps>(async (_context, { ssg }) => {
    await ssg.prefetchInfiniteQuery("post.latest", {
      limit: PER_PAGE,
    });

    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  });

const Home: NextPage<HomeProps> = (props) => {
  const postQuery = trpc.useInfiniteQuery(
    [
      "post.latest",
      {
        limit: PER_PAGE,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data, isFetching, hasNextPage, fetchNextPage } = postQuery;
  const isReachedEnd = !hasNextPage && !isFetching;

  const bottomRef = useRef(null);
  const intersection = useIntersection(bottomRef, {
    root: null,
  });

  const previousIsIntersecting = useRef<boolean | undefined>(false);
  useEffect(() => {
    if (
      intersection?.isIntersecting &&
      !previousIsIntersecting.current &&
      !isFetching
    ) {
      fetchNextPage();
    }
    previousIsIntersecting.current = intersection?.isIntersecting;
  }, [fetchNextPage, intersection?.isIntersecting, isFetching]);

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data?.pages]
  );

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>

      <PostGrid posts={posts} />
      <Center ref={bottomRef} marginY="70px" opacity={isFetching ? 1 : 0}>
        <Spinner color="secondary" size="xl" />
      </Center>
      {isReachedEnd && <ReachedEndMark />}
    </div>
  );
};

export default Home;
