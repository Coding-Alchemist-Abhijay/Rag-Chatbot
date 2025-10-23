import {SignUpButton} from '@clerk/nextjs';
import '@/app/globals.css'

export default function SignIn() {
    return (
        <>
            <SignUpButton >
            <span className="h-10 inline-block px-4 py-2 my-1 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors duration-200 cursor-pointer">
                Sign In
            </span>
            </SignUpButton>
        </>
    )
}