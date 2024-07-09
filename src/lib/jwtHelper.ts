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



