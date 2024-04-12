import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const RegistrationInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

// export const registrationRouter = createTRPCRouter({
//     registerMessage: publicProcedure.mutation(async (opts) => {
//         return {
//             user: {
//                 message: 'hi'
//             }
//         }
//     })
// })

// export const exampleRouter = createTRPCRouter({
//     hello: publicProcedure
//         .input(z.object({ text: z.string() }))
//         .query(({ input }) => {
//             return {
//                 greeting: `Hello ${input.text}`
//             }
//         })
// })

