import { HStack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { UserIcon } from "../UserIcon";

type Props = {
  name: string;
  image?: string;
};

export const CurrentUser: FC<Props> = ({ name, image }) => {
  return (
    <HStack>
      <UserIcon image={image} />
      <Text>{name}</Text>
    </HStack>
  );
};
