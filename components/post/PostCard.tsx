import { Box, Img, Text, VStack } from "@chakra-ui/react";
import type { FC } from "react";
import { DefaultLink } from "~/components/DefaultLink";
import { AmazonButton } from "~/components/post/AmazonButton";
import { TextLinker } from "~/components/TextLinker";
import { UserLink } from "~/components/UserLink";
import { PostWithItem } from "~/lib/client/types/type";

type Props = {
  post: PostWithItem;
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
          <DefaultLink href={`/items/${post.item.id}`}>
            <VStack>
              <Img
                src={post.item.image || undefined}
                maxHeight="200px"
                marginX="auto"
              />
              <Text wordBreak="break-all">{post.item.name}</Text>
            </VStack>
          </DefaultLink>
          <AmazonButton
            asin={post.item.asin}
            associateTag={post.user.associateTag || undefined}
            type="small"
          />
        </VStack>
        <Box
          width="100%"
          paddingX="24px"
          paddingY="16px"
          borderTop="1px solid"
          borderColor="gray.300"
        >
          <UserLink userName={post.user.name} userImage={post.user.image} />
          <Box marginTop="8px">
            {" "}
            <TextLinker text={post.comment} />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
