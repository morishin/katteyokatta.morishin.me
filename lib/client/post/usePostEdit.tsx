import { useDisclosure, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { DefaultPost } from "../types/type";

export const usePostEdit = ({
  onUpdateOrDeletePost,
}: {
  onUpdateOrDeletePost: () => void;
}) => {
  const onUpdateOrDelete = useCallback(onUpdateOrDeletePost, [
    onUpdateOrDeletePost,
  ]);

  const {
    isOpen: isOpenPostEditModal,
    onOpen: openPostEditModal,
    onClose: closePostEditModal,
  } = useDisclosure();
  const [editingPost, setEditingPost] = useState<DefaultPost | null>(null);
  const toast = useToast();

  const onUpdatePost = useCallback(() => {
    toast({
      title: "更新しました",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      containerStyle: {
        marginTop: "70px",
      },
    });
    closePostEditModal();
    onUpdateOrDelete();
  }, [closePostEditModal, onUpdateOrDelete, toast]);

  const onDeletePost = useCallback(() => {
    toast({
      title: "削除しました",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      containerStyle: {
        marginTop: "70px",
      },
    });
    closePostEditModal();
    onUpdateOrDelete();
  }, [closePostEditModal, onUpdateOrDelete, toast]);

  return {
    isOpenPostEditModal,
    openPostEditModal,
    editingPost,
    setEditingPost,
    onUpdatePost,
    onDeletePost,
    closePostEditModal,
  };
};
