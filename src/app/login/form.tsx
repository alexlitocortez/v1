"use client";

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { signIn } from "next-auth/react"
import GoogleIcon from '@mui/icons-material/Google';

export const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            // callbackUrl: `${process.env.NEXTAUTH_URL}`,
            redirect: false
        })

        if (res?.ok) {
            console.log("it works")
        } else {
            console.log("Failed", res)
        }
        return res;
    }

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-12 w-[400px]"
        >
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" />
            </div>
            <div className="w-full">
                <Button className="w-full" >Login</Button>
                <button className="w-full mt-3 outline rounded-sm p-2" onClick={() => signIn("google")}><GoogleIcon className="mr-1" />Sign in with Google</button>
            </div>
        </form>
    )
}