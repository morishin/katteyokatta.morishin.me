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
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createContext, useEffect, useMemo, useRef } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaCog, FaTwitter } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useIntersection } from "react-use";
import superjson from "superjson";
import { DefaultLink } from "~/components/DefaultLink";
import { Container } from "~/components/layouts/Container";
import { Meta } from "~/components/Meta";
import { PostGrid } from "~/components/post/PostGrid";
import { TweetButton } from "~/components/TweetButton";
import { UserIcon } from "~/components/UserIcon";
import { WEB_HOST } from "~/lib/client/constants";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { DefaultUser } from "~/lib/client/types/type";
import { prisma } from "~/lib/server/prisma";
import { AppRouter, appRouter } from "~/lib/server/trpc/routers/appRouter";

const PER_PAGE = 20;

type Props = {
  user: DefaultUser;
  pageUrl: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allUsers = await prisma.user.findMany({ select: { name: true } });
  return {
    paths: allUsers.map((user) => ({
      params: { userName: user.name.toString() },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { params } = context;
  const userName = params?.["userName"];
  if (typeof userName !== "string") throw new Error("Invalid params");

  const pageUrl = `${WEB_HOST}/${userName}`;
  const ssg = createProxySSGHelpers<AppRouter>({
    router: appRouter,
    ctx: createContext as any,
    transformer: superjson,
  });

  const user = await ssg.user.single.fetch({ name: userName });
  if (!user) return { notFound: true };

  await ssg.post.latest.prefetchInfinite({
    limit: PER_PAGE,
    userName: user.name,
  });

  const props = {
    trpcState: ssg.dehydrate(),
    user,
    pageUrl,
  };
  return { props };
};

const UserPage: NextPage<Props> = ({ user, pageUrl }) => {
  const { data, isFetching, fetchNextPage } =
    trpcNext.post.latest.useInfiniteQuery(
      {
        limit: PER_PAGE,
        userName: user.name,
      },
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

  const { data: session } = useSession();
  const isMyPage = session?.user?.id === user.id;

  return (
    <Container>
      <Meta
        title={`@${user.name}さんの買ってよかったもの`}
        ogUrl={pageUrl}
        ogImage={user.image ?? undefined}
        twitterCreator={user.name}
      />
      <HStack justifyContent="flex-end" spacing="25px">
        {isMyPage ? (
          <DefaultLink href="/account/settings" color="gray">
            <HStack spacing="2px">
              <Icon as={FaCog} w="15px" h="15px" color="gray" />
              <Text fontSize="xs">アカウント設定</Text>
            </HStack>
          </DefaultLink>
        ) : null}
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
          {isMyPage ? (
            <>
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
                isExternal={true}
              >
                <HStack alignItems="center" spacing="2px">
                  <Text>Amazonの購入履歴を見る</Text>
                  <Icon as={HiOutlineExternalLink} />
                </HStack>
              </ChakraLink>
            </>
          ) : null}
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
