import {
  Button,
  Center,
  HStack,
  Icon,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaCog, FaTwitter } from "react-icons/fa";
import { useIntersection, useLocation } from "react-use";
import { DefaultLink } from "~/components/DefaultLink";
import { Container } from "~/components/layouts/Container";
import { PostGrid } from "~/components/post/PostGrid";
import { TweetButton } from "~/components/TweetButton";
import { UserIcon } from "~/components/UserIcon";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { DefaultUser } from "~/lib/client/types/type";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type UserPageProps = {
  user: DefaultUser;
  url?: string;
};

const PER_PAGE = 20;

export const getServerSideProps: GetServerSideProps<UserPageProps> =
  makeGetServerSideProps<UserPageProps>(async (context, { ssg }) => {
    const { params, req } = context;
    const userName = params?.["userName"];
    if (typeof userName !== "string") throw new Error("Invalid params");

    const user = await ssg.user.single.fetch({ name: userName });
    if (!user) return { notFound: true };

    await ssg.post.latest.prefetchInfinite({
      limit: PER_PAGE,
      userName,
    });

    return {
      props: {
        user,
        url: req.url
          ? new URL(req.url, `https://${req.headers.host}`).toString()
          : undefined,
        trpcState: ssg.dehydrate(),
      },
    };
  });

const UserPage: NextPage<UserPageProps> = ({ user, url }) => {
  const { href } = useLocation();
  const pageUrl = href ?? url;
  const { data, isFetching, fetchNextPage } =
    trpcNext.post.latest.useInfiniteQuery(
      {
        limit: PER_PAGE,
        userName: user.name,
      },
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

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data?.pages]
  );

  return (
    <Container>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <HStack justifyContent="flex-end" spacing="25px">
        <DefaultLink href="/account/settings" color="gray">
          <HStack spacing="2px">
            <Icon as={FaCog} w="15px" h="15px" color="gray" />
            <Text fontSize="xs">アカウント設定</Text>
          </HStack>
        </DefaultLink>
        <TweetButton url={pageUrl} />
      </HStack>
      <Center>
        <VStack paddingY="40px">
          <UserIcon image={user.image} size={100} />
          <DefaultLink href={`https://twitter.com/${user.name}`}>
            <Icon as={FaTwitter} w="20px" h="20px" color="#46BAED" />
          </DefaultLink>
          <HStack>
            <Text as="b" fontSize="2xl">
              {`@${user.name}`}
            </Text>
            <Text>さんの買ってよかったもの</Text>
          </HStack>
          <Link href="/posts/new" passHref legacyBehavior>
            <Button
              leftIcon={<BsPlusLg color="white" />}
              color="white"
              bgColor="primary"
              _hover={{ bgColor: "#CC565A" }}
              as="a"
            >
              買ってよかったものを追加
            </Button>
          </Link>
          <ChakraLink
            href="https://www.amazon.co.jp/gp/css/order-history/"
            color="primary"
            target="_blank"
          >
            Amazonの購入履歴を見る
          </ChakraLink>
        </VStack>
      </Center>
      <PostGrid posts={posts} />
      <Center ref={bottomRef} marginY="70px" opacity={isFetching ? 1 : 0}>
        <Spinner color="secondary" size="xl" />
      </Center>
    </Container>
  );
};

export default UserPage;
