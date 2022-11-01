import { HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import { ComponentProps, FC } from "react";
import { DefaultLink } from "~/components/DefaultLink";
import { UserIcon } from "~/components/UserIcon";

type Props = {
  size?: number;
  userName: string;
  userImage?: string | null;
  color?: ComponentProps<typeof ChakraLink>["color"];
  autoShrink?: boolean;
};

export const UserLink: FC<Props> = ({
  userName,
  userImage,
  size,
  color = "primary",
  autoShrink = false,
}) => {
  return (
    <DefaultLink href={`/${userName}`} color={color}>
      <HStack spacing="4px">
        <UserIcon image={userImage} size={size} />
        <Text
          fontSize="md"
          display={autoShrink ? ["none", "none", "inline", "inline"] : "inline"}
        >
          {userName}
        </Text>
      </HStack>
    </DefaultLink>
  );
};
