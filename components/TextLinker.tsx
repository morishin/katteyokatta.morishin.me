import { Text, type TextProps } from "@chakra-ui/react";
import { memo } from "react";
import { DefaultLink } from "~/components/DefaultLink";

type TextLinkerProps = {
  text: string;
} & TextProps;

const LINE_BREAK_REGEX = /(\r\n|\r|\n)/g;

type Token = { type: "plain"; text: string } | { type: "url"; text: string };
const parse = (text: string): Token[] => {
  const urlRegex =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;

  const tokens: Token[] = [];
  let result;
  let currentIndex = 0;

  while ((result = urlRegex.exec(text))) {
    if (currentIndex !== result.index) {
      tokens.push({
        type: "plain",
        text: text.slice(currentIndex, result.index),
      });
    }
    tokens.push({ type: "url", text: result[0] });
    currentIndex = urlRegex.lastIndex;
  }

  const tail = text.slice(currentIndex);
  if (tail !== "") {
    tokens.push({ type: "plain", text: tail });
  }

  return tokens;
};

export const TextLinker = memo<TextLinkerProps>(function TextLinker({
  text,
  ...textProps
}) {
  const nodes = text.split(LINE_BREAK_REGEX).map((line, idx) => {
    if (LINE_BREAK_REGEX.test(line)) {
      return <br key={idx} />;
    }

    return parse(line).map((token, i) => {
      if (token.type === "plain") {
        return token.text;
      } else if (token.type === "url") {
        return (
          <DefaultLink href={token.text} key={i}>
            {token.text}
          </DefaultLink>
        );
      }
    });
  });

  return <Text {...textProps}>{nodes}</Text>;
});
