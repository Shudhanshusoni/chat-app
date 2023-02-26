import { Button, Tooltip, Box, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../context/ChatProvider';
import ProfileModol from './ProfileModol';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserList from './UserList';
import { getSender } from '../config/ChatLogic';
import {Effect} from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = () => {
  const [search,setSearch]=useState('');
  const [searchRes,setSearchRes]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState();

  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
  const navigate=useNavigate();
  const toast=useToast();

  const {isOpen, onOpen, onClose}=useDisclosure();
  
  const handleSearch=async ()=>{
    if(!search){
      toast({
        title:'Please Enter Something In Search',
        status:'warning',
        duration:5000,
        isClosable:true,
        position:'top-left'
      });
      return;
    }
      try{
        setLoading(true);
        const config={
          method:'get',
          headers:{
            'content-type':"application/json",
            Authorization:`Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/user?search=${search}`, config);
        setLoading(false);
        setSearchRes(data);
      }catch(err){
        toast({
          title:'Something went wrong',
          discription:'Failed to Load Result',
          status:'error',
          duration:5000,
          isClosable:true,
          position:'top-left'
        })
        setLoading(false);
      }
  }

  const accessChat=async(userId)=>{
    try{
       setLoading(true);
       const config={
        headers:{
          "Content-type":'application/json',
          Authorization:`Bearer ${user.token}`
        }
       }

       const {data}=await axios.post('/chat',{userId},config);

       if(!chats.find((chat)=>chat._id===data._id)){
        setChats([data,...chats]);
       }
       setSelectedChat(data)
       setLoading(false)
       onClose();
    }catch(err){
      toast({
        title:'Fetching chats failed',
        discription:err.message,
        status:'error',
        duration:5000,
        isClosable:true,
        position:'top-left'
      })
    }
  }
  
  const logoutHandler=()=>{
    localStorage.removeItem('userInfo');
    navigate('/');
  }
  
  return (
    <>
    <Box 
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    bg='rgb(226,221,223,0.5)'
    w='100%'
    p='5px 10px'
    borderWidth='2px'>
      <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
        <Button varient='ghost' onClick={onOpen} background={'transparent'}><i className="fas fa-search"></i>
        <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
            </Button>
      </Tooltip>
      <Text fontSize='2xl' fontWeight={900} fontFamily='work sans'>FUN CHAT</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
            />
           <BellIcon fontSize='2xl' m='1'/>
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && 'No New Messages'}
            {notification.map(notify=>(
             <MenuItem key={notify._id} onClick={()=>{
              setSelectedChat(notify.chat);
              setNotification(notification.filter((n)=>n!==notify))
             }}>
              {notify.chat.isGroupChat ? `New Message in ${notify.chat.chatName}`:`New Message from ${getSender(user,notify.chat.users)}`}
             </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton bg='transparent' as={Button} rightIcon={<ChevronDownIcon/>}>
           <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList >
            <ProfileModol  user={user}>
            <MenuItem >MY Profile</MenuItem>
            </ProfileModol>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px' >Search Users</DrawerHeader>

          <DrawerBody>
            <Box
              display='flex'
              pb={2}
              >
              <Input placeholder='Search By Name/Email' mr={2} value={search} onChange={(e)=>{setSearch(e.target.value)}} />
              <Button isLoading={loading} onClick={handleSearch}>Go</Button>
            </Box>
            {loading?(
              <ChatLoading/>
            ):(
              searchRes?.map((user)=>(
                <UserList key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}/>
                
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>     
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
    </>
  )
}
 
export default SideDrawer