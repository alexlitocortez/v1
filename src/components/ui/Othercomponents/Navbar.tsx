"use client";

import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

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
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b dark:bg-customDark bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b">
                    <Link href='/' className='flex z-40 font-semibold'>
                        <span>V1</span>
                    </Link>
                    <Link href='/pricing' className='flex z-40 font-semibold'>
                        <span>Pricing</span>
                    </Link>
                    {/* todo: add mobile navbar */}
                    <div>
                        <>
                            <AuthButton />
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar