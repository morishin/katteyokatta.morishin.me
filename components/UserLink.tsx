import { HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { UserIcon } from "~/components/UserIcon";

type Props = {
  size?: number;
  userName: string;
  userImage?: string | null;
};

export const UserLink: FC<Props> = ({ userName, userImage, size }) => {
  return (
    <Link href={`/${userName}`} passHref>
      <ChakraLink color="primary">
        <HStack spacing="4px">
          <UserIcon image={userImage} size={size} />
          <Text>{userName}</Text>
        </HStack>
      </ChakraLink>
    </Link>
  );
};
