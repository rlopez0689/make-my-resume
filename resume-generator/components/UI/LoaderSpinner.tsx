import { HStack, Spinner } from "@chakra-ui/react";

const LoaderSpinner = () => {
  return (
    <HStack justifyContent="center" py={5}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand"
        size="xl"
      />
    </HStack>
  );
};

export default LoaderSpinner;
