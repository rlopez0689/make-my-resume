import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import RequestError from "./UI/RequestError";
import PrimaryButton from "./UI/PrimaryButton";
import { postEmployee } from "@/requests/requests";

export type NewUser = {
  email: string;
  name?: string;
  role?: string;
};

const NewUserModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewUser>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: NewUser) => {
      try {
        await postEmployee(data)
        queryClient.invalidateQueries("GetResumes");
        setIsSubmitting(false);
        setError(false);
        onClose();
      } catch (err) {
        setError(true);
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) reset({});
  }, [isOpen, reset]);

  const onSubmit = (data: NewUser) => {
    setError(false);
    setIsSubmitting(true);
    return mutation.mutate(data);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {error && <RequestError />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            Add New resume
            <Text fontSize="xs" fontWeight={"300"}>
              Include the employee or candidate information to create a new
              entry
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={2}>
              <FormControl isInvalid={errors.email ? true : false} isRequired>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  id="email"
                  data-testid="email"
                  type="email"
                  placeholder="e.g.johndoe@johndoe.com"
                  {...register("email", {
                    required: "This is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  data-testid="name"
                  type="text"
                  maxLength={30}
                  {...register("name")}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="role">Role</FormLabel>
                <Input
                  id="role"
                  data-testid="role"
                  type="text"
                  {...register("role")}
                  placeholder="e.g. Back-end developer"
                  maxLength={30}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              data-testid="submit-add-new-button"
            >
              Add new
            </PrimaryButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewUserModal;
