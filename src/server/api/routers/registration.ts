import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { number, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const RegistrationInput = z.object({
    email: z.string().email(),
    password: z.string()
})

export const User = z.object({
    id: z.string(),
    email: z.string(),
    password: z.string()
})

export const registrationRouter = createTRPCRouter({
    create: publicProcedure
        .input(RegistrationInput)
        .mutation(({ input }) => {
            const hashedPassword = bcrypt.hashSync(input.password, 10)
            const newUser = prisma.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword
                }
            })
            return newUser
        }),
    getUser: publicProcedure.query(() => {
        return { id: 1, name: "k" }
    }),

    // procedure for retrieving all the posts and return all posts from the database
    getAll: publicProcedure
        .query(() => {
            // Return all posts from the database
            return 'yesyes'
        }),
})
