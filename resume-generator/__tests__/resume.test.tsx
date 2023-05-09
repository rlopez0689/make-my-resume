import { render, screen, waitFor } from "@testing-library/react";
import { Wrapper } from "@/jest/Wrapper";

import Resume from "@/pages/app/[uid]/resume";
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
      return {data: mockSession, status: 'authenticated'} 
    }),
  };
});

const CANDIDATE_MOCK_DATA = {
    id: 323,
    altid: "32ds",
    name: "test",
    role: "test",
    candidate_uuid: "323",
  }
const CANDIDATE_INFO_MOCK_DATA = {
    id: 323,
    candidate: 3,
    preferred_name: "Test Name",
    profile: "This is a test profile",
    role: "Test Role",
    last_edited: "12/12/2023",
    skills: ["Java", "Python"],
    certifications: ["Java 11"],
}
const CANDIDATE_EXPERIENCE_MOCK_DATA = [{
    id: 3,
    role: "Test Developer",
    company: "Test Company",
    period: "2012-2020",
    industry: "Healthcare",
    use_case: "lorem ipsum",
    responsibilities: ["Testing", "Management"],
    technologies: ["Java", "Python"],
  }]

describe("Resume", () => {
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
    mock.onGet("/api/candidate/323").reply(200, CANDIDATE_MOCK_DATA);

    render(
      <Wrapper>
        <Resume />
      </Wrapper>
    );
    await waitFor(() => {
      expect(screen.getByText("Resume Generator")).toBeInTheDocument();
    });
  });
  it("renders the basic information correctly", async () => {
    const router = { query: { uid: "323" } };
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockReturnValue(router);

    mock.onGet("/api/candidate/323").reply(200, CANDIDATE_MOCK_DATA);
    mock.onGet("/api/candidate-info/323").reply(200, CANDIDATE_INFO_MOCK_DATA);

    render(
      <Wrapper>
        <Resume />
      </Wrapper>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Name")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("This is a test profile")
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Role")).toBeInTheDocument();
      expect(screen.getByText("Java")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Java 11")).toBeInTheDocument();
    });
  });
  it("renders the professional experience correctly", async () => {
    const router = { query: { uid: "323" } };
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockReturnValue(router);

    mock.onGet("/api/candidate/323").reply(200, CANDIDATE_MOCK_DATA);
    mock.onGet("/api/candidate-info/323").reply(200, CANDIDATE_INFO_MOCK_DATA);
    mock.onGet("/api/candidate-professional-experience/323").reply(200, CANDIDATE_EXPERIENCE_MOCK_DATA);

    render(
      <Wrapper>
        <Resume />
      </Wrapper>
    );
    await waitFor(() => {
      expect(screen.getByText("Test Developer")).toBeInTheDocument();
      expect(screen.getByText("Test Company")).toBeInTheDocument();
      expect(screen.getByText("| Healthcare | 2012-2020")).toBeInTheDocument();
    });
  });
});
