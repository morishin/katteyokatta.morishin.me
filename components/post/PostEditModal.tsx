import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { DefaultPost } from "~/lib/client/types/type";

type PostEditModalProps = {
  post: DefaultPost;
  isOpen: boolean;
  handleClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
};

type Inputs = {
  comment: string;
};

export const PostEditModal: FC<PostEditModalProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<Inputs>({
    defaultValues: { comment: props.post.comment },
  });

  const {
    handleSubmit: handleDelete,
    formState: {
      isSubmitting: isDeleting,
      isSubmitSuccessful: isDeleteSuccessful,
    },
  } = useForm();

  const mutation = trpcNext.post.update.useMutation();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await mutation.mutateAsync({ id: props.post.id, comment: data.comment });
    props.onUpdate();
  };

  const {
    isOpen: isOpenDeleteConfirm,
    onOpen: onOpenDeleteConfirm,
    onClose: onCloseDeleteConfirm,
  } = useDisclosure();
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  const deleteMutation = trpcNext.post.delete.useMutation();
  const onDelete = async () => {
    await deleteMutation.mutateAsync({ id: props.post.id });
    props.onDelete();
  };

  return (
    <>
      <Modal size="4xl" isOpen={props.isOpen} onClose={props.handleClose}>
        <ModalOverlay />
        <ModalContent paddingBottom={10}>
          <ModalHeader>投稿の編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="md" marginBottom={2}>
              よかったところ
            </Heading>
            <Textarea
              {...register("comment", { required: true })}
              variant="flushed"
              placeholder="これを買ってから成績が上がり身長は伸び彼女ができました！！"
              borderColor="gray.500"
              focusBorderColor={(theme.colors as any).secondary}
              isInvalid={errors.comment !== undefined}
            />
          </ModalBody>

          <ModalFooter>
            <Flex flex={1}>
              <Button
                colorScheme="red"
                mr={3}
                onClick={onOpenDeleteConfirm}
                alignSelf="flex-start"
              >
                削除
              </Button>
            </Flex>
            <HStack>
              <Button variant="ghost" onClick={props.handleClose}>
                キャンセル
              </Button>
              <Button
                fontSize="15px"
                color="white"
                bgColor="primary"
                _hover={{ bgColor: "#CC565A" }}
                type="submit"
                isLoading={isSubmitting || isSubmitSuccessful}
                disabled={isSubmitting || isSubmitSuccessful}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={handleSubmit(onSubmit)}
              >
                更新
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isOpenDeleteConfirm}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onCloseDeleteConfirm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              投稿の削除
            </AlertDialogHeader>

            <AlertDialogBody>
              この投稿を削除してもよろしいですか？
            </AlertDialogBody>

            <AlertDialogFooter>
              <HStack>
                <Button ref={cancelDeleteRef} onClick={onCloseDeleteConfirm}>
                  キャンセル
                </Button>
                <Button
                  fontSize="15px"
                  colorScheme="red"
                  type="submit"
                  isLoading={isDeleting || isDeleteSuccessful}
                  disabled={isDeleting || isDeleteSuccessful}
                  spinner={<BeatLoader size={8} color="white" />}
                  onClick={handleDelete(onDelete)}
                  marginLeft="15px"
                >
                  削除
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
