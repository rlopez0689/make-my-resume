import { postProfessionalExperience } from "@/requests/requests";
import { ProfessionalExperienceData } from "@/shared/resumesTypes";
import { CheckIcon } from "@chakra-ui/icons";
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
  Stack,
  Textarea,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import PillsComponent from "./UI/PillsComponent";
import PrimaryButton from "./UI/PrimaryButton";
import RequestError from "./UI/RequestError";

const ProfessionalExperienceModal = ({
  isOpen,
  onClose,
  experience,
  candidateUUID,
}: {
  isOpen: boolean;
  onClose: () => void;
  experience: ProfessionalExperienceData | null;
  candidateUUID: string;
}) => {
  let isNewMode = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfessionalExperienceData>();

  useEffect(() => {
    if (experience?.id) {
      reset({
        company: experience.company,
        role: experience.role,
        industry: experience.industry,
        period: experience.period,
        use_case: experience.use_case,
        responsibilities: experience.responsibilities,
        technologies: experience.technologies,
      });
    }
    if (isOpen && !experience?.id) reset({});
  }, [experience, isOpen, reset]);

  if (experience) isNewMode = false;

  const mutation = useMutation({
    mutationFn: async (data: ProfessionalExperienceData) => {
      const method = isNewMode ? "POST" : "PATCH";
      const cleanData = {
        ...data,
        responsibilities: data.responsibilities.map(
          (responsability, index) => ({
            name: responsability,
            order: index,
          })
        ),
        technologies: data.technologies.map((technology, index) => ({
          name: technology,
          order: index,
        })),
      };
      try {
        await postProfessionalExperience(candidateUUID, method, isNewMode,experience?.id, cleanData)
        queryClient.invalidateQueries(
          `GetCandidateProfessionalExperiences-${candidateUUID}`
        );
        onClose();
        setIsSubmitting(false);
      } catch (error) {
        setError(true);
        setIsSubmitting(false);
      }
    },
  });

  const onSubmit = (data: ProfessionalExperienceData) => {
    setError(false);
    setIsSubmitting(true);
    mutation.mutate(data);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior={"outside"}
    >
      <ModalOverlay />
      <ModalContent>
        {error && <RequestError />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Professional Experience</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={2}>
              <FormControl isInvalid={errors.company ? true : false} isRequired>
                <FormLabel htmlFor="company">Company</FormLabel>
                <Input
                  id="company"
                  type="text"
                  placeholder="Company where you worked or the project name"
                  {...register("company", {
                    required: "This is required",
                    maxLength: 50,
                  })}
                />
                <FormErrorMessage>
                  {errors.company && errors.company.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              <Stack w="100%" direction={{ base: "column", lg: "row" }}>
                <FormControl
                  w={{ base: "100%", lg: "50%" }}
                  isInvalid={errors.role ? true : false}
                  isRequired
                >
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Input
                    id="role"
                    type="text"
                    placeholder="Your role in the company or project"
                    {...register("role", {
                      required: "This is required",
                      maxLength: 30,
                    })}
                  />
                  <FormErrorMessage>
                    {errors.role && errors.role.message?.toString()}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  w={{ base: "100%", lg: "50%" }}
                  isInvalid={errors.industry ? true : false}
                  isRequired
                >
                  <FormLabel htmlFor="industry">Industry</FormLabel>
                  <Input
                    id="industry"
                    type="text"
                    placeholder="Company or project industry"
                    {...register("industry", {
                      required: "This is required",
                      maxLength: 50,
                    })}
                  />
                  <FormErrorMessage>
                    {errors.industry && errors.industry.message?.toString()}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
              <FormControl isInvalid={errors.period ? true : false} isRequired>
                <FormLabel htmlFor="period">Period</FormLabel>
                <Input
                  id="period"
                  type="text"
                  placeholder="e.g April 2020 - June 2022"
                  {...register("period", {
                    required: "This is required",
                    maxLength: 50,
                  })}
                />
                <FormErrorMessage>
                  {errors.period && errors.period.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.use_case ? true : false}>
                <FormLabel htmlFor="use_case">Use Case</FormLabel>
                <Textarea
                  placeholder="What problem were you trying to solve?"
                  size="sm"
                  id="use_case"
                  {...register("use_case")}
                />
                <FormErrorMessage>
                  {errors.use_case && errors.use_case.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.responsibilities ? true : false}>
                <FormLabel htmlFor="responsibilities" mb={0}>
                  Responsibilities{" "}
                  <Text as="span" color="red">
                    *
                  </Text>
                </FormLabel>
                <Text fontSize="xs" mb={2}>
                  What were your responsibilities here?
                </Text>
                <Controller
                  control={control}
                  name="responsibilities"
                  rules={{ required: true, maxLength: 250 }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <PillsComponent
                      placeholder="e.g. Management of the team of testers"
                      onChange={(pills: string[]) => onChange(pills)}
                      defaultValues={
                        experience ? experience.responsibilities : []
                      }
                      maxLength={250}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.responsibilities &&
                    errors.responsibilities.message?.toString()}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.technologies ? true : false}>
                <FormLabel htmlFor="technologies" mb={0}>
                  Technologies{" "}
                  <Text as="span" color="red">
                    *
                  </Text>
                </FormLabel>
                <Text fontSize="xs" mb={2}>
                  Which technologies did you use?
                </Text>
                <Controller
                  control={control}
                  name="technologies"
                  rules={{ required: true, maxLength: 50 }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <PillsComponent
                      placeholder="e.g. python, java, javascript"
                      onChange={(pills: string[]) => onChange(pills)}
                      defaultValues={experience ? experience.technologies : []}
                      maxLength={50}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.technologies &&
                    errors.technologies.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent={"flex-start"} gap={3}>
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<CheckIcon />}
            >
              Save Changes
            </PrimaryButton>
            <Button colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ProfessionalExperienceModal;
