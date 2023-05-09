import { ReactNode } from "react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {},
});

export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
        <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};
