import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/pages/app/index";
import { Wrapper } from "@/jest/Wrapper";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { useSession } from "next-auth/react";

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

describe("Home", () => {
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
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );
    await waitFor(() => {
      expect(screen.getByText("Resumes List")).toBeInTheDocument();
    });
  });
  it("queries the resumes api", async () => {
    mock.onGet("/api/resumes").reply(200, []);
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1)
    });
  });
  it("displays error when api request failed", async () => {
    mock.onGet("/api/resumes").networkError()
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText("There was an error processing your request")
      ).toBeInTheDocument();
    });
  });
  it("displays the api info in the table", async () => {
    const apiResponse = [
      {
        id: 1,
        name: "John Doe",
        email: "john@test.com",
        role: "test",
        candidate_uuid: "1234",
        last_edited: "01/02/2023",
      },
    ]
    mock.onGet("/api/resumes").reply(200, apiResponse)

    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@test.com")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("01/02/2023")).toBeInTheDocument();
    });
  });

  it("triggers the search when typing in search field", async () => {
    const searchTerm = "test@mail.com";

    mock.onGet("/api/resumes").reply(200, [])
    mock.onGet(`/api/resumes?search=${searchTerm}`).reply(200, [])
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );


    await waitFor(() => {
      const inputEl = screen.getByTestId("search-input");
      userEvent.type(inputEl, searchTerm);
    });

    await waitFor(() => {
      expect(mock.history.get.length).toBe(2)
    });
  });
  it("adds a new record when adding in modal", async () => {
    mock.onGet("/api/resumes").reply(200, [])
    mock.onPost("/api/resumes").reply(200, [])
    render(
      <Wrapper>
        <Home />
      </Wrapper>
    );

    await waitFor(() => {
      userEvent.click(screen.getByTestId("add-new-button"));
    });

    await waitFor(() => {
      expect(screen.getByText("Add New resume")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Include the employee or candidate information to create a new entry"
        )
      ).toBeInTheDocument();
    });

    const emailInput = screen.getByTestId("email");
    const emailValue = "email@email.com";
    await waitFor(() => {
      userEvent.type(emailInput, emailValue);
    });

    await waitFor(() => expect(emailInput).toHaveValue(emailValue));

    await waitFor(() => {
      userEvent.click(screen.getByTestId("submit-add-new-button"));
    });

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1)
      expect(mock.history.get.length).toBe(2)
    });
  });
});
