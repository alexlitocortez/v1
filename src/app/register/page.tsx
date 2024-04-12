"use client"

import Link from "next/link"
import { RegisterForm } from "./form"

const Register = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="shadow-xl px-8 pb-8 pt-12 bg-white rounded-xl space-y-12">
                <h1 className="font-semibold text-2xl">Create your Account</h1>
                <RegisterForm />
                <p className="text-center">Have an account? <Link href="/login" className="text-indigo-500 hover:underline">Sign in</Link></p>
            </div>
        </div>
    )
}

export default Register