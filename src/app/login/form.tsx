"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Mutation, useMutation } from "@tanstack/react-query"
import { api } from "~/trpc/react"
import { signIn } from "next-auth/react"


export const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const userQuery = api.register.registerMessage.useMutation(Mutation.)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Login!")
    }


    return (
        <form onSubmit={onSubmit} className="space-y-12 w-[400px]">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" />
            </div>
            <div className="w-full">
                <Button className="w-full" onClick={() => signIn()}>Login</Button>
                <button className="w-full" onClick={() => signIn("google")}>Sign in with Google</button>
            </div>
        </form>
    )
}