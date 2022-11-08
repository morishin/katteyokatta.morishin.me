import { Box, HStack, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { FC } from "react";
import { FaTwitter } from "react-icons/fa";

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
          backgroundColor="#1d9bf0"
          _hover={{ backgroundColor: "#0c7abf" }}
          color="white"
          paddingX="12px"
          paddingY="1px"
          lineHeight="20px"
          boxSizing="border-box"
          cursor="pointer"
        >
          <HStack alignItems="center" spacing="4px">
            <Icon as={FaTwitter} w="12px" h="12px" verticalAlign="top" />
            <Box fontWeight="600" fontSize="12px">
              ツイート
            </Box>
          </HStack>
        </Box>
      </ChakraLink>
    </Box>
  );
};

// https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Flocalhost%3A3000%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&text=%20&url=http%3A%2F%2Flocalhost%3A3000%2Fitems%2F3
