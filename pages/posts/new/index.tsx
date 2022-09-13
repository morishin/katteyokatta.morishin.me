import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Link as ChakraLink,
  Spinner,
  theme,
  VStack,
} from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";
import { ReachedEndMark } from "~/components/post/ReachedEndMark";
import { getSdkWithHooks } from "~/lib/client/generated/index";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";

type NewPostPageProps = {};

export const getServerSideProps: GetServerSideProps<NewPostPageProps> =
  makeGetServerSidePropsWithSession<NewPostPageProps>(
    async (_context, session) => {
      if (!session) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
      return {
        props: {},
      };
    }
  );

const graphqlClient = new GraphQLClient("/api/graphql");
const sdk = getSdkWithHooks(graphqlClient);
const PER_PAGE = 10;

const NewPostPage: NextPage<NewPostPageProps> = ({}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data, size, setSize, isValidating } =
    sdk.useSearchAmazonItemsInfinite(
      (_pageIndex, previousPageData) => {
        if (previousPageData === null) {
          // first request
          if (searchQuery.length > 0) {
            const asin = searchQuery.match(
              /https?:\/\/(www\.)?amazon(\.co)?\.jp\/(.+\/)?((gp\/product\/)|(dp\/))(?<asin>[A-Z0-9]+).*/
            )?.groups?.asin;
            return ["searchArgs", { query: asin ?? searchQuery }];
          } else {
            return null;
          }
        }
        if (!previousPageData.amazonItems.pageInfo.hasNextPage) {
          // reached the end
          return null;
        }
        if (previousPageData.amazonItems.pageInfo.endCursor === null) {
          throw new Error("endCursor is null");
        }
        // load next page
        return [
          "searchArgs",
          {
            query: searchQuery,
            after: previousPageData.amazonItems.pageInfo.endCursor,
            first: PER_PAGE,
          },
        ];
      },
      // variables for the first request
      {
        searchArgs: {
          query: searchQuery,
        },
      },
      { revalidateFirstPage: false }
    );

  const isReachingEnd =
    data && data.slice(-1)[0]?.amazonItems.pageInfo.hasNextPage === false;

  const items =
    data?.flatMap((page) => page.amazonItems.edges.map((edge) => edge.node)) ??
    [];
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

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.length > 0) {
      setSearchQuery(inputRef.current.value);
      setSize(1);
    }
  };

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <VStack marginTop="40px" alignItems="center" spacing="20px">
        <form onSubmit={onSubmit}>
          <HStack>
            <Input
              ref={inputRef}
              type="search"
              minWidth="500px"
              variant="flushed"
              placeholder="商品名またはAmazonページのURL"
              borderColor="gray.500"
              focusBorderColor={(theme.colors as any).secondary}
            />
            <Button
              fontSize="15px"
              bgColor="white"
              _hover={{ bgColor: "gray.100" }}
              type="submit"
              textColor="gray.600"
            >
              検索
            </Button>
          </HStack>
        </form>
        <ChakraLink
          href="https://www.amazon.co.jp/gp/css/order-history/"
          color="primary"
          target="_blank"
        >
          Amazonの購入履歴を見る
        </ChakraLink>
        {items.map((item) => (
          <Box key={item.asin} bg="black" color="white">
            {JSON.stringify(item, null, 2)}
          </Box>
        ))}
        <Center ref={bottomRef} marginY="70px" opacity={isValidating ? 1 : 0}>
          <Spinner color="secondary" size="xl" />
        </Center>
        {isReachingEnd && <ReachedEndMark />}
      </VStack>
    </div>
  );
};

export default NewPostPage;
