import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

import React from 'react'
import { api } from "~/trpc/react"

export default async function page() {
    return (
        <div>Hello</div>
    )
}


