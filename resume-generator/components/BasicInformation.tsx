import { fetchCandidateInfo, postBasicInformation } from "@/requests/requests";
import { Candidate, CandidateInfo } from "@/shared/resumesTypes";
import { CheckIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoaderSpinner from "./UI/LoaderSpinner";
import PillsComponent from "./UI/PillsComponent";
import PrimaryButton from "./UI/PrimaryButton";
import RequestError from "./UI/RequestError";

const BasicInformation = ({
  candidateUUID,
  candidate,
}: {
  candidateUUID: string;
  candidate: Candidate;
}) => {
  const toast = useToast();
  let isNewMode = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitedError, setSubmittedError] = useState(false);

  const queryClient = useQueryClient();
  const { data, error, isFetching } = useQuery<CandidateInfo>(
    `GetCandidateInfo-${candidateUUID}`,
    () => fetchCandidateInfo(candidateUUID)
  );

  if (data?.id) isNewMode = false;

  const mutation = useMutation({
    mutationFn: async (data: CandidateInfo) => {
      const method = isNewMode ? "POST" : "PATCH";
      const cleanData = {
        ...data,
        skills: data.skills.map((skill, index) => ({
          name: skill,
          order: index,
        })),
        certifications: data.certifications?.map((certification, index) => ({
          name: certification,
          order: index,
        })),
      };
      try {
        await postBasicInformation(candidateUUID, method, cleanData)
        queryClient.invalidateQueries("GetCandidateInfo");
        toast({
          title: "Basic information saved successfully",
          status: "success",
          position: "top-right",
          duration: 6000,
          isClosable: true,
        });
        setIsSubmitting(false);
      } catch (error) {
        setSubmittedError(true);
        setIsSubmitting(false);
      }
    },
  });

  const onSubmit = (data: CandidateInfo) => {
    setIsSubmitting(true);
    setSubmittedError(false);
    mutation.mutate(data);
  };

  return (
    <>
      <Text my={5} fontSize="2xl">
        Basic Information
      </Text>
      {isFetching && <LoaderSpinner />}
      {error && <RequestError />}
      {!isFetching && !error && data && (
        <BasicInformationForm
          candidate={candidate}
          candidateInfo={data}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isSubmittedError={submitedError}
        />
      )}
    </>
  );
};

const BasicInformationForm = ({
  candidateInfo,
  onSubmit,
  isSubmitting,
  isSubmittedError,
  candidate,
}: {
  candidateInfo: CandidateInfo;
  onSubmit: (arg: CandidateInfo) => void;
  isSubmitting: boolean;
  isSubmittedError: boolean;
  candidate: Candidate;
}) => {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<CandidateInfo>();

  useEffect(() => {
    if (candidateInfo.id) {
      reset({
        preferred_name: candidateInfo.preferred_name,
        role: candidateInfo.role,
        profile: candidateInfo.profile,
        skills: candidateInfo.skills,
        certifications: candidateInfo.certifications,
      });
    } else {
      const formValues: any = {};
      if (candidate.name) formValues.preferred_name = candidate.name;
      if (candidate.role) formValues.role = candidate.role;
      reset(formValues);
    }
  }, [candidate.name, candidate.role, candidateInfo, reset]);

  return (
    <VStack
      bgColor="white"
      p={5}
      w="100%"
      alignItems="self-start"
      borderRadius={5}
      gap={5}
      mt={5}
    >
      {isSubmittedError && <RequestError />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Stack w="100%" direction={{ base: "column", lg: "row" }}>
          <FormControl
            w={{ base: "100%", lg: "50%" }}
            isInvalid={errors.preferred_name ? true : false}
            isRequired
          >
            <FormLabel htmlFor="preferred_name">
              What is your preferred name?
            </FormLabel>
            <Input
              id="preferred_name"
              type="text"
              placeholder="Include a name and last name"
              {...register("preferred_name", {
                required: "This is required",
                maxLength: 50,
              })}
            />
            <FormErrorMessage>
              {errors.preferred_name &&
                errors.preferred_name.message?.toString()}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            w={{ base: "100%", lg: "50%" }}
            isInvalid={errors.role ? true : false}
            isRequired
          >
            <FormLabel htmlFor="role">What is your main role?</FormLabel>
            <Input
              id="role"
              type="text"
              {...register("role", {
                required: "This is required",
                maxLength: 50,
              })}
            />
            <FormErrorMessage>
              {errors.role && errors.role.message?.toString()}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <FormControl isInvalid={errors.profile ? true : false} isRequired>
          <FormLabel htmlFor="profile">Professional summary</FormLabel>
          <Text fontSize="xs" mb={2}>
            Showcase your expertise by mentioning your role, professional
            experience, and, most importantly, your most significant
            achievements and best qualities.
          </Text>
          <Textarea
            placeholder="Include a brief description about yourself including aspects of your role and skills"
            size="sm"
            id="professional_summary"
            {...register("profile", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.profile && errors.profile.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.skills ? true : false}>
          <FormLabel htmlFor="skills" mb={0}>
            Skills{" "}
            <Text as="span" color="red">
              *
            </Text>
          </FormLabel>
          <Text fontSize="xs" mb={2}>
            Please enter the name of the skill you possess. Remember to include
            the technologies you are skilled at
          </Text>
          <Controller
            control={control}
            name="skills"
            rules={{ required: true, maxLength: 50 }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <PillsComponent
                placeholder="e.g. Selenium"
                onChange={(pills: string[]) => onChange(pills)}
                defaultValues={candidateInfo ? candidateInfo.skills : []}
                maxLength={50}
              />
            )}
          />
          <FormErrorMessage>
            {errors.skills && errors.skills.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="certifications" mb={0}>
            Certifications
          </FormLabel>
          <Text fontSize="xs" mb={2}>
            Please enter the name of the certification you have earned.
          </Text>
          <Controller
            control={control}
            name="certifications"
            rules={{ maxLength: 50 }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <PillsComponent
                placeholder="e.g. CSM"
                onChange={(pills: string[]) => onChange(pills)}
                defaultValues={
                  candidateInfo ? candidateInfo.certifications : []
                }
                maxLength={50}
              />
            )}
          />
          <FormErrorMessage>
            {errors.certifications && errors.certifications.message?.toString()}
          </FormErrorMessage>
        </FormControl>

        <PrimaryButton
          type="submit"
          leftIcon={<CheckIcon />}
          colorScheme="blue"
          mt={4}
          isLoading={isSubmitting}
          width="fit-content"
        >
          Save changes
        </PrimaryButton>
      </form>
    </VStack>
  );
};

export default BasicInformation;
