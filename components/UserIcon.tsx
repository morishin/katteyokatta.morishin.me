import { Circle, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { FC, useState } from "react";
import { BsPersonFill } from "react-icons/bs";

type Props = {
  image?: string | null;
  size?: number;
};

export const UserIcon: FC<Props> = ({ image, size }) => {
  const outerSize = size ?? 24;
  const innerSize = Math.round((outerSize * 5) / 6);
  const [noImage, setNoImage] = useState(image ? false : true);
  return (
    <Circle bg="gray.400" size={`${outerSize}px`} overflow="hidden">
      {!image || noImage ? (
        <Icon
          as={BsPersonFill}
          w={`${innerSize}px`}
          h={`${innerSize}px`}
          color="white"
        />
      ) : (
        <Image
          src={image}
          width={outerSize}
          height={outerSize}
          alt=""
          onError={() => {
            setNoImage(true);
          }}
        />
      )}
    </Circle>
  );
};
