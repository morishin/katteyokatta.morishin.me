import { Box, Img, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { PostForTopPageFragment } from "~/lib/client/generated";
import { AmazonButton } from "./AmazonButton";
import { UserLink } from "./UserLink";

type Props = {
  post: PostForTopPageFragment;
};

export const PostCard: FC<Props> = ({ post }) => {
  return (
    <Box>
      <VStack
        alignItems="center"
        borderRadius="6px"
        bg="white"
        boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
      >
        <VStack padding="15px" spacing="8px" alignItems="flex-start">
          <Img
            src={post.item.image || undefined}
            maxHeight="200px"
            marginX="auto"
          />
          <Link href={`/items/${post.item.id}`} passHref>
            <ChakraLink color="primary">{post.item.name}</ChakraLink>
          </Link>
          {/* TODO: associateId を渡す */}
          <AmazonButton asin={post.item.asin} />
        </VStack>
        <Box
          paddingX="24px"
          paddingY="16px"
          borderTop="1px solid"
          borderColor="gray.300"
        >
          <UserLink user={post.user} />
          <Text marginTop="8px">{post.comment}</Text>
        </Box>
      </VStack>
    </Box>
  );
};
