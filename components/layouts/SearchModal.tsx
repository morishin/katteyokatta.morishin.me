import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { FC } from "react";
import { SearchForm } from "./SearchForm";

type SearchModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export const SearchModal: FC<SearchModalProps> = ({ isOpen, closeModal }) => {
  return (
    <Modal onClose={closeModal} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent onClick={closeModal} bgColor="transparent">
        <Box
          paddingTop={2}
          paddingBottom={2}
          paddingLeft={{ base: 2, md: 4 }}
          paddingRight="42px"
          backgroundColor="primary"
        >
          <SearchForm />
        </Box>
        <ModalCloseButton color="white" marginTop="4px" marginRight="-6px" />
      </ModalContent>
    </Modal>
  );
};
