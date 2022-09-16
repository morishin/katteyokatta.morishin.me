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
import { GraphQLClient } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { useIntersection } from "react-use";
import { PostGrid } from "~/components/post/PostGrid";
import { ReachedEndMark } from "~/components/post/ReachedEndMark";
import { TweetButton } from "~/components/TweetButton";
import { UserIcon } from "~/components/UserIcon";
import {
  DefaultPostFragment,
  getSdkWithHooks,
  User,
} from "~/lib/client/generated/index";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";
import { encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";

type UserPageProps = {
  user: User;
  initialData: {
    posts: DefaultPostFragment[];
    nextCursor: string | null;
  };
  url?: string;
};

const PER_PAGE = 24;

export const getServerSideProps: GetServerSideProps<UserPageProps> =
  makeGetServerSidePropsWithSession<UserPageProps>(
    async (context, _session) => {
      const { params, req } = context;
      const userName = params?.["userName"];
      if (typeof userName !== "string") throw new Error("Invalid params");

      const user = await prisma.user.findFirst({
        where: {
          name: userName,
        },
        select: {
          id: true,
          associateTag: true,
          image: true,
          name: true,
        },
      });
      if (!user) return { notFound: true };

      const posts = await prisma.post.findMany({
        where: {
          userId: user.id,
        },
        take: PER_PAGE,
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          item: {
            select: {
              id: true,
              asin: true,
              name: true,
              image: true,
            },
          },
        },
      });
      const hasPreviousPage = posts.length === PER_PAGE;
      const startCursor = encodeCursor(posts.slice(-1)[0].id);
      return {
        props: {
          user,
          initialData: {
            posts: posts.map((post) => ({
              ...post,
              createdAt: post.createdAt.toISOString(),
            })),
            nextCursor: hasPreviousPage ? startCursor : null,
          },
          url: req.url
            ? new URL(req.url, `https://${req.headers.host}`).toString()
            : undefined,
        },
      };
    }
  );

const graphqlClient = new GraphQLClient("/api/graphql");
const sdk = getSdkWithHooks(graphqlClient);

const UserPage: NextPage<UserPageProps> = ({ initialData, user, url }) => {
  const { data, size, setSize, isValidating } = sdk.useGetPostsByUserInfinite(
    (_pageIndex, previousPageData) => {
      if (previousPageData === null) {
        // first request
        return [
          "page",
          {
            before: initialData.nextCursor,
            last: PER_PAGE,
          },
        ];
      }
      if (!previousPageData.posts.pageInfo.hasPreviousPage) {
        // reached the end
        return null;
      }
      if (previousPageData.posts.pageInfo.startCursor === null) {
        throw new Error("startCursor is null");
      }
      // load next page
      return [
        "page",
        {
          before: previousPageData.posts.pageInfo.startCursor,
          last: PER_PAGE,
        },
      ];
    },
    // variables for the first request
    {
      userName: user.name,
      page: {
        before: initialData.nextCursor,
        last: PER_PAGE,
      },
    },
    { initialSize: 0, revalidateFirstPage: false }
  );

  const isReachingEnd =
    data && data.slice(-1)[0]?.posts.pageInfo.hasPreviousPage === false;

  const posts = useMemo(
    () =>
      initialData.posts.concat(
        data
          ?.reverse()
          .flatMap((page) => page.posts.edges.map((edge) => edge.node)) || []
      ),
    [data, initialData.posts]
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
      !isValidating
    ) {
      setSize(size + 1);
    }
    previousIsIntersecting.current = intersection?.isIntersecting;
  }, [intersection?.isIntersecting, isValidating, setSize, size]);

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <HStack justifyContent="flex-end">
        <TweetButton url={url} />
      </HStack>
      <Center>
        <VStack paddingY="40px">
          <UserIcon image={user.image} size={100} />
          <Link href={`https://twitter.com/${user.name}`} passHref>
            <ChakraLink>
              <Icon as={FaTwitter} w="20px" h="20px" color="#46BAED" />
            </ChakraLink>
          </Link>
          <HStack>
            <Text as="b" fontSize="2xl">
              {`@${user.name}`}
            </Text>
            <Text>さんの買ってよかったもの</Text>
          </HStack>
          <Link href="/posts/new" passHref>
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
      <Center ref={bottomRef} marginY="70px" opacity={isValidating ? 1 : 0}>
        <Spinner color="secondary" size="xl" />
      </Center>
      {isReachingEnd && <ReachedEndMark />}
    </div>
  );
};

export default UserPage;
