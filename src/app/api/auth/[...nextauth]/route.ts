import NextAuth, { Awaitable, RequestInternal, User } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

// interface GoogleProfile extends Record<string, any> {
//     email: string,
//     email_verified: boolean
// }

// export default function Google<P extends GoogleProfile>(
//     options: OAuthUserConfig<P>
// ): OAuthConfig<P> {
//     return {
//         profile(profile) {
//             return {
//                 email: profile.email
//             }
//         }
//     }
// }



export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? ""
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                return profile.email_verified && profile.email.endsWith("@example.com")
            }
            return true
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }