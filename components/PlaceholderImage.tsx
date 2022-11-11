import { Center, Circle, Icon, LayoutProps } from "@chakra-ui/react";
import { FC } from "react";
import { HiShoppingCart } from "react-icons/hi";

type PlaceholderImageProps = {
  width: LayoutProps["width"];
  height: LayoutProps["height"];
};

export const PlaceholderImage: FC<PlaceholderImageProps> = ({
  width,
  height,
}) => {
  return (
    <Center width={width} height={height} bgColor="gray.200">
      <Circle bg="gray.300" size="70px" overflow="hidden">
        <Icon as={HiShoppingCart} w="30px" h="30px" color="gray.50" />
      </Circle>
    </Center>
  );
};
