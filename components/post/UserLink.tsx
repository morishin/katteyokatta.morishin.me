import { HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { PostForTopPageFragment } from "~/lib/client/generated";
import { UserIcon } from "../UserIcon";

type Props = {
  user: PostForTopPageFragment["user"];
};

export const UserLink: FC<Props> = ({ user }) => {
  return (
    <Link href={`/${user.name}`} passHref>
      <ChakraLink color="primary">
        <HStack spacing="4px">
          <UserIcon image={user.image} />
          <Text>{user.name}</Text>
        </HStack>
      </ChakraLink>
    </Link>
  );
};
