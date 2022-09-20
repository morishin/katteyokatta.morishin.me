import { extendTheme } from "@chakra-ui/react";

export const chakraTheme = extendTheme({
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
