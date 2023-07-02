'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { createHuddlPayload } from '@/lib/validators/huddl'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Page = () => {
    const [input, setInput] = useState<string>('')
    const router = useRouter()

    const { mutate: createHuddl, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: createHuddlPayload = {
                name: input,
            }

            const { data } = await axios.post('/api/huddl', payload)
            console.log(data)
            return data as string

        },
        onError: (err: any) => {
            if (err.response?.status === 409) {
                return toast({
                    title: 'Huddl already exists.',
                    description: 'Please choose a different name.',
                    variant: 'destructive',
                })
            }
            if (err.response?.status === 422) {
                return toast({
                    title: 'Invalid huddl name.',
                    description: 'Please choose a name between 3 and 21 letters.',
                    variant: 'destructive',
                })
            }

            toast({
                title: 'There was an error.',
                description: 'Could not create huddl.',
                variant: 'destructive',
            })
        },
        onSuccess: (data) => {
            router.push(`/h/${data}`)
        },
    })


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
                        isLoading={isLoading}
                        variant='subtle'
                        onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        isLoading={isLoading}
                        onClick={() => createHuddl()}>
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Page