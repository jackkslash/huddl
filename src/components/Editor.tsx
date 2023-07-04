'use client'
import { postValidator } from '@/lib/validators/post';
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs';
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
        const init = async () => {
            await initializeEditor()
            setTimeout(() => {

            })
        }
        if (isMounted) {
            init()

            return () => {
            }
        }
    }, [isMounted, initializeEditor])

    return (
        <div className='w-full p-4 bg-white border rounded-lg border-zinc-200'>
            <form className='w-fit' id="huddl-post-form" onSubmit={() => { }}>
                <TextareaAutosize placeholder='title' className='w-full overflow-hidden text-5xl font-bold text-black bg-transparent appearance-none resize-none focus:outline-none' />
            </form>
            <div id='editor' className='text-black -pb-12' />
        </div>
    )
}

export default Editor