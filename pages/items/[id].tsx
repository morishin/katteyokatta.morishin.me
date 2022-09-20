import { Heading, HStack, Img, Spacer, Text, VStack } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Comment } from "~/components/item/Comment";
import { AmazonButton } from "~/components/post/AmazonButton";
import { TweetButton } from "~/components/TweetButton";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type ItemPageProps = {
  itemId: number;
  url?: string;
};

export const getServerSideProps: GetServerSideProps<ItemPageProps> =
  makeGetServerSideProps<ItemPageProps>(async (context, { ssg }) => {
    const { params, req } = context;
    const itemId = Number(params?.["id"]);
    if (isNaN(itemId)) return { notFound: true };

    await ssg.item.single.prefetch({ id: itemId });

    return {
      props: {
        trpcState: ssg.dehydrate(),
        itemId,
        url: req.url
          ? new URL(req.url, `https://${req.headers.host}`).toString()
          : undefined,
      },
    };
  });

const ItemPage: NextPage<ItemPageProps> = ({ itemId, url }) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  useEffect(() => {
    setSelectedPostId(
      Number(window.location.hash.replace("#comment-", "")) || null
    );
  }, []);
  useEffect(() => {
    const onHashChange = () => {
      setSelectedPostId(
        Number(window.location.hash.replace("#comment-", "")) || null
      );
    };

    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const { data: item } = trpcNext.item.single.useQuery({ id: itemId });
  if (!item) return null;

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <HStack justifyContent="flex-end">
        <TweetButton url={url} />
      </HStack>
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
        <Text fontWeight="bold" fontSize="sm">
          {item.name}
        </Text>
        <Spacer h="10px" />
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
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="normal"
        marginTop="24px"
        marginBottom="16px"
      >
        これを買ってよかったと言っている人
      </Heading>
      <div>
        {item.posts.map((post) => (
          <Comment
            key={post.id}
            post={post}
            isSelected={selectedPostId === post.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemPage;
