import { deleteProfessionalExperience, fetchCandidateProfessionalExperiences } from "@/requests/requests";
import { ProfessionalExperienceData } from "@/shared/resumesTypes";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  UnorderedList,
  ListItem,
  Badge,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ProfessionalExperienceModal from "./ProfessionalExperienceModal";
import ConfirmationModal from "./UI/ConfirmationModal";
import LoaderSpinner from "./UI/LoaderSpinner";
import OutlineButton from "./UI/OutlineButton";
import PrimaryButton from "./UI/PrimaryButton";
import RequestError from "./UI/RequestError";

const ProfessionalExperience = ({
  candidateUUID,
}: {
  candidateUUID: string;
}) => {
  const [selectedExperience, setSelectedExperience] =
    useState<ProfessionalExperienceData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedExperienceDelete, setSelectedExperienceDelete] =
    useState<number>();

  const {
    data: experiences,
    isFetching,
    error,
  } = useQuery(`GetCandidateProfessionalExperiences-${candidateUUID}`, () =>
    fetchCandidateProfessionalExperiences(candidateUUID)
  );

  const showFailedToast = () => {
    toast({
      title: "Request Error, can't delete at the moment",
      status: "error",
      position: "top-right",
      duration: 6000,
      isClosable: true,
    });
  };

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await deleteProfessionalExperience(id)
        queryClient.invalidateQueries(
          `GetCandidateProfessionalExperiences-${candidateUUID}`
        );
        onCloseConfirm();
      } catch (error) {
        showFailedToast();
        onCloseConfirm();
      }
    },
  });

  return (
    <>
      <ConfirmationModal
        title={"Delete professional experience"}
        description={"the action will delete this experience from your resume"}
        body={"Are you sure you want to delete this experience?"}
        isOpen={isOpenConfirm}
        isDelete={true}
        isSubmitting={mutation.isLoading}
        onClose={onCloseConfirm}
        onCancel={() => onCloseConfirm()}
        onConfirm={() => {
          if (selectedExperienceDelete)
            return mutation.mutate(selectedExperienceDelete);
        }}
      />
      <ProfessionalExperienceModal
        isOpen={isOpen}
        onClose={onClose}
        experience={selectedExperience}
        candidateUUID={candidateUUID}
      />
      <VStack alignItems={"flex-start"} w="100%" gap={5}>
        <>
          <Text mt={5} fontSize="2xl">
            Professional Experience
          </Text>
          {isFetching && <LoaderSpinner />}
          {error && <RequestError />}
          {!isFetching && !error && (
            <>
              {experiences && experiences?.length > 0 ? (
                <OutlineButton
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedExperience(null);
                    onOpen();
                  }}
                >
                  Add a New Professional experience
                </OutlineButton>
              ) : (
                <Box bg="white" p={4} w="100%">
                  <Flex
                    justifyContent={"space-between"}
                    alignItems={{ base: "start", md: "center" }}
                    gap={3}
                    direction={{ base: "column", md: "row" }}
                  >
                    <Flex
                      direction="column"
                      alignItems={"self-start"}
                      w={{ base: "100%", md: "50%" }}
                    >
                      <Text fontWeight="bold">
                        Start adding your professional experience
                      </Text>
                      <Text fontSize="sm" mt={0}>
                        Fill up the pop-up form with information about former
                        experiences or professional projects.
                      </Text>
                    </Flex>
                    <OutlineButton
                      leftIcon={<AddIcon />}
                      onClick={() => {
                        setSelectedExperience(null);
                        onOpen();
                      }}
                    >
                      Add a New Professional experience
                    </OutlineButton>
                  </Flex>
                </Box>
              )}
              {experiences && (
                <Accordion allowMultiple width="100%" bg="white">
                  {experiences.map((experience) => (
                    <AccordionItem key={experience.id}>
                      <h2>
                        <AccordionButton py={5}>
                          <Box as="span" flex="1" textAlign="left">
                            <Text as="b" fontSize="xl">
                              {experience.role}
                            </Text>
                            <Text fontSize="md">
                              <Text as="b">{experience.company}</Text>
                              {` | ${experience.industry} | ${experience.period} `}
                            </Text>
                          </Box>
                          <AccordionIcon boxSize={10} />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Flex flexDirection="column" alignItems="start" gap={4}>
                          {experience.use_case && (
                            <Flex alignItems="start" flexDirection="column">
                              <Text as={"b"} fontSize="xs" color="gray">
                                Use Case
                              </Text>
                              <Text fontSize="sm">{experience.use_case}</Text>
                            </Flex>
                          )}
                          <Flex alignItems="start" flexDirection="column">
                            <Text as={"b"} fontSize="xs" color="gray">
                              Responsibilities
                            </Text>
                            <VStack pl={3}>
                              <UnorderedList>
                                {experience.responsibilities.map(
                                  (responsability) => (
                                    <ListItem key={responsability} my={1}>
                                      {responsability}
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            </VStack>
                          </Flex>
                          <Flex alignItems="start" flexDirection="column">
                            <Text as={"b"} fontSize="xs" color="gray" mb={1}>
                              Technologies
                            </Text>
                            <Flex wrap="wrap" gap={2}>
                              {experience.technologies.map((technology) => (
                                <Badge
                                  key={technology}
                                  variant="outline"
                                  borderRadius={5}
                                  colorScheme="gray"
                                  px={3}
                                  py={2}
                                >
                                  {technology}
                                </Badge>
                              ))}
                            </Flex>
                          </Flex>
                          <Flex mt={6} gap={3}>
                            <PrimaryButton
                              type="submit"
                              leftIcon={<EditIcon />}
                              onClick={() => {
                                setSelectedExperience(experience);
                                onOpen();
                              }}
                            >
                              Edit
                            </PrimaryButton>
                            <OutlineButton
                              type="submit"
                              leftIcon={<DeleteIcon />}
                              isLoading={mutation.isLoading}
                              onClick={() => {
                                setSelectedExperienceDelete(experience.id);
                                onOpenConfirm();
                              }}
                            >
                              Delete
                            </OutlineButton>
                          </Flex>
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </>
          )}
        </>
      </VStack>
    </>
  );
};

export default ProfessionalExperience;
