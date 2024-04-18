import { encode, decode } from "next-auth/jwt"
import { JWT } from "next-auth/jwt"
import { User } from "@prisma/client"
import { getToken } from "next-auth/jwt"

export type AuthUser = Omit<User, "Password">

export const tokenOneDay = 24 * 60 * 60
export const tokenOnWeek = tokenOneDay * 7

const secret = process.env.NEXTAUTH_SECRET

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: { end: () => void }) {
    // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
    // const token = await getToken({ req })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = await getToken({ req, secret })
    console.log("JSON Web Token", token)
    res.end()
}

// const createJWT = (authUser: AuthUser, duration: number) => {
//     const secret = process.env.JWT_SECRET
//     if (!secret) {
//         throw new Error("JWT_SECRET is not defined in environment variables.")
//     }

//     const jwtPayload: JWT = {
//         user: authUser as User,
//         accessToken: "", // Fill these values accordingly
//         refreshToken: "",
//         accessTokenExpired: 0,
//         refreshTokenExpired: 0
//     }
//     return encode({ token: jwtPayload, secret, maxAge: duration })
// }

// export const jwtHelper = {
//     createAcessToken: (token: AuthUser) => createJWT(token, tokenOneDay),
//     createRefreshToken: (token: AuthUser) => createJWT(token, tokenOnWeek),
//     verifyToken: (token: string) => {
//         const secret = process.env.JWT_SECRET
//         if (!secret) {
//             throw new Error("JWT_SECRET is not defined in environment variables.")
//         }
//         return decode({ token, secret })
//     }
// }

