import { ResumeList } from "@/pages/api/resumes";
import { fetchResumeFile } from "@/requests/requests";
import {
  CheckIcon,
  DownloadIcon,
  EditIcon,
  LinkIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useMutation } from "react-query";

const CandidateTable = ({ resumes }: { resumes: ResumeList[] }) => {
  const toast = useToast();
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
    <TableContainer bg="white" borderRadius={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Last Updated</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {resumes.map((resume) => (
            <TableRow
              key={resume.id}
              resume={resume}
              onDownload={(uuid) => mutation.mutate(uuid)}
              isLoading={mutation.isLoading}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const TableRow = ({
  resume,
  onDownload,
  isLoading,
}: {
  resume: ResumeList;
  onDownload: (arg1: string) => void;
  isLoading: boolean;
}) => {
  const { onCopy, hasCopied } = useClipboard(
    `${location.origin}/${resume.candidate_uuid}/resume`
  );
  return (
    <Tr key={resume.id} role="group">
      <Td>{resume.name}</Td>
      <Td>{resume.email}</Td>
      <Td>{resume.role}</Td>
      <Td>{resume.last_edited}</Td>
      <Td>
        <HStack gap={3} _groupHover={{ opacity: 1 }} opacity={0}>
          <Link href={`app/${resume.candidate_uuid}/resume`}>
            <EditIcon />
          </Link>
          {!isLoading ? (
            <DownloadIcon
              cursor="pointer"
              onClick={() => onDownload(resume.candidate_uuid)}
            />
          ) : (
            <RepeatIcon />
          )}
          {hasCopied ? (
            <CheckIcon />
          ) : (
            <LinkIcon cursor="pointer" onClick={onCopy} />
          )}
        </HStack>
      </Td>
    </Tr>
  );
};

export default CandidateTable;
