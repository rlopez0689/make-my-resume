import Layout from "../components/UI/Layout";
import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import { signOut } from "next-auth/react";
import Router from 'next/router'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error.message === "Authentication Error") {
        signOut({ redirect: false })
        Router.push("/auth/login")
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      if (error.message === "Authentication Error") {
        signOut({ redirect: false })
        Router.push("/auth/login")
      }
    },
  })
});

const theme = extendTheme({
  colors: {
    brand: "#1DB954",
    purpleBack: "#E6EAFE",
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}: AppProps) {
  let componentLayout = (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
  if ([`/auth/login`].includes(appProps.router.pathname))
    componentLayout = <Component {...pageProps} />;
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <SessionProvider session={session}>{componentLayout}</SessionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
