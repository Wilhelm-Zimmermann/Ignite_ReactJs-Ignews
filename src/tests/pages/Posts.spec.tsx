import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { stripe } from "../../services/stripe";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";


jest.mock("../../services/prismic");

const posts = [
    { slug: "my-new-post", title: "My Post", excerpt: "I do not understand", updatedAt: "March 10" },
]

describe("Home page", () => {
    it("renders correctly", () => {
        render(
            <Posts posts={posts} />
        );

        expect(screen.getByText("My Post")).toBeInTheDocument();
    });

    it("loads initial data", async () => {
        const getPrismicMocked = mocked(getPrismicClient);

        getPrismicMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: "my-new-post",
                        data: {
                            title: [
                                { type: "heading", text: "My new post" }
                            ],
                            content: [
                                { type: "paragraph", text: "hope you like beeeeeeeeeesss" }
                            ],
                        },
                        last_publication_date: "04-01-2021"
                    }
                ]
            })
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [
                        {
                            slug: "my-new-post",
                            title: "My new post",
                            excerpt: "hope you like beeeeeeeeeesss",
                            updatedAt: "01 de abril de 2021"
                        }
                    ]
                }
            })
        )
    });
});