'use client'
import { postCreationRequest, postValidator } from '@/lib/validators/post';
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { uploadFiles } from '@/lib/uploadthing';
interface EditorProps {
    huddlId: string
}

type FormData = z.infer<typeof postValidator>

export const Editor: FC<EditorProps> = ({ huddlId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(postValidator),
        defaultValues: {
            huddlId,
            title: '',
            content: null
        }
    })

    const ref = useRef<EditorJS>()
    const [isMounted, setMounted] = useState<boolean>(false)
    const _titleRef = useRef<HTMLTextAreaElement>(null)
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMounted(true)
        }
    }, [])

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        if (!ref.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor
                },
                placeholder: 'Type here for your post...',
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    // upload to uploadthing
                                    //@ts-ignore
                                    const [res] = await uploadFiles([file], 'imageUploader')

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    }
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                }
            })
        }
    }, [])

    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    title: "Something has gone wrong",
                    description: (value as { message: string }).message,
                    variant: "destructive"
                })
            }
        }
    }, [errors])
    useEffect(() => {
        const init = async () => {
            await initializeEditor()
            setTimeout(() => {
                _titleRef.current?.focus()
            }, 0)
        }
        if (isMounted) {
            init()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initializeEditor])


    const { mutate: createPost } = useMutation({
        mutationFn: async ({ title, content, huddlId }: postCreationRequest) => {
            const payload: postCreationRequest = {
                title,
                content,
                huddlId
            }
            const { data } = await axios.post('/api/huddl/post/create', payload)
            return data
        },
        onError: () => {
            return toast({
                title: 'Something went wrong',
                description: 'Your post was not created, try again later',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            const newPathname = pathname.split('/').slice(0, -1).join('/')
            router.push(newPathname)
            router.refresh()

            return toast({
                description: 'Post was created.'
            })
        }
    })

    async function onSubmit(data: postCreationRequest) {
        const blocks = await ref.current?.save()


        const payload: postCreationRequest = {
            title: data.title,
            content: blocks,
            huddlId
        }

        createPost(payload)
    }


    if (!isMounted) {
        return null
    }
    const { ref: titleRef, ...rest } = register('title')
    return (
        <div className='w-full p-4 bg-white border rounded-lg border-zinc-200'>
            <form className='w-fit' id="huddl-post-form" onSubmit={handleSubmit(onSubmit)}>
                <TextareaAutosize ref={(e => {
                    titleRef(e)
                    //@ts-ignore
                    _titleRef.current = e
                })}
                    {...rest}
                    placeholder='title'
                    className='w-full overflow-hidden text-5xl font-bold text-black bg-transparent appearance-none resize-none focus:outline-none' />
            </form>
            <div id='editor' className='text-black -pb-12' />
        </div>
    )
}

export default Editor