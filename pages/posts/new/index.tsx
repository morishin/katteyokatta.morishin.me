import {
  Button,
  HStack,
  Input,
  Link as ChakraLink,
  theme,
  VStack,
} from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useEffect, useRef } from "react";
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

const NewPostPage: NextPage<NewPostPageProps> = ({}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(`🔥 ${JSON.stringify(inputRef.current?.value, null, 2)}`);
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
      </VStack>
    </div>
  );
};

export default NewPostPage;
