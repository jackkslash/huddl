import { FC } from 'react'
import { Button } from './ui/button'

interface SubscribeLeaveToggleProps {

}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ }) => {
    const isSubscribed = false

    return isSubscribed ? (<Button className='w-full mt-1 mb-4'>Leave</Button>) : (<Button className='w-full mt-1 mb-4'>Join</Button>)
}

export default SubscribeLeaveToggle