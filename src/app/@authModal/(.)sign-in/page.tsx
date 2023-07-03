
import CloseModal from '@/components/CloseModal'
import SignIn from '@/components/SignIn'
import { FC } from 'react'

const page: FC = () => {
    return (<div className='fixed inset-0 z-10'>
        <div className='container flex items-center h-full max-w-lg mx-auto'>
            <div className='relative w-full px-2 py-20 bg-black rounded-lg h-fit outline'>
                <div className='absolute top-4 right-4'>
                    <CloseModal />
                </div>

                <SignIn />
            </div>
        </div>
    </div>)
}

export default page