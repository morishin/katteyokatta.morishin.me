import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import { BsPlusLg } from "react-icons/bs";
import { HiShoppingCart } from "react-icons/hi";
import { UserLink } from "../UserLink";
import { SearchForm } from "./SearchForm";

type Props = {};

export const GlobalHeader: FC<Props> = () => {
  const { data: session } = useSession();
  return (
    <nav>
      <Box
        bg="primary"
        color="white"
        boxShadow="0px 8px 7px 0 rgb(0 0 0 / 14%), 0 1px 0px 0 rgb(0 0 0 / 12%), 0 3px 1px -2px rgb(0 0 0 / 20%)"
      >
        <Flex
          maxW="1200px"
          paddingTop={2}
          paddingBottom={2}
          paddingLeft={{ base: 2, md: 4 }}
          paddingRight={{ base: 2, md: 4 }}
          marginLeft="auto"
          marginRight="auto"
          alignItems="center"
        >
          <Link href="/" passHref>
            <ChakraLink>
              <Heading as="h1">
                <HStack alignItems="center">
                  <Center>
                    <Icon as={HiShoppingCart} w="24px" h="24px" />
                  </Center>
                  <Text fontSize="15px" fontWeight="bold">
                    買ってよかったもの
                  </Text>
                </HStack>
              </Heading>
            </ChakraLink>
          </Link>
          <Spacer />
          <SearchForm />
          <Flex flex="auto" textAlign="right" justifyContent="flex-end">
            {session?.user ? (
              <HStack>
                <Button
                  leftIcon={<BsPlusLg color="white" />}
                  color="white"
                  bgColor="primary"
                  _hover={{ bgColor: "#CC565A" }}
                  as="a"
                  href="/posts/new"
                >
                  買ってよかったものを追加
                </Button>
                <UserLink
                  userName={session.user.name ?? ""}
                  userImage={session.user.image ?? undefined}
                  color="white"
                />
              </HStack>
            ) : (
              <Button
                variant="outline"
                _hover={{ bgColor: "#f07e80" }}
                onClick={() => signIn()}
              >
                Twitterログイン
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </nav>
  );
};
