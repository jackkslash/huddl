'use client'

function CustomCodeRenderer({ data }: any) {
    (data)

    return (
        <pre className='p-4 bg-gray-800 rounded-md'>
            <code className='text-sm text-black'>{data.code}</code>
        </pre>
    )
}

export default CustomCodeRenderer
