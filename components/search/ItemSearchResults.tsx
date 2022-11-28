import { Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useRef } from "react";
import { useIntersection, useLocation } from "react-use";
import { ItemGrid } from "~/components/item/ItemGrid";
import { Container } from "~/components/layouts/Container";
import { Meta } from "~/components/Meta";
import { trpcNext } from "~/lib/client/trpc/trpcNext";

const PER_PAGE = 20;

export const ItemSearchResults: FC = () => {
  const { href, pathname } = useLocation();
  const keyword = decodeURI(pathname?.split("/").pop() ?? "");
  const pageUrl = href;

  const { data, isFetching, fetchNextPage } =
    trpcNext.item.search.useInfiniteQuery(
      { keyword, limit: PER_PAGE },
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

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages]
  );

  return (
    <Container>
      <Meta title={`"${keyword}"の検索結果`} ogUrl={pageUrl} />
      <Heading
        as="h2"
        fontSize="xl"
        marginTop="10px"
        marginBottom="15px"
      >{`"${keyword}" の検索結果`}</Heading>
      {items.length > 0 ? (
        <ItemGrid items={items} />
      ) : !isFetching ? (
        <Text
          marginTop="30px"
          fontSize="lg"
        >{`"${keyword}"に合致する商品は見つかりませんでした。`}</Text>
      ) : null}
      <Center ref={bottomRef} marginY="70px" opacity={isFetching ? 1 : 0}>
        <Spinner color="secondary" size="xl" />
      </Center>
    </Container>
  );
};
