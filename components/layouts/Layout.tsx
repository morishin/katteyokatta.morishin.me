import { Box } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { GlobalHeader } from "./GlobalHeader";

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <header>
        <GlobalHeader />
      </header>
      <Box bg="#ededed" minHeight="100vh">
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
      </Box>
    </>
  );
};
