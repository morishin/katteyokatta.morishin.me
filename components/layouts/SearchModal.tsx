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
  closeModal: () => void;
};

export const SearchModal: FC<SearchModalProps> = ({ closeModal }) => {
  return (
    <Modal onClose={closeModal} size="full" isOpen={true}>
      <ModalOverlay />
      <ModalContent onClick={closeModal} bgColor="transparent">
        <Box
          paddingTop="10px"
          paddingBottom="8px"
          paddingLeft="8px"
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
