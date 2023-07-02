import CreatePost from '@/components/CreatePost'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface pageProps {
    params: {
        slug: string
    }
}

const page = async ({ params }: pageProps) => {
    const { slug } = params

    const session = await getAuthSession();

    const huddl = await db.huddl.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    huddl: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 2
            }
        }
    })

    if (!huddl) return notFound();

    return (
        <div>
            <h1 className='text-3xl font-bold md:text-4xl h-14'>h/{huddl.name}</h1>
            {session?.user ? (
                <CreatePost session={session}></CreatePost>
            ) : <div>Sign in to submit a post.</div>}
        </div>)
}

export default page