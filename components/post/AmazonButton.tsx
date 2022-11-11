import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import type { FC } from "react";
import { DefaultLink } from "~/components/DefaultLink";

type Props = {
  asin: string;
  associateTag?: string;
  type: "text" | "small" | "large";
};

const DEFAULT_ASSOCIATE_ID = process.env.NEXT_PUBLIC_DEFAULT_ASSOCIATE_ID;

export const AmazonButton: FC<Props> = ({ asin, associateTag, type }) => {
  const linkUrl = `https://www.amazon.co.jp/dp/${asin}/?tag=${
    associateTag || DEFAULT_ASSOCIATE_ID
  }`;
  const width = (() => {
    switch (type) {
      case "text":
        return "auto";
      case "small":
        return "78px";
      case "large":
        return "177px";
    }
  })();
  return (
    <Box w={width}>
      <DefaultLink href={linkUrl} target="_blank">
        {type === "text" ? (
          <Text size="sm" color="primary">
            Amazon詳細ページを見る
          </Text>
        ) : type === "small" ? (
          <Image
            src="https://images-fe.ssl-images-amazon.com/images/G/09/associates/buttons/assocbtn_orange_amazon1.png"
            alt="Amazon詳細ページを見る"
            width="78"
            height="23"
          />
        ) : (
          <Image
            src="https://images-fe.ssl-images-amazon.com/images/G/09/associates/buttons/assocbtn_orange_amazon4.png"
            alt="Amazon詳細ページを見る"
            width="177"
            height="28"
          />
        )}
      </DefaultLink>
    </Box>
  );
};
