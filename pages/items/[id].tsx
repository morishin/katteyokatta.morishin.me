import { Heading, Img, Text, VStack } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { AmazonButton } from "~/components/post/AmazonButton";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";
import { prisma } from "~/lib/server/prisma";

type ItemPageProps = {
  item: {
    id: number;
    createdAt: string;
    name: string;
    image: string | null;
    asin: string;
    posts: {
      user: {
        id: number;
        name: string;
        image: string | null;
        associateTag: string | null;
      };
      id: number;
      comment: string;
      createdAt: string;
    }[];
  };
};

export const getServerSideProps: GetServerSideProps<ItemPageProps> =
  makeGetServerSidePropsWithSession<ItemPageProps>(
    async (context, _session) => {
      const { params } = context;
      const itemId = Number(params?.["id"]);
      if (isNaN(itemId)) throw new Error("Invalid params");

      const item = await prisma.item.findFirst({
        where: {
          id: itemId,
        },
        select: {
          id: true,
          asin: true,
          name: true,
          image: true,
          createdAt: true,
          posts: {
            select: {
              id: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  associateTag: true,
                },
              },
            },
          },
        },
      });
      if (!item) return { notFound: true };

      return {
        props: {
          item: {
            ...item,
            createdAt: item.createdAt.toISOString(),
            posts: item.posts.map((post) => ({
              ...post,
              createdAt: post.createdAt.toISOString(),
            })),
          },
        },
      };
    }
  );

const ItemPage: NextPage<ItemPageProps> = ({ item }) => {
  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <VStack
        alignItems="center"
        borderRadius="6px"
        bg="white"
        boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
        maxWidth="480px"
        padding="24px"
        marginX="auto"
      >
        <Img src={item.image || undefined} maxHeight="200px" marginX="auto" />
        <Text fontWeight="bold">{item.name}</Text>
        <AmazonButton
          asin={item.asin}
          associateTag={
            item.posts.length === 1
              ? item.posts[0].user.associateTag ?? undefined
              : undefined
          }
          type="large"
        />
      </VStack>
      <Heading as="h2" fontSize="2xl" fontWeight="normal" marginTop="24px">
        これを買ってよかったと言っている人
      </Heading>
    </div>
  );
};

export default ItemPage;
