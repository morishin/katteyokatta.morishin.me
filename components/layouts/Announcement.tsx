import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

export const Announcement: FC<{ text: string }> = ({ text }) => {
  return (
    <Box w="100%" textAlign="center" bgColor="secondary" padding="10px">
      <Text size="xl" color="white" fontWeight="bold">
        {text}
      </Text>
    </Box>
  );
};
