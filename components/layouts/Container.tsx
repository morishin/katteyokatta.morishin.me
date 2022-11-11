import { Box } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";

export const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      as="main"
      maxW="1200px"
      paddingTop={2}
      paddingBottom={2}
      paddingLeft={{ base: 2, md: 4 }}
      paddingRight={{ base: 2, md: 4 }}
      marginLeft="auto"
      marginRight="auto"
    >
      {children}
    </Box>
  );
};
