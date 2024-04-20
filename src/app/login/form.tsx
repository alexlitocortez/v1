"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Mutation, useMutation, useQuery } from "@tanstack/react-query"
import { api } from "~/trpc/react"
import { signIn } from "next-auth/react"


export const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const formData = {
        email: email,
        password: password
    }
    // const loginUser = api.login.loginUser.useQuery({ email, password })

    // FIGURE OUT HOW TO VALIDATE USER LOGIN

    // const onSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     try {
    //         loginUser.data()
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }


    return (
        <form className="space-y-12 w-[400px]">
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