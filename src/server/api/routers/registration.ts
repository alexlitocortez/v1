import { number, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const RegistrationInput = z.object({
    email: z.string().email(),
    password: z.string()
})

const database = {
    posts: []
}

// procedure for handling user registration

export const registrationRouter = createTRPCRouter({
    // create: publicProcedure
    //     .input(RegistrationInput)
    //     .mutation(({ input }) => {
    //         const newPost = {
    //             id: database.posts.length + 1,
    //             ...input 
    //         };
    //         return newPost
    //     }),


    // procedure for retrieving all the posts and return all posts from the database
    // getAll: publicProcedure
    //     .query(() => {
    //         // Return all posts from the database
    //         return database.posts
    //     }),

    // procedure for retrieving a post by ID
    // getById: publicProcedure
    //     .input(z.string())
    //     .query(({ input }) => {
    //         return database.posts.find(post => post.id === parseInt(input, 10));
    //     })
})
