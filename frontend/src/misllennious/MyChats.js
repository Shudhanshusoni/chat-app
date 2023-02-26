import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogic';
import GroupChatModel from './GroupChatModel';

const MyChats = ({fetchAgain}) => {

  const [loggedUser,SetLoggedUser]=useState();
  const {user,selectedChat,setSelectedChat,chats,setChats}=ChatState();
  
  const toast=useToast();

  const fetchchats=async()=>{
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      };
      const { data } = await axios.get('/chat',config);
     // console.log(data);
      setChats(data);
    }catch(error){
      toast({
        title:'Error Occured!',
        description:'Loading Failed',
        status:'error',
        duration:5000,
        isClosable:true,
        position:'bottom-left'
      });
    }
  }
  
  useEffect(()=>{
    SetLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchchats();
  },[fetchAgain]);

  return (
    <Box
    display={{base:selectedChat?'none':'flex',md:'flex'}}
    flexDir="column"
    alignItems='center'
    p={3}
    bg='rgb(0,0,0,0.3)'
    w={{base:'100%',md:'31%'}}
    borderRadius='lg'
    borderWidth='1px'
    >
    <Box
     pb={3}
     px={3}
     fontSize={{base:'28px',md:'30px'}}
     fontFamily='work sans'
     display='flex'
     w='100%'
     justifyContent='space-between'
     color={'white'}
     alignItems='center'
    >
      My Chats
      <GroupChatModel>
        <Button
        display='flex'
        fontSize={{base:'17px',md:'10px',lg:'17px'}}
        rightIcon={<AddIcon/>}
        color='white'
        bg='transparent'
        >New Group Chat</Button>
      </GroupChatModel>
    </Box>
   
    <Box
    display='flex'
    flexDir='column'
    p={3}
    bg='rgba(200, 223, 168, 0.25)'
    w={'100%'}
    h='100%'
    borderRadius='lg'
    overflowY='hidden'
    >
      {chats ? (
        <Stack overflowY={'scroll'}>
          {chats.map((chat)=>(
            <Box
            onClick={()=>setSelectedChat(chat)}
            cursor='pointer'
            bg={selectedChat === chat ? '#38B2AC':'#E8E8E8'}
            color={selectedChat === chat ? 'white':'black'}
            px={3}
            py={2}
            borderRadius='lg'
            key={chat._id}
            >
            <Text>
              {!chat.isGroupChat ? getSender(loggedUser,chat.users):chat.chatName}
            </Text>
            {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
            )}
            </Box>
          ))}
        </Stack>
      ):(<ChatLoading />)}
    </Box>
    </Box>
  )
}

export default MyChats;