import React from 'react'
import './style.css'
import {ChatState} from '../context/ChatProvider'
import {Box} from '@chakra-ui/react'
import SingleChat from './SingleChat'

const MyChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedChat}=ChatState();

  return (
    <Box
    display={{base:selectedChat?'flex':'none',md:'flex'}}
    alignItems="center"
    flexDir="column"
    p={3}
    bg='transparent'
    w={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px"
    >
     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default MyChatBox;