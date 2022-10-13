import { Box, Img, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { DefaultItem } from "~/lib/client/types/type";

type Props = {
  item: DefaultItem["similarities"][0]["targetItem"];
};

export const SimilarItemCard: FC<Props> = ({ item }) => (
  <Box
    minW="180px"
    w="180px"
    paddingX="3px"
    paddingBottom="15px"
    paddingTop="5px"
  >
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
            <Text fontSize="sm">{item.name}</Text>
          </VStack>
        </ChakraLink>
      </Link>
    </VStack>
  </Box>
);