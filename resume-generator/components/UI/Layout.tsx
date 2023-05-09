import { Flex, VStack } from "@chakra-ui/react";
import SimpleSidebar from "./Sidebar";
export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <SimpleSidebar>
      <Flex w="100%" px={3}>
        <Flex alignItems="center" justifyContent="center" h="100%" w="100%">
          <VStack
            maxWidth={{ base: "100%", lg: "950px" }}
            w="100%"
            h="100%"
          >
            {children}
          </VStack>
        </Flex>
      </Flex>
    </SimpleSidebar>
  );
}
