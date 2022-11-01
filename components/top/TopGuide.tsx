import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";

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
      <Box textAlign="center" fontSize={["md", "md", "lg", "lg"]}>
        <Box as="span" whiteSpace="nowrap">
          買ってよかったなと思ったものを
        </Box>
        <Box as="span" whiteSpace="nowrap">
          まとめることができるサービスです。
        </Box>
      </Box>
      <Box textAlign="center" fontSize={["xs", "xs", "sm", "sm"]}>
        <Box as="span" whiteSpace="nowrap">
          自分のまとめた商品には
        </Box>
        <Box as="span" whiteSpace="nowrap">
          Amazonアフィリエイトリンクを設定できます
        </Box>
      </Box>
      <Spacer h="5px" />
      <Link href="/login" passHref legacyBehavior>
        <Button
          leftIcon={<FaTwitter color="white" />}
          color="white"
          backgroundColor="#1d9bf0"
          _hover={{ backgroundColor: "#0c7abf" }}
          as="a"
        >
          Twitterでログイン
        </Button>
      </Link>
    </VStack>
  </Center>
);

const ForLoggedInUser: FC<TopGuideProps> = ({ userName }) => (
  <Center h="150px" bgColor="white" padding="20px">
    <VStack alignItems="center">
      <Box textAlign="center" fontSize={["md", "md", "lg", "lg"]}>
        <Box as="span" whiteSpace="nowrap">
          あなたの買ってよかったものを
        </Box>
        <Box as="span" whiteSpace="nowrap">
          みんなに教えてあげましょう！
        </Box>
      </Box>
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
      >
        Amazonの購入履歴を見る
      </ChakraLink>
    </VStack>
  </Center>
);
