import Link from 'next/link'
import { FC } from 'react'
import UserAuthForm from './UserAuthForm'

const SignIn: FC = () => {
    return <div className='container flex flex-col w-full mx-auto justify-center space-y-6 sm:w-[400px]'>
        <div className='flex flex-col space-y-2 text-center'>
            <div className='w-6 h-6 mx-auto'>Huddl</div>
            <h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
            <p className='max-w-xs mx-auto text-sm'>By continuing, you are setting up a Breadit account and agree to our
                User Agreement and Privacy Policy.</p>


            {/*Sign in form*/}
            <UserAuthForm />

            <p className='px-8 text-sm text-center'> Already a huddlr?{' '}
                <Link href='/sign-in'
                    className="text-sm underline hover:text-zinc-200 underline-offset-4 ">
                    Sign In
                </Link></p>
        </div>
    </div>
}

export default SignIn