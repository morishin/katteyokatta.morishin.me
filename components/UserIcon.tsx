import { Circle, Icon, Image } from "@chakra-ui/react";
import type { FC } from "react";
import { BsPersonFill } from "react-icons/bs";

type Props = {
  image?: string | null;
  size?: number;
};

export const UserIcon: FC<Props> = ({ image, size }) => {
  const outerSize = size ?? 24;
  const innerSize = Math.round((outerSize * 5) / 6);
  return (
    <Circle bg="gray.400" size={`${outerSize}px`} overflow="hidden">
      <Image
        src={image ?? undefined}
        width={`${outerSize}px`}
        height={`${outerSize}px`}
        alt=""
        fallback={
          <Icon
            as={BsPersonFill}
            w={`${innerSize}px`}
            h={`${innerSize}px`}
            color="white"
          />
        }
      />
    </Circle>
  );
};
