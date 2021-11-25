import { render, screen } from "@testing-library/react";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { stripe } from "../../services/stripe";
import { mocked } from "ts-jest/utils";
import { getSession, useSession } from "next-auth/client";
import { getPrismicClient } from "../../services/prismic";
import { useRouter } from "next/router";


jest.mock("../../services/prismic");
jest.mock("next-auth/client");
jest.mock("next/router");

const post = { slug: "my-new-post", title: "My Post", content: "I do not understand", updatedAt: "March 10" };


describe("Post Preview page", () => {
    it("renders correctly", () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<Post post={post} />)

        expect(screen.getByText("My Post")).toBeInTheDocument();
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    });

    it("redirects user to full post page when subscribed", async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: "fakezao" },
            false
        ] as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        }as any);

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");

    });

    it("loads initial data", async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: "heading", text: "My new post" }
                    ],
                    content: [
                        { type: "paragraph", text: "hope you like beeeeeeeeeesss" }
                    ],
                },
                last_publication_date: "05-01-2021"
            } as any)
        } as any);

        const response = await getStaticProps({ params: { slug: "my-new-post" }});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: "my-new-post",
                        title: "My new post",
                        content: "<p>hope you like beeeeeeeeeesss</p>",
                        updatedAt: "01 de maio de 2021"
                    }
                }
            })
        )
    });
});