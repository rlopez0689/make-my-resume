import BasicInformation from "@/components/BasicInformation";
import ProfessionalExperience from "@/components/ProfessionalExperience";
import LoaderSpinner from "@/components/UI/LoaderSpinner";
import PrimaryButton from "@/components/UI/PrimaryButton";
import RequestError from "@/components/UI/RequestError";
import { fetchEmployee, fetchResumeFile } from "@/requests/requests";
import { Candidate } from "@/shared/resumesTypes";
import { DownloadIcon } from "@chakra-ui/icons";
import { VStack, Text, Flex, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

const Resume = () => {
  const toast = useToast();
  const router = useRouter();
  const session = useSession();
  const { uid } = router.query;

  const {
    data: candidate,
    error,
    isFetching,
  } = useQuery<Candidate>(
    "GetCandidate",
    () => fetchEmployee(uid?.toString()),
    { enabled: !!uid && session.status !== "loading" }
  );

  const mutation = useMutation({
    mutationFn: async (uuid: string) => {
      try {
        const response = await fetchResumeFile(uuid)
        const fileBlob = new Blob([response.data]);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(fileBlob);
        link.download = "cv.pdf";
        link.click();
        link.remove();
      } catch (error) {
        toast({
          title: "Request Error, can't retrieve file at the moment",
          status: "error",
          position: "top-right",
          duration: 6000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <VStack w="100%" mb={4} alignItems="start">
      <Text my={5} fontSize="3xl">
        Resume Generator
      </Text>
      <>
        {isFetching && <LoaderSpinner />}
        {!isFetching && error && <RequestError />}
        {!isFetching && !error && candidate && (
          <>
            <BasicInformation
              candidateUUID={candidate.candidate_uuid}
              candidate={candidate}
            />
            <ProfessionalExperience candidateUUID={candidate.candidate_uuid} />
            <Flex justifyContent="flex-end" w="100%" py={7}>
              <PrimaryButton
                isLoading={mutation.isLoading}
                leftIcon={<DownloadIcon />}
                onClick={() => mutation.mutate(candidate.candidate_uuid)}
              >
                Download Resume
              </PrimaryButton>
            </Flex>
          </>
        )}
      </>
    </VStack>
  );
};

export default Resume;
