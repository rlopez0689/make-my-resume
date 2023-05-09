import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import PrimaryButton from "./PrimaryButton";

type ConfirmationProps = {
  title: string;
  description: string;
  body: string;
  isOpen: boolean;
  isDelete: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  title,
  description,
  body,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  isDelete = false,
  onCancel,
}: ConfirmationProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        {title}
        <Text fontSize="xs" fontWeight={"300"}>
          {description}
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>{body}</ModalBody>

      <ModalFooter>
        <Button colorScheme="gray" mr={3} onClick={onCancel}>
          Cancel
        </Button>
        {isDelete ? (
          <PrimaryButton
            leftIcon={<DeleteIcon />}
            onClick={onConfirm}
            isLoading={isSubmitting}
          >
            Delete
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onConfirm} isLoading={isSubmitting}>
            Confirm
          </PrimaryButton>
        )}
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmationModal;
