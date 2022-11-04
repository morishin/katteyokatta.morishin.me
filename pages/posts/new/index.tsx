import {
  Button,
  HStack,
  Icon,
  Input,
  Link as ChakraLink,
  Text,
  theme,
  VStack,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Container } from "~/components/layouts/Container";
import { AmazonSearchResults } from "~/components/post/AmazonSearchResults";
import { DefaultAmazonItem } from "~/lib/client/types/type";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type NewPostPageProps = {};

export const getServerSideProps: GetServerSideProps<NewPostPageProps> =
  makeGetServerSideProps<NewPostPageProps>(async (_context, { session }) => {
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
  });

const NewPostPage: NextPage<NewPostPageProps> = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onClickItem = useCallback(
    (item: DefaultAmazonItem) => {
      router.push({
        pathname: "/posts/new/details",
        query: {
          name: item.name,
          asin: item.asin,
          image: item.image,
          amazonUrl: item.amazonUrl,
        },
      });
    },
    [router]
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.length > 0) {
      setSearchQuery(inputRef.current.value);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Container>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <VStack marginTop="40px" alignItems="center" spacing="20px">
        <form onSubmit={onSubmit}>
          <HStack width={["80vw", "80vw", "50vw"]} maxWidth="500px">
            <Input
              ref={inputRef}
              type="search"
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
          isExternal={true}
        >
          <HStack alignItems="center" spacing="2px">
            <Text>Amazonの購入履歴を見る</Text>
            <Icon as={HiOutlineExternalLink} />
          </HStack>
        </ChakraLink>
        {searchQuery.length > 0 ? (
          <AmazonSearchResults
            searchQuery={searchQuery}
            onClickItem={onClickItem}
          />
        ) : null}
      </VStack>
    </Container>
  );
};

export default NewPostPage;
