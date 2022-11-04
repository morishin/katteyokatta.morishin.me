import { Box, Center, Spinner, VStack } from "@chakra-ui/react";
import { FC, memo, useEffect, useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { DefaultAmazonItem } from "~/lib/client/types/type";
import { AmazonSearchResultItemCard } from "../item/AmazonSearchResultItemCard";
import { AmazonButton } from "./AmazonButton";

const PER_PAGE = 9;

type AmazonSearchResultsProps = {
  searchQuery: string;
  onClickItem: (item: DefaultAmazonItem) => void;
};

export const AmazonSearchResults: FC<AmazonSearchResultsProps> = memo(
  function AmazonSearchResults({ searchQuery, onClickItem }) {
    const { data, isFetching, fetchNextPage } =
      trpcNext.amazonItem.search.useInfiniteQuery(
        {
          query: searchQuery,
          limit: PER_PAGE,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          retry: false,
        }
      );

    const items = useMemo(
      () => data?.pages.flatMap((page) => page.amazonItems) ?? [],
      [data?.pages]
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

    return (
      <div>
        <VStack alignItems="stretch" spacing="20px">
          {items.map((item) => (
            <VStack key={item.asin} alignItems="strech">
              <AmazonSearchResultItemCard item={item} onClick={onClickItem} />
              <Box alignSelf="flex-end">
                <AmazonButton asin={item.asin} type="text" />
              </Box>
            </VStack>
          ))}
        </VStack>
        <Center ref={bottomRef} marginY="70px" opacity={isFetching ? 1 : 0}>
          <Spinner color="secondary" size="xl" />
        </Center>
      </div>
    );
  }
);
