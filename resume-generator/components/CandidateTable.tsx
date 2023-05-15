import { ResumeList } from "@/pages/api/resumes";
import {
  CheckIcon,
  DownloadIcon,
  EditIcon,
  LinkIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  HStack,
  Td,
  Tr,
  useClipboard,
} from "@chakra-ui/react";
import Link from "next/link";
import { useMutation } from "react-query";
import { Table } from "@/components/UI/Table"
import useFetchResume from "@/hooks/useFetchResume";

const CandidateTable = ({ resumes }: { resumes: ResumeList[] }) => {
  const headers = ['Name', 'Email', 'Role', 'Last Updated', '']
  const fetchResume = useFetchResume()
  const mutation = useMutation({
    mutationFn: async (uuid: string) => fetchResume(uuid),
  });
  return (
    <Table headers={headers}>
      {resumes.map((resume) => (
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
              {!mutation.isLoading ? (
                <DownloadIcon
                  cursor="pointer"
                  onClick={() => mutation.mutate(resume.candidate_uuid)}
                />
              ) : (
                <RepeatIcon />
              )}
              <CopyResume id={resume.candidate_uuid} />
            </HStack>
          </Td>
        </Tr>
      ))}
    </Table>
  );
};

const CopyResume = ({ id }: { id: string }) => {
  const { onCopy, hasCopied } = useClipboard(
    `${location.origin}/app/${id}/resume`
  );
  return (
    hasCopied ? (
      <CheckIcon />
    ) : (
      <LinkIcon cursor="pointer" onClick={onCopy} />
    )
  )
}

export default CandidateTable;
