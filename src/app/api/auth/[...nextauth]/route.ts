import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';
import { prisma } from "~/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";

interface Credentials {
    email: string;
    password: string;
}

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: "Email", type: "email", placeholder: 'hello@example.com' },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Credentials | undefined) {
                if (!credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !bcrypt.compareSync(credentials.password, user.password ?? "")) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    email: user.email,
                };
            }
            return token;
        },
        async session({ session }) {
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

// const handler = async (req: NextRequest, res: NextResponse) => {
//     const nextAuthHandler = NextAuth(authOptions);
//     return await nextAuthHandler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
// };

// export { handler as GET, handler as POST };
