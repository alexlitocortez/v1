import NextAuth, { Awaitable, RequestInternal, User, type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import bcrypt, { compare } from 'bcrypt'
import { PrismaClient } from "@prisma/client";
import { prisma } from "~/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: "Email", type: "email", placeholder: 'hello@example.com' },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password ?? ''
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name ?? '',
                    randomKey: 'Hey cool'
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? ""
        }),
    ],
    // callbacks: {

    // },
    pages: {
        signIn: "/login",
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }