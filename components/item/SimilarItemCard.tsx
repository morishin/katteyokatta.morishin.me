import { Box, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import type { FC } from "react";
import { DefaultLink } from "~/components/DefaultLink";
import { PlaceholderImage } from "~/components/PlaceholderImage";
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
      <DefaultLink href={`/items/${item.id}`}>
        <VStack padding="15px" spacing="8px" alignItems="flex-start">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              width="144"
              height="144"
              style={{
                objectFit: "contain",
                width: "144px",
                height: "144px",
              }}
            />
          ) : (
            <PlaceholderImage width="144px" height="144px" />
          )}
          <Text fontSize="sm" wordBreak="break-all">
            {item.name}
          </Text>
        </VStack>
      </DefaultLink>
    </VStack>
  </Box>
);
