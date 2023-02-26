import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender,getSenderFull } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import ProfileModol from './ProfileModol';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat';
import './style.css';
import io from 'socket.io-client' 
import Lottie from 'react-lottie';
import animationData from '../animation/typing.json';
import emoji from '../img/smile.png'
import  Picker  from '@emoji-mart/react'
import data from '@emoji-mart/data'

const ENDPOINT='https://fun-chat-app.onrender.com';
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(false);
    const [newMessage,setNewMessage]=useState();
    const [socketConnected,setSocketConnected]=useState(false);
    const {user,selectedChat,setSelectedChat,notification, setNotification}=ChatState();
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const [ showEmoji, setShowEmoji ] = useState(false)
   
    
     const defaultOptions={
      loop:true,
      autoplay:true,
      animationData:animationData,
      renderSettings:{
        preserveAspectRatio:'xMidYMid slice',
      }
     }
    const toast=useToast();

    const fetchMessages = async () => {
      if (!selectedChat) return;
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `/message/${selectedChat._id}`,
          config
        );
       // console.log(messages);
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    const handleEmojiShow = () => { setShowEmoji((v) => !v) }
    const handleEmojiSelect = (e) => { 
      setNewMessage((newMessage) => (newMessage += e.native)) ;
     }
    const sendMessage=async(event)=>{
       if (event.key === "Enter" && newMessage) {
         socket.emit("stop typing", selectedChat._id);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          
          const { data } = await axios.post(
            "/message",
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          );
         // console.log(data);
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    }

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
 // eslint-disable-next-line
   }, []);

    useEffect(() => {
      fetchMessages();
  
      selectedChatCompare = selectedChat;
      
    }, [selectedChat]);

    useEffect(()=>{
      socket.on('message received',(newMessageReceived)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
           if(!notification.includes(newMessageReceived)){
            setNotification([ newMessageReceived, ...notification ]);
            setFetchAgain(!fetchAgain)
           }
        }
        else{
          setMessages([ ...messages, newMessageReceived ]);
        }
      });
      
    });
    
    
    const typingHandler=(e)=>{
      setNewMessage(e.target.value);
      
      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id);
      }
      let lastTypingTime=new Date().getTime();
      var timerLength = 5000;
      setTimeout(()=>{
      var timeNow =new Date().getTime();
      var timeDiff=timeNow-lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing',selectedChat._id);
        setTyping(false);
      }
      },timerLength)
    }

    return (
    <>
    {
        selectedChat?(
         <>
         <Text
         fontSize={{ base: "28px", md: "30px" }}
         pb={3}
         px={2}
         w="100%"
         fontFamily="Work sans"
         display="flex"
         justifyContent={{ base: "space-between" }}
         alignItems="center"
         color='white'
         >
           <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              !selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModol
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModel
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
         </Text>
         <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg='rgba(200, 223, 168, 0.25)'
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
         >
          {loading?(
            <Spinner
                display={'flex'}
                size="xl"
                w={20}
                h={20}
                margin="auto"
                
                />
          ):(
          <div className='messages'>
            <ScrollableChat messages={messages}/>
          </div>)}
          <FormControl  onKeyDown={sendMessage} isRequired mt={3}>
             {istyping?<div>
              <Lottie
              options={defaultOptions}
              width={70}
              style={{ marginBottom:15,marginLeft:0}}
              />
             </div>:<></>}

             <div>
        {showEmoji && (
          <div>
            <Picker data={data}
            previewPosition='none'
              onEmojiSelect={handleEmojiSelect}
              />
          </div>
        )}
      </div>
             <Box display='flex' gap='5px'>
             <Input  
             variant={'filled'}
             bg='#E8E8E8'
             placeholder='Enter a message'
             onChange={typingHandler}
             value={newMessage}
             color='white'/>
             <Button 
              type='button'
              onClick={handleEmojiShow}
             >
            <img src={emoji} width='30px' height={'10px'} alt='emojiIcon'/>
            </Button>
            </Box>
             
          </FormControl>
         
         </Box>
         </>
        ):(
          <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'
          >
            <Text 
            fontSize='3xl'
            pb={3}
            fontFamily='work sans'
            color='rgba(8, 176, 162, 0.8)'
            >Click on a user to Start Chatting</Text>

          </Box>
        )
    }
    </>
  ) 
}

export default SingleChat;