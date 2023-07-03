
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Huddl',
}

const Layout = async ({
    children,
    params: { slug },
}: {
    children: ReactNode
    params: { slug: string }
}) => {
    const session = await getAuthSession()

    const huddl = await db.huddl.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    })

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
            where: {
                huddl: {
                    name: slug,
                },
                user: {
                    id: session.user.id,
                },
            },
        })

    const isSubscribed = !!subscription

    if (!huddl) return notFound()

    const memberCount = await db.subscription.count({
        where: {
            huddl: {
                name: slug,
            },
        },
    })
    return (
        <div className='h-full pt-12 mx-auto sm:container max-w-7xl'>
            <div>

                <div className='grid grid-cols-1 py-6 md:grid-cols-3 gap-y-4 md:gap-x-4'>
                    <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>

                    {/* info sidebar */}
                    <div className='order-first overflow-hidden border border-gray-200 rounded-lg h-fit md:order-last'>
                        <div className='px-6 py-4'>
                            <p className='py-3 font-semibold'>About h/{huddl.name}</p>
                        </div>
                        <dl className='px-6 py-4 text-sm leading-6 bg-white divide-y divide-gray-100'>
                            <div className='flex justify-between py-3 gap-x-4'>
                                <dt className='text-gray-500'>Created</dt>
                                <dd className='text-gray-700'>
                                    <time dateTime={huddl.createdAt.toDateString()}>
                                        {format(huddl.createdAt, 'MMMM d, yyyy')}
                                    </time>
                                </dd>
                            </div>
                            <div className='flex justify-between py-3 gap-x-4'>
                                <dt className='text-gray-500'>Members</dt>
                                <dd className='flex items-start gap-x-2'>
                                    <div className='text-gray-900'>{memberCount}</div>
                                </dd>
                            </div>
                            {huddl.creatorId === session?.user?.id ? (
                                <div className='flex justify-between py-3 gap-x-4'>
                                    <dt className='text-gray-500'>You created this community</dt>
                                </div>
                            ) : null}

                            {huddl.creatorId !== session?.user?.id ? (
                                <SubscribeLeaveToggle isSubscribed={isSubscribed} huddlId={huddl.id} huddlName={huddl.name} />
                            ) : null}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
