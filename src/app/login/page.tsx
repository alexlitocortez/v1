"use client"

import Link from "next/link"
import { LoginForm } from "./form"

const Login = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="shadow-xl px-8 pb-8 pt-12 bg-white rounded-xl space-y-12">
                <h1 className="font-semibold text-2xl">Login</h1>
                <LoginForm />
                <p className="text-center">Need to create an account? <Link href="/register" className="text-indigo-500 hover:underline">Create Account</Link></p>
            </div>
        </div>
    )
}

export default Login