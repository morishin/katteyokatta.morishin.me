import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { chakraTheme } from "~/lib/client/chakraTheme";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import "~/styles/globals.css";
import { Layout } from "../components/layouts/Layout";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <Analytics debug={process.env.NODE_ENV === "development"} />
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpcNext.withTRPC(MyApp);
