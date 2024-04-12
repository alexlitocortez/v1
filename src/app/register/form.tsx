"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Mutation, Query, useMutation, useQuery } from "@tanstack/react-query"
import { api } from "~/trpc/react"
import { useRouter } from "next/router"


export const RegisterForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const userQuery = api.register.registerMessage.useMutation(Mutation.)
    // const { query } = useRouter()
    const hello = api.example.hello.useQuery({ text: "from tRPC" })

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (res.ok) {
                // redirect
            }
        } catch (error) {
            console.error(error)
        }

        console.log('email', email)
        console.log('password', password)
    }

    const handleRegistration = () => {
        return hello
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
                <Button className="w-full" onClick={handleRegistration}>Register</Button>
            </div>
        </form>
    )
}