import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Link as ChakraLink,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import type { FC } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

export const TopGuide: FC = () => {
  const { data: session, status } = useSession();
  return (
    <Center h="180px" bgColor="white">
      {status === "loading" ? (
        <ForAnonymousUserSkeleton />
      ) : status === "authenticated" ? (
        <ForLoggedInUser userName={session.user.name} />
      ) : (
        <ForAnonymousUser />
      )}
    </Center>
  );
};

const ForAnonymousUserSkeleton: FC = () => (
  <VStack alignItems="center">
    <HStack
      spacing={0}
      wrap="wrap"
      justifyContent="center"
      fontSize={["md", "md", "lg", "lg"]}
    >
      <Box pt="4px">
        <Skeleton>買ってよかったなと思ったものを</Skeleton>
      </Box>
      <Box pt="4px">
        <Skeleton>まとめることができるサービスです。</Skeleton>
      </Box>
    </HStack>
    <HStack
      spacing={0}
      wrap="wrap"
      justifyContent="center"
      fontSize={["xs", "xs", "sm", "sm"]}
    >
      <Box pt="4px">
        <Skeleton>自分のまとめた商品には</Skeleton>
      </Box>
      <Box pt="4px">
        <Skeleton>Amazonアフィリエイトリンクを設定できます</Skeleton>
      </Box>
    </HStack>
    <Spacer h="5px" />
    <Button
      leftIcon={<FaTwitter color="white" />}
      color="white"
      backgroundColor="#1d9bf0"
      isLoading={true}
    >
      Twitterでログイン
    </Button>
  </VStack>
);

const ForAnonymousUser: FC = () => (
  <VStack alignItems="center">
    <HStack
      spacing={0}
      wrap="wrap"
      justifyContent="center"
      fontSize={["md", "md", "lg", "lg"]}
    >
      <Box>買ってよかったなと思ったものを</Box>
      <Box>まとめることができるサービスです。</Box>
    </HStack>
    <HStack
      spacing={0}
      wrap="wrap"
      justifyContent="center"
      fontSize={["xs", "xs", "sm", "sm"]}
    >
      <Box>自分のまとめた商品には</Box>
      <Box>Amazonアフィリエイトリンクを設定できます</Box>
    </HStack>
    <Spacer h="5px" />
    <Button
      leftIcon={<FaTwitter color="white" />}
      color="white"
      backgroundColor="#1d9bf0"
      _hover={{ backgroundColor: "#0c7abf" }}
      onClick={() => signIn()}
    >
      Twitterでログイン
    </Button>
  </VStack>
);

const ForLoggedInUser: FC<{ userName: string }> = ({ userName }) => (
  <VStack alignItems="center" padding="20px">
    <HStack
      spacing={0}
      wrap="wrap"
      justifyContent="center"
      fontSize={["md", "md", "lg", "lg"]}
    >
      <Box>あなたの買ってよかったものを</Box>
      <Box>みんなに教えてあげましょう！</Box>
    </HStack>
    <Link href="/posts/new" passHref legacyBehavior>
      <Button
        leftIcon={<BsPlusLg color="white" />}
        size={["sm", "sm", "md", "md"]}
        color="white"
        bgColor="primary"
        _hover={{ bgColor: "#CC565A" }}
        as="a"
      >
        {`${userName}さんの買ってよかったものを追加`}
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
  </VStack>
);
