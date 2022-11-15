import { Box } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";
import { GlobalHeader } from "~/components/layouts/GlobalHeader";

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <GlobalHeader />
      <Box bg="#ededed" minHeight="100vh">
        {children}
      </Box>
    </>
  );
};
