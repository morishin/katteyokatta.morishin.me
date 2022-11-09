import { Box } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { Announcement } from "~/components/layouts/Announcement";
import { GlobalHeader } from "~/components/layouts/GlobalHeader";

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <Announcement text="ただいまメンテナンス中です。一部の機能がご利用いただけません。(2022-11-09 09:30 JST)" />
      <GlobalHeader />
      <Box bg="#ededed" minHeight="100vh">
        {children}
      </Box>
    </>
  );
};
