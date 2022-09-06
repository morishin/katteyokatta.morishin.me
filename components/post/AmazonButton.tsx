import { Img, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";

type Props = {
  asin: string;
  associateId?: string;
};

const DEFAULT_ASSOCIATE_ID = "morishin02-22";

export const AmazonButton: FC<Props> = ({ asin, associateId }) => {
  const linkUrl = `https://www.amazon.co.jp/dp/${asin}/?tag=${
    associateId || DEFAULT_ASSOCIATE_ID
  }`;
  return (
    <Link href={linkUrl} passHref>
      <ChakraLink>
        <Img
          src="https://images-fe.ssl-images-amazon.com/images/G/09/associates/buttons/assocbutt_or_amz.png"
          width="90px"
          height="26px"
        />
      </ChakraLink>
    </Link>
  );
};
