import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import { FC } from 'react'
import PostFeed from './PostFeed'
import { getAuthSession } from '@/lib/auth'


const CustomFeed: FC = async () => {

    const session = await getAuthSession()

    const followedCommunites = await db.subscription.findMany({
        where: {
            userId: session?.user.id
        },
        include: {
            huddl: true
        }
    })

    const posts = await db.post.findMany({
        where: {
            huddl: {
                name: {
                    in: followedCommunites.map(({ huddl }) => huddl.id)
                },
            },
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            huddl: true
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS

    })

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed