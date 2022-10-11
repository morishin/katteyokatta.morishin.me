import {
  Box,
  Circle,
  HStack,
  Img,
  Link as ChakraLink,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { UserIcon } from "~/components/UserIcon";
import { ItemWithPosts } from "~/lib/client/types/type";

type Props = {
  item: ItemWithPosts;
};

export const ItemCard: FC<Props> = ({ item }) => (
  <Box>
    <VStack
      alignItems="center"
      borderRadius="6px"
      bg="white"
      boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
    >
      <Link href={`/items/${item.id}`} passHref>
        <ChakraLink color="primary">
          <VStack padding="15px" spacing="8px" alignItems="flex-start">
            <Img
              src={item.image || undefined}
              maxHeight="200px"
              marginX="auto"
            />
            <Text>{item.name}</Text>
          </VStack>
        </ChakraLink>
      </Link>

      <Box
        width="100%"
        paddingX="16px"
        paddingY="12px"
        borderTop="1px solid"
        borderColor="gray.300"
      >
        <Text fontSize="sm">買ってよかった人</Text>
        <HStack width="100%" spacing={0} flexWrap="wrap" marginTop="8px">
          {item.posts.slice(0, 29).map((post) => (
            <Link
              key={post.id}
              href={`/items/${item.id}#comment-${post.id}`}
              passHref
            >
              <ChakraLink>
                <Tooltip color="white" label={post.comment}>
                  <Box marginRight="6px" marginBottom="4px">
                    <UserIcon image={post.user.image} size={24} />
                  </Box>
                </Tooltip>
              </ChakraLink>
            </Link>
          ))}
          {item.posts.length > 30 && (
            <Circle
              bg="gray.400"
              size="24px"
              overflow="hidden"
              color="white"
              fontSize="4px"
              fontWeight="bold"
            >
              {`+${item.posts.length - 29}`}
            </Circle>
          )}
        </HStack>
      </Box>
    </VStack>
  </Box>
);
