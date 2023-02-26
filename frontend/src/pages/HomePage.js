import React, { useEffect } from "react";
import {Container,Box,Text,Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage=()=>{
  const navigate = useNavigate();
     
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));
    if(user){
      navigate('/chats');
    }
  },[navigate]);
    return(
        <Container maxW='xl' centerContent>
         <Box 
         display="flex"
         justifyContent='center'
         p={3}
         bg="rgb(0,0,0,0.4)"
         w="100%"
         m="40px 0 15px 0"
         borderRadius="lg"
         borderwidth="1px"
         >
           <Text
           fontSize='4xl'
           fontFamily='work sans'
           color="white"
           >Fun Chat App
           </Text>
         </Box>
         <Box
         bg="rgb(0,0,0,0.4)"
         w='100%'
         p={4}
         borderRadius='lg'
         borderWidth='1px'
         color='white'
         >
          <Tabs variant='soft-rounded'>
            <TabList mb='1em'>
                <Tab width='50%' color='white'>Log In</Tab>
                <Tab width='50%' color='white'>Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                <Login/>
                </TabPanel>
                <TabPanel>
                <Signup/>
                </TabPanel>
            </TabPanels>
          </Tabs>
         </Box>
        </Container>
    )
}

export default HomePage;