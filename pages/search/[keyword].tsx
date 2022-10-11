import { Center, Heading, Spinner, Text } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import { ItemGrid } from "~/components/item/ItemGrid";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type ItemsSearchPageProps = {
  keyword: string;
};

const PER_PAGE = 20;

export const getServerSideProps: GetServerSideProps<ItemsSearchPageProps> =
  makeGetServerSideProps<ItemsSearchPageProps>(async (context, { ssg }) => {
    const { params } = context;
    const keyword = params?.["keyword"]?.toString() ?? "";
    if (keyword.length === 0) return { notFound: true };

    await ssg.item.search.prefetchInfinite({
      keyword,
      limit: PER_PAGE,
    });

    return {
      props: {
        keyword,
        trpcState: ssg.dehydrate(),
      },
    };
  });

const ItemsSearchPage: NextPage<ItemsSearchPageProps> = ({ keyword }) => {
  const { data, isFetching, fetchNextPage } =
    trpcNext.item.search.useInfiniteQuery(
      { keyword, limit: PER_PAGE },
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

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages]
  );

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>

      <Heading
        as="h2"
        fontSize="xl"
        marginTop="10px"
        marginBottom="15px"
      >{`"${keyword}" の検索結果`}</Heading>
      {items.length > 0 ? (
        <ItemGrid items={items} />
      ) : (
        <Text
          marginTop="30px"
          fontSize="xl"
        >{`"${keyword}"に合致する商品は見つかりませんでした。`}</Text>
      )}
      <Center ref={bottomRef} marginY="70px" opacity={isFetching ? 1 : 0}>
        <Spinner color="secondary" size="xl" />
      </Center>
    </div>
  );
};

export default ItemsSearchPage;
