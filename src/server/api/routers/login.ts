import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PrismaClient, Prisma } from "@prisma/client";
import { sign } from "crypto";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const LoginInput = z.object({
    email: z.string().email(),
    password: z.string()
})

const prisma = new PrismaClient()

export const loginRouter = createTRPCRouter({
    loginUser: publicProcedure
        .input(LoginInput)
        .query(async ({ input }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: input.email,
                },
            })
            if (!user || user.password !== input.password) {
                return new NextResponse('Missing Fields', { status: 400 })
            }
        })
})



