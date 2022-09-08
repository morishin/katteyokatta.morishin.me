import { Img, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";

type Props = {
  asin: string;
  associateTag?: string;
};

const DEFAULT_ASSOCIATE_ID = "morishin02-22";

export const AmazonButton: FC<Props> = ({ asin, associateTag }) => {
  const linkUrl = `https://www.amazon.co.jp/dp/${asin}/?tag=${
    associateTag || DEFAULT_ASSOCIATE_ID
  }`;
  return (
    <Link href={linkUrl} passHref>
      <ChakraLink>
        <Img
          src="https://images-fe.ssl-images-amazon.com/images/G/09/associates/buttons/assocbtn_orange_amazon1.png"
          width="78px"
          height="23px"
        />
      </ChakraLink>
    </Link>
  );
};
