import { HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ComponentProps, FC } from "react";
import { UserIcon } from "~/components/UserIcon";

type Props = {
  size?: number;
  userName: string;
  userImage?: string | null;
  color?: ComponentProps<typeof ChakraLink>["color"];
};

export const UserLink: FC<Props> = ({
  userName,
  userImage,
  size,
  color = "primary",
}) => {
  return (
    <Link href={`/${userName}`} passHref>
      <ChakraLink color={color}>
        <HStack spacing="4px">
          <UserIcon image={userImage} size={size} />
          <Text>{userName}</Text>
        </HStack>
      </ChakraLink>
    </Link>
  );
};
