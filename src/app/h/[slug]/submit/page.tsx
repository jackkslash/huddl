import Editor from '@/components/Editor'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
    params: {
        slug: string
    }
}


const page = async ({ params }: pageProps) => {

    const huddl = await db.huddl.findFirst({
        where: {
            name: params.slug
        }
    })

    if (!huddl) return notFound();

    return (
        <div className='flex flex-col items-start gap-6'>
            <div className='pb-5 border-b border-gray-200'>
                <div className='flex flex-wrap items-baseline -mt-2 -ml-2'>
                    <h1 className='mt-2 ml-2 text-base font-semibold leading-6'>
                        Create post
                    </h1>
                    <p className='mt-1 ml-2 text-sm text-gray-300 truncate'>
                        in h/{params.slug}
                    </p>
                </div>
            </div>
            <Editor huddlId={huddl.id} />
            <div className='flex justify-end w-full'>
                <Button type="submit" className="w-full rounded" form="huddl-post-form">Post</Button>
            </div>
        </div>
    )
}

export default page