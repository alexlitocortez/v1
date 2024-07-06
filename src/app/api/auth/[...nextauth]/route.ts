import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt'
import { prisma } from "~/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters";

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: "Email", type: "email", placeholder: 'hello@example.com' },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.password) {
                    return null;
                }

                const hashedPassword: string = bcrypt.hashSync(credentials?.password, 10)
                const userCredentials = {
                    email: credentials?.email,
                    password: hashedPassword
                };

                const user = await prisma.user.findUnique({
                    where: {
                        email: userCredentials?.email
                    }
                })

                // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument
                if (!user || !(await bcrypt.compare(credentials?.password, userCredentials?.password))) {
                    return null
                }

                return {
                    id: user?.id,
                    email: user?.email
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? ""
        }),
    ],
    callbacks: {
        async jwt({ token, user, session, account }) {
            if (user) {
                return {
                    ...token,
                    email: user.email,
                }
            }
            return token
        },
        async session({ session, token, user }) {
            return session
        }
    },
    pages: {
        signIn: "/login",
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }

