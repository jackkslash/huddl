import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { getAuthSession } from '@/lib/auth'
import UserAccountNav from './UserAccountNav';


const Navbar = async () => {

    const session = await getAuthSession();
    console.log(session)

    return (
        <div className='fixed top-0 inset-x-0 h-fit border-b border-slate-100 z-[10] py-2 bg-black'>
            <div className='container flex items-center justify-between h-full gap-2 mx-auto max-w-7xl'>
                {/* logo */}
                <Link href='/' className='flex items-center gap-2'>
                    <p className='text-sm font-medium text-slate-100'>Huddl</p>
                </Link>

                {session ?
                    (<UserAccountNav user={session.user} />)
                    :
                    (<Link href='/sign-in' className={buttonVariants()}>
                        Sign In
                    </Link>)}


            </div>
        </div>
    )
}

export default Navbar
