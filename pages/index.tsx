import { Center, Spinner } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import { PostGrid } from "~/components/post/PostGrid";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type HomeProps = {};

const PER_PAGE = 20;

export const getServerSideProps: GetServerSideProps<HomeProps> =
  makeGetServerSideProps<HomeProps>(async (_context, { ssg }) => {
    await ssg.post.latest.prefetchInfinite({
      limit: PER_PAGE,
    });

    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  });

const Home: NextPage<HomeProps> = () => {
  const { data, isFetching, fetchNextPage } =
    trpcNext.post.latest.useInfiniteQuery(
      { limit: PER_PAGE },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
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
    </div>
  );
};

export default Home;
