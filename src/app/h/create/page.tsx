'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Page = () => {
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    return (
        <div className='container flex items-center h-full max-w-3xl mx-auto'>
            <div className='relative w-full p-4 space-y-6 rounded-lg h-fit'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl font-semibold'>Create a Community</h1>
                </div>
                <hr className='h-px bg-red-500 ' />
                <div>
                    <p className='text-lg font-medium'>Name</p>
                    <p className='pb-2 text-xs'>
                        Community names including capitalization cannot be changed.
                    </p>
                    <div className='relative'>
                        <p className='absolute inset-y-0 left-0 grid w-8 text-sm place-items-center text-zinc-400'>
                            h/
                        </p>
                        <Input value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='pl-6' />
                    </div>
                </div>
                <div className='flex justify-end gap-4'>
                    <Button
                        variant='subtle'
                        onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button>
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Page