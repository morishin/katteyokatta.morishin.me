import { Box, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import type { FC } from "react";

type TweetButtonProps = {
  url: string | null;
};

export const TweetButton: FC<TweetButtonProps> = ({ url }) => {
  if (url === null) return null;
  return (
    <Box>
      <ChakraLink
        href={`https://twitter.com/intent/tweet?url=${encodeURI(url)}`}
      >
        <Box
          height="20px"
          borderRadius="10px"
          backgroundColor="black"
          _hover={{ backgroundColor: "#222222" }}
          color="white"
          paddingX="12px"
          paddingY="1px"
          lineHeight="20px"
          boxSizing="border-box"
          cursor="pointer"
        >
          <HStack alignItems="center" spacing="4px">
            <Text fontWeight="bold" fontSize="sm" color="white">
              𝕏
            </Text>
            <Box fontWeight="600" fontSize="12px">
              ポスト
            </Box>
          </HStack>
        </Box>
      </ChakraLink>
    </Box>
  );
};

// https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Flocalhost%3A3000%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&text=%20&url=http%3A%2F%2Flocalhost%3A3000%2Fitems%2F3
