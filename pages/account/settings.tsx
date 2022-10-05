import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Link as ChakraLink,
  Text,
  theme,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCog } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

export const getServerSideProps: GetServerSideProps<AccountSettingsPageProps> =
  makeGetServerSideProps<AccountSettingsPageProps>(
    async (_context, { session }) => {
      if (!session)
        return { redirect: { destination: "/login", permanent: false } };
      return { props: { associateTag: session.user.associateTag } };
    }
  );

type AccountSettingsPageProps = { associateTag: string | null };

type Inputs = {
  associateTag: string;
};

const AccountSettingsPage: FC<AccountSettingsPageProps> = ({
  associateTag,
}) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>({
    defaultValues: { associateTag: associateTag ?? undefined },
  });

  const mutation = trpcNext.user.updateAssociateTag.useMutation();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutation.mutate(data.associateTag);
  };

  useEffect(() => {
    if (!isSubmitting && isSubmitSuccessful) {
      toast({
        title: "保存しました",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        containerStyle: {
          marginTop: "70px",
        },
      });
    } else {
      toast.closeAll();
    }
  }, [isSubmitting, isSubmitSuccessful, toast]);

  return (
    <div>
      <Heading as="h2" fontSize="xl">
        <HStack spacing="2px" marginTop="15px" marginBottom="20px">
          <Icon as={FaCog} />
          <Text>アカウント設定</Text>
        </HStack>
      </Heading>
      <VStack alignItems="flex-start" spacing="20px">
        <VStack
          borderRadius="6px"
          bg="white"
          boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
          width="100%"
          padding="24px"
          alignItems="flex-start"
        >
          <Heading as="h3" fontSize="lg">
            AmazonアソシエイトIDを設定 (お持ちの方)
          </Heading>
          <Text>
            AmazonアソシエイトID (トラッキングID)
            を設定すると、あなたのページ内の商品リンクがあなたのアフィリエイトリンクになります。
          </Text>
          <Box as="form" onSubmit={handleSubmit(onSubmit)} paddingTop="15px">
            <HStack alignItems="center" spacing="20px">
              <Input
                {...register("associateTag")}
                variant="flushed"
                placeholder="storeId-22"
                borderColor="gray.500"
                focusBorderColor={(theme.colors as any).secondary}
                w="250px"
              />
              <Button
                fontSize="15px"
                color="white"
                bgColor="primary"
                _hover={{ bgColor: "#CC565A" }}
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                spinner={<BeatLoader size={8} color="white" />}
              >
                保存
              </Button>
            </HStack>
          </Box>
        </VStack>
        <Link href="/logout" passHref>
          <ChakraLink color="primary">ログアウト</ChakraLink>
        </Link>
      </VStack>
    </div>
  );
};
export default AccountSettingsPage;
