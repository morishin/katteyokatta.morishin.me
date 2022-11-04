import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FC } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import { DefaultLink } from "~/components/DefaultLink";
import { SearchForm } from "~/components/layouts/SearchForm";
import { UserLink } from "~/components/UserLink";

const SearchModal = dynamic(
  () =>
    import("~/components/layouts/SearchModal").then(
      ({ SearchModal }) => SearchModal
    ),
  {
    ssr: false,
  }
);

type Props = {};

export const GlobalHeader: FC<Props> = () => {
  const { data: session } = useSession();
  const searchModal = useDisclosure();
  return (
    <header>
      <Box
        as="nav"
        boxShadow="0px 8px 7px 0 rgb(0 0 0 / 14%), 0 1px 0px 0 rgb(0 0 0 / 12%), 0 3px 1px -2px rgb(0 0 0 / 20%)"
        position="relative"
      >
        <Box bg="primary" color="white">
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
            <DefaultLink href="/" color="white">
              <Heading as="h1">
                <HStack alignItems="center">
                  <Center>
                    <Icon as={HiShoppingCart} w="24px" h="24px" />
                  </Center>
                  <Text fontSize="15px" fontWeight="bold" whiteSpace="nowrap">
                    買ってよかったもの
                  </Text>
                </HStack>
              </Heading>
            </DefaultLink>
            <Box flex={1}>
              <Box
                maxW="500px"
                marginLeft="20px"
                display={["none", "none", "block", "block"]}
              >
                <SearchForm />
              </Box>
            </Box>
            <Spacer display={["block", "block", "none", "none"]} />
            <HStack justifyContent="flex-end">
              <Flex textAlign="right" justifyContent="flex-end">
                <Box display={["block", "block", "none", "none"]}>
                  <IconButton
                    icon={<FaSearch color="white" />}
                    color="white"
                    bgColor="primary"
                    _hover={{ bgColor: "#CC565A" }}
                    aria-label="検索"
                    onClick={searchModal.onOpen}
                  />
                </Box>
                {session?.user ? (
                  <HStack spacing={0}>
                    <Box display={["none", "none", "none", "block"]}>
                      <Link href="/posts/new" passHref legacyBehavior>
                        <Button
                          leftIcon={<BsPlusLg color="white" />}
                          color="white"
                          bgColor="primary"
                          _hover={{ bgColor: "#CC565A" }}
                          as="a"
                        >
                          買ってよかったものを追加
                        </Button>
                      </Link>
                    </Box>
                    <Box
                      display={["block", "block", "block", "none"]}
                      paddingRight="10px"
                    >
                      <Link href="/posts/new" passHref legacyBehavior>
                        <IconButton
                          icon={<BsPlusLg color="white" />}
                          color="white"
                          bgColor="primary"
                          _hover={{ bgColor: "#CC565A" }}
                          as="a"
                          aria-label="買ってよかったものを追加"
                        />
                      </Link>
                    </Box>
                    <UserLink
                      userName={session.user.name ?? ""}
                      userImage={session.user.image ?? undefined}
                      color="white"
                      autoShrink
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
            </HStack>
          </Flex>
        </Box>
      </Box>
      {searchModal.isOpen && <SearchModal closeModal={searchModal.onClose} />}
    </header>
  );
};
