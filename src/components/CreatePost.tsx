'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image as ImageIcon, Link2 } from 'lucide-react'
import { FC } from 'react'
import UserAvatar from './UserAvatar'
import type { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'

interface CreatePostProps {
    session: Session | null
}

const CreatePost: FC<CreatePostProps> = ({ session }) => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <li className='overflow-hidden rounded-md shadow'>
            <div className='flex justify-between h-full gap-6 px-6 py-4'>
                <div className='relative'>
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null,
                        }}
                    />

                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full outline outline-2 outline-white' />
                </div>
                <Input
                    onClick={() => router.push(pathname + '/submit')}
                    readOnly
                    placeholder='Create post'
                />
                <Button
                    className='rounded'
                    onClick={() => router.push(pathname + '/submit')}>
                    <Link2 className='text-white' />
                </Button>
            </div>
        </li>
    )
}

export default CreatePost