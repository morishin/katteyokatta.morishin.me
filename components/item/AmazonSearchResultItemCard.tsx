import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import type { FC } from "react";
import { PlaceholderImage } from "~/components/PlaceholderImage";
import { DefaultAmazonItem } from "~/lib/client/types/type";

type AmazonSearchResultItemCardProps = {
  item: DefaultAmazonItem;
  onClick: (item: DefaultAmazonItem) => void;
};

export const AmazonSearchResultItemCard: FC<
  AmazonSearchResultItemCardProps
> = ({ item, onClick }) => {
  const handleClick = () => onClick(item);
  return (
    <button type="button" onClick={handleClick}>
      <HStack
        bg="white"
        cursor="pointer"
        boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
        _hover={{
          boxShadow:
            "0 8px 17px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)",
        }}
        borderRadius="8px"
        transitionDuration="0.25s"
        padding="10px"
        spacing="20px"
      >
        <Box bg="gray.200" w="100px" h="100px">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              width="100"
              height="100"
              style={{
                objectFit: "contain",
                width: "100px",
                height: "100px",
              }}
            />
          ) : (
            <PlaceholderImage width="100px" height="100px" />
          )}
        </Box>
        <VStack
          alignItems="stretch"
          flex="1"
          minH="100px"
          spacing="0"
          justifyContent="space-between"
          paddingY="5px"
        >
          <Text textAlign="start" wordBreak="break-all">
            {item.name}
          </Text>
        </VStack>
      </HStack>
    </button>
  );
};
