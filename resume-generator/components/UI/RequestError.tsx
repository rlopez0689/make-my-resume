import { Alert, AlertIcon } from "@chakra-ui/react";

const RequestError = ({
  error = "There was an error processing your request",
}) => (
  <Alert status="error">
    <AlertIcon />
    {error}
  </Alert>
);

export default RequestError;
