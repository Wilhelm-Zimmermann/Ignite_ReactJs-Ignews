import { render, screen } from "@testing-library/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { stripe } from "../../services/stripe";
import { mocked } from "ts-jest/utils";
import { getSession } from "next-auth/client";
import { getPrismicClient } from "../../services/prismic";


jest.mock("../../services/prismic");
jest.mock("next-auth/client");

const post = { slug: "my-new-post", title: "My Post", content: "I do not understand", updatedAt: "March 10" };


describe("Post page", () => {
    it("renders correctly", () => {
        render(<Post post={post} />)

        expect(screen.getByText("My Post")).toBeInTheDocument();
    });

    it("redirects user if is not subscribed", async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        });

        const response = await getServerSideProps({
            params: {
                slug: "my-new-post"
            }
        }as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: "/"
                })
            })
        );
    });

    it("loads initial data", async () => {
        const getSessionMocked = mocked(getSession);
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

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: "nonono-fakezao"
        });

        const response = await getServerSideProps({
            params:{
                slug: "my-new-post"
            }
        }as any);

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