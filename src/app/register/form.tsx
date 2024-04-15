"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Mutation, Query, useMutation, useQuery } from "@tanstack/react-query"
import { api } from "~/trpc/react"
import { useRouter } from "next/router"


export const RegisterForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    // const registered = api.register.create.useMutation()
    // const { query } = useRouter()


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // const res = await fetch('/api/trpc', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         email,
            //         password
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            // if (res.ok) {
            // }
        } catch (error) {
            console.error(error)
        }

        console.log('email', formData.email)
        console.log('password', formData.password)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }



    return (
        <form className="space-y-12 w-[400px]">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input value={formData.email} onChange={handleChange} id="email" type="email" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input value={formData.password} onChange={handleChange} id="password" type="password" />
            </div>
            <div className="w-full">
                <Button className="w-full">Register</Button>
            </div>
        </form>
    )
}