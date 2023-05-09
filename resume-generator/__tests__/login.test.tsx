import { render, screen, waitFor } from "@testing-library/react";
import { Wrapper } from "@/jest/Wrapper";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { useSession } from "next-auth/react";
import Login from "@/pages/auth/login";
import LoginForm from "@/components/LoginForm";

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual('next-auth/react');
    const mockSession = {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { username: "admin" },
    };
    return {
        __esModule: true,
        ...originalModule,
        useSession: jest.fn(() => {
            return { data: mockSession, status: 'authenticated' }
        }),
    };
});

describe("Login", () => {
    let mock: MockAdapter;
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });
    afterEach(() => {
        mock.reset();
    });
    beforeEach(() => {
        const mockSession = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { username: "admin" },
            status: 'authenticated'
        };
        (useSession as jest.Mock).mockReturnValueOnce([mockSession, 'authenticated']);
    });
    it("renders the heading page correctly", async () => {
        const router = { query: { uuid: "323" } };
        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        useRouter.mockReturnValue(router);
        render(
            <Wrapper>
                <Login />
            </Wrapper>
        );
        await waitFor(() => {
            expect(screen.getByText("Resume Generator")).toBeInTheDocument();
            expect(screen.getByText("Log in to continue")).toBeInTheDocument();
        });
    });
    it("logins successfully", async () => {
        const onSubmit = jest.fn()
        const router = { query: { uuid: "323" } };
        const useRouter = jest.spyOn(require("next/router"), "useRouter");
        useRouter.mockReturnValue(router);

        render(
            <Wrapper>
                <LoginForm onSubmit={onSubmit} isLoading={false} />
            </Wrapper>
        );

        const inputPassEl = screen.getByTestId("password");
        const inputEmailEl = screen.getByTestId("email");
        const emailValue = "test@test.com"
        const passValue = "test1234"


        await userEvent.type(inputEmailEl, emailValue);
        await userEvent.type(inputPassEl, passValue);


        await waitFor(() => {
            expect(inputEmailEl).toHaveValue(emailValue)
            expect(inputPassEl).toHaveValue(passValue)
        });

        await waitFor(() => {
            userEvent.click(screen.getByTestId("login-button"))
        });

        await waitFor(() => {
            expect(onSubmit).toBeCalledTimes(1)
        });
    });
});

