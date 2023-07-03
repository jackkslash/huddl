'use client'
import { FC, startTransition } from 'react'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { subscribeToHuddlPayload } from '@/lib/validators/huddl'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
    isSubscribed: boolean
    huddlId: string
    huddlName: string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ isSubscribed, huddlId, huddlName }: SubscribeLeaveToggleProps) => {
    const { toast } = useToast()
    const router = useRouter()

    const { mutate: subscribe } = useMutation({
        mutationFn: async () => {
            const payload: subscribeToHuddlPayload = {
                huddlId,
            }

            const { data } = await axios.post('/api/huddl/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            return toast({
                title: 'There was a problem.',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
            toast({
                title: 'Subscribed!',
                description: `You are now subscribed to h/${huddlName}`,
            })
        },
    })

    const { mutate: unsubscribe } = useMutation({
        mutationFn: async () => {
            const payload: subscribeToHuddlPayload = {
                huddlId,
            }

            const { data } = await axios.post('/api/huddl/unsubscribe', payload)
            return data as string
        },
        onError: (err: AxiosError) => {
            toast({
                title: 'Error',
                description: err.response?.data as string,
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
            toast({
                title: 'Unsubscribed!',
                description: `You are now unsubscribed from h/${huddlName}`,
            })
        },
    })


    return isSubscribed ? (<Button className='w-full mt-1 mb-4' onClick={() => unsubscribe()}>Leave</Button>) : (<Button className='w-full mt-1 mb-4' onClick={() => subscribe()}>Join</Button>)
}

export default SubscribeLeaveToggle