import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { signIn, useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import { useRouter } from "next/router";

jest.mock("next-auth/client");

jest.mock("next/router");

describe("Subscribe Button component", () => {
    it("renders correctly", () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />);

        expect(screen.getByText("Subscribe now")).toBeInTheDocument();
    });

    it("redirects user to sign in when not authenticated", () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);
        const signInMocked = mocked(signIn);
        render(<SubscribeButton />)

        const subscribeButton = screen.getByText("Subscribe now");

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    })

    it("redirects user to post when user has a subscription", () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: "John Doe", 
                    email: "john.doe@example.com"
                },
                 expires: "genkai wo koeru",
                 activeSubscription: "keke genkai"
                },
            false
        ])

        const pushMock = jest.fn();

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        }as any);

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText("Subscribe now");

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalled();
    })
})