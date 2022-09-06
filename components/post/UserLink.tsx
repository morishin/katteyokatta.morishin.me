import {
  Circle,
  HStack,
  Icon,
  Image,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { BsPersonFill } from "react-icons/bs";
import { PostForTopPageFragment } from "~/lib/client/generated";

type Props = {
  user: PostForTopPageFragment["user"];
};

export const UserLink: FC<Props> = ({ user }) => {
  return (
    <Link href={`/${user.name}`} passHref>
      <ChakraLink color="primary">
        <HStack spacing="4px">
          <Circle bg="gray.400" size="24px" overflow="hidden">
            <Image
              src={user.image || undefined}
              width="24px"
              height="24px"
              alt=""
              fallback={
                <Icon as={BsPersonFill} w="20px" h="20px" color="white" />
              }
            />
          </Circle>
          <Text>{user.name}</Text>
        </HStack>
      </ChakraLink>
    </Link>
  );
};
