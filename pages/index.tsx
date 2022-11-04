import { Center, Heading, Spinner } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import { Container } from "~/components/layouts/Container";
import { PostGrid } from "~/components/post/PostGrid";
import { TopGuide } from "~/components/top/TopGuide";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type TopPageProps = {};

const PER_PAGE = 20;

export const getServerSideProps: GetServerSideProps<TopPageProps> =
  makeGetServerSideProps<TopPageProps>(async (_context, { ssg }) => {
    await ssg.post.latest.prefetchInfinite({
      limit: PER_PAGE,
    });

    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  });

const TopPage: NextPage<TopPageProps> = () => {
  const { data: session } = useSession();
  const { data, isFetching, fetchNextPage } =
    trpcNext.post.latest.useInfiniteQuery(
      { limit: PER_PAGE },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
      <TopGuide userName={session?.user.name} />
      <Container>
        <Heading
          as="h2"
          fontSize="xl"
          fontWeight="medium"
          marginTop="10px"
          marginBottom="15px"
        >
          みんなの買ってよかったもの
        </Heading>
        <PostGrid posts={posts} />
        <Center ref={bottomRef} marginY="70px" opacity={isFetching ? 1 : 0}>
          <Spinner color="secondary" size="xl" />
        </Center>
      </Container>
    </div>
  );
};

export default TopPage;
