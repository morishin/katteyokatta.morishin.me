import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Layout } from "../components/layouts/Layout";
import "../styles/globals.css";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "gray.800",
      },
    },
  },
  semanticTokens: {
    colors: {
      primary: {
        default: "#F2676A",
        _dark: "#CC565A",
      },
      secondary: {
        default: "#46BAED",
        _dark: "#3DA2CF",
      },
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
