import { LoginProps } from "@/pages/auth/login";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "./UI/PrimaryButton";

function LoginForm({
  onSubmit,
  isLoading = false,
}: {
  onSubmit: (data: LoginProps) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack gap={3}>
        <FormControl isInvalid={errors.email ? true : false} isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            data-testid="email"
            {...register("email", {
              required: "This is required",
              maxLength: 50,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password ? true : false} isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            data-testid="password"
            {...register("password", {
              required: "This is required",
              maxLength: 50,
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <PrimaryButton data-testid="login-button" type="submit" isLoading={isLoading} mt={4} w="100%">
          Log In
        </PrimaryButton>
      </VStack>
    </form >
  );
}

export default LoginForm;
