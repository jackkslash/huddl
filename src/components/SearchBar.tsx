'use client'

import { Huddl, Prisma } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Users } from 'lucide-react'

interface SearchBarProps { }

const SearchBar: FC<SearchBarProps> = ({ }) => {

    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const request = debounce(async () => {
        refetch()
    }, 300)

    const debounceRequest = useCallback(() => {
        request()
    }, [])
    const { data: queryResults, refetch, isFetched, isFetching } = useQuery({
        queryFn: async () => {
            if (!input) return []

            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (Huddl & {
                _count: Prisma.HuddlCountOutputType
            })[]
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    return (
        <Command
            className='relative z-50 max-w-lg overflow-visible border rounded-lg'>
            <CommandInput
                value={input}
                onValueChange={(text) => {
                    setInput(text)
                    debounceRequest()
                }}
                className='border-none outline-none focus:border-none focus:outline-none ring-0'
                placeholder='Search communities...'
            />
            {input.length > 0 ? (
                <CommandList className='absolute inset-x-0 text-black bg-white shadow top-full rounded-b-md'>
                    {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Communities'>
                            {queryResults?.map((huddl) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        router.push(`/h/${e}`)
                                        router.refresh()
                                    }}
                                    key={huddl.id}
                                    value={huddl.name}>
                                    <Users className='w-4 h-4 mr-2' />
                                    <a href={`/h/${huddl.name}`}>h/{huddl.name}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : null}
        </Command>
    )
}

export default SearchBar
