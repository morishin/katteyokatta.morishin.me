import { Center, Heading, Spinner } from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetStaticProps, NextPage } from "next";
import { createContext, useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import superjson from "superjson";
import { Container } from "~/components/layouts/Container";
import { Meta } from "~/components/Meta";
import { PostGrid } from "~/components/post/PostGrid";
import { TopGuide } from "~/components/top/TopGuide";
import { WEB_HOST } from "~/lib/client/constants";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { AppRouter, appRouter } from "~/lib/server/trpc/routers/appRouter";

type Props = {
  pageUrl: string;
};

const PER_PAGE = 20;

export const getStaticProps: GetStaticProps<Props> = async (_context) => {
  const pageUrl = `${WEB_HOST}/_dev`;
  const ssg = createProxySSGHelpers<AppRouter>({
    router: appRouter,
    ctx: createContext as any,
    transformer: superjson,
  });
  await ssg.post.latest.prefetchInfinite({
    limit: PER_PAGE,
  });
  const props = {
    trpcState: ssg.dehydrate(),
    pageUrl,
  };
  return { props };
};

const DevPage: NextPage<Props> = ({ pageUrl }) => {
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
      <Meta ogUrl={pageUrl} />
      <TopGuide />
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

export default DevPage;
