import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/button'


const Navbar = async () => {

    return (
        <div className='fixed top-0 inset-x-0 h-fit border-b border-slate-100 z-[10] py-2'>
            <div className='container flex items-center justify-between h-full gap-2 mx-auto max-w-7xl'>
                {/* logo */}
                <Link href='/' className='flex items-center gap-2'>
                    <p className='hidden text-sm font-medium text-slate-100 md:block'>Huddl</p>
                </Link>
                <Link href='/sign-in' className={buttonVariants()}>
                    Sign In
                </Link>

            </div>
        </div>
    )
}

export default Navbar
