import { Avatar, HStack, Text } from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  name: string;
  image?: string;
};

export const CurrentUser: FC<Props> = ({ name, image }) => {
  return (
    <HStack>
      <Avatar name={name} src={image} size="sm" />
      <Text>{name}</Text>
    </HStack>
  );
};
