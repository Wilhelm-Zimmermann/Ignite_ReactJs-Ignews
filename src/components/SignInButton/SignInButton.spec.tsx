import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";

jest.mock("next-auth/client");

describe("Sign In component", () => {
    it("renders correct when user is not authenticated", () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <SignInButton />
        )

        expect(screen.getByText("Sign in with github")).toBeInTheDocument();
    });

    it("renders correct when user is authenticated", () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([
            {user: {name: "John Doe", email: "john.doe@example.com"}, expires: "genkai wo koeru"}, 
            false]);
        
        render(
            <SignInButton />
        )

        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
})