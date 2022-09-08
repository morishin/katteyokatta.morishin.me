import { Center, Circle, Icon } from "@chakra-ui/react";
import { FC } from "react";
import { HiShoppingCart } from "react-icons/hi";

export const ReachedEndMark: FC = () => (
  <Center marginY="70px">
    <Circle bg="#ddd" size="70px" overflow="hidden">
      <Icon as={HiShoppingCart} w="30px" h="30px" color="white" />
    </Circle>
  </Center>
);
