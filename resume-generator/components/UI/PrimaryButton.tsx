import { Button, ButtonProps } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const PrimaryButton = (props: Props & ButtonProps) => (
  <Button color="white" bg="brand" _hover={{ bg: "brand" }} {...props}>
    {props.children}
  </Button>
);
export default PrimaryButton;
