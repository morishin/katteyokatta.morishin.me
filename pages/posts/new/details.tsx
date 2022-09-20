import {
  Box,
  Button,
  Img,
  Spacer,
  Text,
  Textarea,
  theme,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { AmazonButton } from "~/components/post/AmazonButton";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";

type NewPostDetailsPageProps = {
  item: {
    asin: string;
    name: string;
    image: string | null;
  };
};

export const getServerSideProps: GetServerSideProps<NewPostDetailsPageProps> =
  makeGetServerSideProps<NewPostDetailsPageProps>(
    async (context, { session }) => {
      if (!session) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      const name = context.query["name"]?.toString();
      const asin = context.query["asin"]?.toString();
      const image = context.query["image"]?.toString() ?? null;

      if (!name || !asin) {
        return {
          redirect: {
            destination: "/posts/new",
            permanent: false,
          },
        };
      }

      return {
        props: {
          item: {
            name,
            asin,
            image,
          },
        },
      };
    }
  );

type Inputs = {
  comment: string;
};

const NewPostDetailsPage: NextPage<NewPostDetailsPageProps> = ({ item }) => {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>();

  const mutation = trpcNext.post.add.useMutation();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await mutation.mutateAsync({ item, comment: data.comment });
    router.push({
      pathname: `/items/${result.post.item.id}`,
      hash: `comments-${result.post.id}`,
    });
  };

  useEffect(() => {
    setFocus("comment");
  }, [setFocus]);

  useEffect(() => {
    if (errors.comment) {
      toast({
        title: "コメントを入力してください",
        status: "error",
        isClosable: true,
      });
    } else {
      toast.closeAll();
    }
  }, [errors.comment, toast]);

  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
      <VStack
        marginTop="40px"
        alignItems="center"
        borderRadius="6px"
        bg="white"
        boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
        maxWidth="640px"
        padding="24px"
        marginX="auto"
        spacing="20px"
      >
        <Img src={item.image || undefined} maxHeight="200px" marginX="auto" />
        <Text fontWeight="bold" fontSize="sm">
          {item.name}
        </Text>
        <AmazonButton asin={item.asin} type="large" />
        <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
          <VStack alignItems="center">
            <Textarea
              {...register("comment", { required: true })}
              variant="flushed"
              placeholder="これを買ってから成績が上がり身長は伸び彼女ができました！！"
              borderColor="gray.500"
              focusBorderColor={(theme.colors as any).secondary}
              isInvalid={errors.comment !== undefined}
            />
            <Spacer h="20px" />
            <Button
              fontSize="15px"
              color="white"
              bgColor="primary"
              _hover={{ bgColor: "#CC565A" }}
              type="submit"
              isLoading={isSubmitting || isSubmitSuccessful}
              disabled={isSubmitting || isSubmitSuccessful}
              spinner={<BeatLoader size={8} color="white" />}
            >
              登録
            </Button>
          </VStack>
        </Box>
      </VStack>
    </div>
  );
};

export default NewPostDetailsPage;
