import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import UserList from './UserList';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModel = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();
   
    const toast=useToast();

    const handleSubmit=async()=>{
      if(!groupChatName || !selectedUsers){
        toast({
          title:"Please fill all the field",
          status:'warning',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        return;
      }
      try{
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          }
        }
        const {data}=await axios.post('/chat/group',{
          name:groupChatName,
          users:JSON.stringify(selectedUsers.map((u)=>u._id)),
        },config)
        setChats([data,...chats])
        onClose();
        toast({
          title:'New Group Chat Created',
          status:'success',
          duration:5000,
          isClosable:true,
          position:'bottom'
        })
      }catch(error){
        toast({
          title:'Failed to Create the Chat',
          description:error.response.data,
          status:'error',
          duration:5000,
          isClosable:true,
          position:'bottom'
        })
      }
    }

    const handleGroup=(usertoAdd)=>{
     if(selectedUsers.includes(usertoAdd)){
      toast({
        title:'UserAlready Exist',
        status:'warning',
        duration:5000,
        isClosable:true,
        position:'top'
      })
      return;
     }
     setSelectedUsers([...selectedUsers,usertoAdd])
    }

    const handleDelete=(userBeRemoved)=>{
      setSelectedUsers(selectedUsers.filter(sel=>sel._id !==userBeRemoved._id))
    }

    const handleSearch=async(query)=>{
      setSearch(query);
      if(!query){
        return;
      }
      try{
        setLoading(true)
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          }
        }; 
        const {data}=await axios.get(`/user?search=${search}`,config)
       
        setLoading(false);
        setSearchResult(data);
      }catch(error){
        toast({title:'Error Occured',
        description:'Failed to Load Search Result',
        status:'error',
        duration:5000,
        isCloseable:true,
        position:'bottom-left'
      })

      }
    }

  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
         fontSize="35px"
         fontFamily="Work sans"
         display="flex"
         justifyContent="center"
         >Create Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody
         display="flex" 
         flexDir="column" 
         alignItems="center"
         >
          <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl> 
            <Box
            w='100%'
            display='flex'
            flexWrap='wrap'
            >
            {
              selectedUsers.map(u=>(
                <UserBadgeItem key={u._id} user={u}
                handleFunction={()=>handleDelete(u)}
                />
              ))
            }
            </Box>
            {
              loading?(<div>loading</div>):(
                searchResult?.slice(0,4).map(user=>(
                  <UserList key={user._id} user={user} handleFunction={()=>handleGroup(user)} />
                ))
              )
            }
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModel