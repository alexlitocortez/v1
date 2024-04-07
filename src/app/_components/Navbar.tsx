"use client"

import { buttonVariants } from "~/components/ui/button"
import MaxWidthWrapper from "./MaxWidthWrapper"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

const ACTIVE_ROUTE = "py-1 px-2 text-gray-300 bg-gray-700"
const INACTIVE_ROUTE = "py-1 px-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700"

function AuthButton() {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
                {session?.user?.name} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )

}


const Navbar = () => {
    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href='/' className='flex z-40 font-semibold'>
                        <span>V1</span>
                    </Link>
                    {/* todo: add mobile navbar */}
                    <div>
                        <>
                            <AuthButton />
                            {/* <Link href='/pricing' className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            })}>Pricing</Link>
                            <LoginLink className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm'
                            })}>Sign in</LoginLink>
                            <RegisterLink
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm'
                                })}
                            >
                                Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                            </RegisterLink> */}
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar