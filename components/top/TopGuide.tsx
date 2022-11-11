import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Link as ChakraLink,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import type { FC } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

type TopGuideProps = {
  userName?: string;
};

export const TopGuide: FC<TopGuideProps> = ({ userName }) => {
  return userName ? (
    <ForLoggedInUser userName={userName} />
  ) : (
    <ForAnonymousUser />
  );
};

const ForAnonymousUser: FC = () => (
  <Center h={["180px", "180px", "150px", "150px"]} bgColor="white">
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
        onClick={() => signIn("twitter")}
      >
        Twitterでログイン
      </Button>
    </VStack>
  </Center>
);

const ForLoggedInUser: FC<TopGuideProps> = ({ userName }) => (
  <Center h="150px" bgColor="white" padding="20px">
    <VStack alignItems="center">
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
  </Center>
);
