import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../misllennious/SideDrawer';
import MyChats from '../misllennious/MyChats';
import MyChatBox from '../misllennious/MyChatBox'

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false);
  return (
    <div style={{width:'100%'}}>
        {user && <SideDrawer/>}
        <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91vh'
        p='10px'
        >
            {user && < MyChats fetchAgain={fetchAgain} />}
            {user && < MyChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
    </div>
  )
}

export default ChatPage;