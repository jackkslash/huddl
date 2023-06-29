'use client'
import { FC } from 'react'
import { Button } from './ui/button'
import React from 'react';
import { signIn } from 'next-auth/react'
import { Icons } from './Icons';
import { useToast } from '../hooks/use-toast';

const UserAuthForm: FC = () => {

    const { toast } = useToast()

    const loginWithGoogle = async () => {
        try {
            await signIn('google')
        } catch (error) {
            toast({
                title: 'There was a problem',
                description: 'There was an error',
                variant: 'destructive'
            })
        }
    }
    return (
        <div className='flex justify-center'>
            <Button onClick={loginWithGoogle}><Icons.google className='w-4 h-4 mr-2' />Google</Button>
        </div>)
}

export default UserAuthForm