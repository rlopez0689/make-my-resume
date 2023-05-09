import { Button, ButtonProps } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const OutlineButton = (props: Props & ButtonProps) => (
  <Button color="brand" borderColor="brand" variant="outline" {...props}>
    {props.children}
  </Button>
);
export default OutlineButton;
