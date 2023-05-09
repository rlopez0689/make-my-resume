import LoginForm from "@/components/LoginForm";
import {
  Flex,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import RequestError from "@/components/UI/RequestError";
import { useRouter } from "next/router";

export type LoginProps = {
  email: string;
  password: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const onSubmit = async (user: LoginProps) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });
      if (res && !res.ok) {
        if (res.error == "Error: Invalid Credentials")
          setError("The email or password you entered is incorrect");
        else setError("There was an error processing your request");
      } else {
        setError("");
        router.push("/app");
      }
    } catch (error) {
      setError("There was an error processing your request");
    }
    setIsLoading(false);
  };

  return (
    <Flex minH="600px" w="100%">
      <HStack
        w="50%"
        h="100%"
        backgroundColor="purpleBack"
        justifyContent="center"
        alignItems="center"
        display={{ base: "none", md: "flex" }}
        p={2}
      >
        <Image src="/login-image.png" alt="Login Image" />
      </HStack>
      <VStack
        w={{ base: "100%", md: "50%" }}
        h="100%"
        backgroundColor="white"
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <VStack
          flexDirection="column"
          gap={6}
          alignItems="flex-start"
          w="100%"
          maxW="550px"
          p={5}
        >
          <VStack alignItems="flex-start" gap={6} w="100%">
            <VStack alignItems="flex-start">
              <Heading>Resume Generator</Heading>
              <Heading size="md" fontWeight="300">
                Log in to continue
              </Heading>
            </VStack>
            <Flex mt={5} w="100%" flexDirection="column" alignItems="center">
              {error && (
                <Box mb={5} w="100%">
                  <RequestError error={error} />
                </Box>
              )}
              <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
              <Link href="/login">
                <Heading size="sm" fontWeight="500" color="brand" mt={3}>
                  Forgot password?
                </Heading>
              </Link>
            </Flex>
            <Flex alignItems="flex-start" flexDirection="column">
              <Heading size="xs" fontWeight="bold">
                Need assistance?
              </Heading>
              <Heading size="xs" fontWeight="300">
                Please contact our{" "}
                <Link href="/login">
                  <Text as="span" color="brand" fontWeight="500">
                    Help Desk
                  </Text>
                </Link>
              </Heading>
            </Flex>
          </VStack>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Login;
