import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { FC } from 'react'
import { nullable } from 'zod'
import PostComment from './PostComment'
import CreateComment from './CreateComment'

interface CommentsSectionProps {
    postId: string
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {

    const session = await getAuthSession()

    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true
                }
            }
        }
    })


    return (
        <div className='flex flex-col mt-4 gap-y-4'>
            <hr className='w-full h-px my-6' />

            <CreateComment postId={postId} />

            <div className='flex flex-col mt-4 gap-y-6'>
                {comments
                    .filter((comment) => !comment.replyToId)
                    .map((topLevelComment) => {
                        const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
                            (acc, vote) => {
                                if (vote.type === 'UP') return acc + 1
                                if (vote.type === 'DOWN') return acc - 1
                                return acc
                            },
                            0
                        )

                        const topLevelCommentVote = topLevelComment.votes.find(
                            (vote) => vote.userId === session?.user.id
                        )

                        return (
                            <div key={topLevelComment.id} className='flex flex-col'>
                                <div className='mb-2'>
                                    <PostComment
                                        comment={topLevelComment}
                                        currentVote={topLevelCommentVote}
                                        votesAmt={topLevelCommentVotesAmt}
                                        postId={postId}
                                    />
                                </div>

                                {/* Render replies */}
                                {topLevelComment.replies
                                    .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                                    .map((reply) => {
                                        const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                                            if (vote.type === 'UP') return acc + 1
                                            if (vote.type === 'DOWN') return acc - 1
                                            return acc
                                        }, 0)

                                        const replyVote = reply.votes.find(
                                            (vote) => vote.userId === session?.user.id
                                        )

                                        return (
                                            <div
                                                key={reply.id}
                                                className='py-2 pl-4 ml-2 border-l-2 border-zinc-200'>
                                                <PostComment
                                                    comment={reply}
                                                    currentVote={replyVote}
                                                    votesAmt={replyVotesAmt}
                                                    postId={postId}
                                                />
                                            </div>
                                        )
                                    })}
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default CommentsSection