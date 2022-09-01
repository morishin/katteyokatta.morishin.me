import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import { HiShoppingCart } from "react-icons/hi";
import { CurrentUser } from "./CurrentUser";
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
          maxW="1100px"
          paddingTop={2}
          paddingBottom={2}
          paddingLeft={{ base: 2, md: 4 }}
          paddingRight={{ base: 2, md: 4 }}
          marginLeft="auto"
          marginRight="auto"
          alignItems="center"
        >
          <Link href="/">
            <Heading as="h1" marginRight={{ base: 2, md: 4, lg: 20 }}>
              <Link href="/">
                <a>
                  <HStack alignItems="center">
                    <Center>
                      <Icon as={HiShoppingCart} w="24px" h="24px" />
                    </Center>
                    <Text fontSize="15px" fontWeight="bold">
                      買ってよかったもの
                    </Text>
                  </HStack>
                </a>
              </Link>
            </Heading>
          </Link>
          <SearchForm />
          <Flex flex="auto" textAlign="right" justifyContent="flex-end">
            {session?.user ? (
              <CurrentUser
                name={session.user.name || ""}
                image={session.user.image || undefined}
              />
            ) : (
              <Button variant="outline" onClick={() => signIn()}>
                Twitterログイン
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </nav>
  );
};
