import CandidateTable from "@/components/CandidateTable";
import LoaderSpinner from "@/components/UI/LoaderSpinner";
import NewUserModal from "@/components/NewUserModal";
import RequestError from "@/components/UI/RequestError";
import {
  Stack,
  Input,
  HStack,
  Text,
  useDisclosure,
  VStack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useSession } from "next-auth/react";
import { fetchEmployees } from "@/requests/requests";
import { useQuery } from "react-query";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const session = useSession();

  const {
    isFetching,
    error,
    data: resumes,
  } = useQuery(
    ["GetResumes", debouncedSearchTerm],
    () => fetchEmployees(debouncedSearchTerm),
    {
      enabled: session.status !== "loading",
    }
  );

  return (
    <>
      <NewUserModal isOpen={isOpen} onClose={onClose} />
      <VStack w="100%" mb={4}>
        <Text my={5} alignSelf={"start"} fontSize="3xl">
          Resumes List
        </Text>
        <Stack mt={5} w="100%">
          <>
            <HStack justifyContent="space-between" mb={5}>
              <HStack w="40%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    // eslint-disable-next-line react/no-children-prop
                    children={<SearchIcon color="gray.300" />}
                  />
                  <Input
                    data-testid="search-input"
                    maxWidth="500px"
                    placeholder="Search by (name, email, role)"
                    bg="white"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </HStack>
              <PrimaryButton
                leftIcon={<AddIcon />}
                onClick={onOpen}
                bg="brand"
                data-testid="add-new-button"
              >
                Add New
              </PrimaryButton>
            </HStack>
            {isFetching && <LoaderSpinner />}
            {!isFetching && resumes && <CandidateTable resumes={resumes} />}
            {error && <RequestError />}
          </>
        </Stack>
      </VStack>
    </>
  );
};

export default Home;
