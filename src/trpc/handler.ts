// handlers.ts

import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { inferAsyncReturnType } from "trpc/server";
import { Context } from "./context";
import { RegistrationInput } from "~/server/api/routers/registration";

const prisma = new PrismaClient();

export const registerUser = async (input: z.infer<typeof RegistrationInput>, ctx: Context) => {
    // Perform input validation if necessary

    // Create user in the database
    const user = await prisma.user.create({
        data: {
            email: input.email,
            password: input.password, // You should hash the password before storing it
        },
    });

    return user;
};

export type RegisterUserFn = inferAsyncReturnType<typeof registerUser>;
