import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

const Page = () => {
    const user = getKindeServerSession()?.getUser?.()

    if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

    return <div>hello</div>
}

export default Page

