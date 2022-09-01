import { FC, PropsWithChildren } from "react";
import { GlobalHeader } from "./GlobalHeader";

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <header>
        <GlobalHeader />
      </header>
      <main>{children}</main>
    </>
  );
};
