import React, { useState } from 'react'
import { FormControl, Button , FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [show,setShow]=useState(false);
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [loading,setLoading]=useState(false);
  const toast=useToast();
  const navigate=useNavigate();



const handleClick=()=>setShow(!show);

const submitHandler=async()=>{
     setLoading(true);
     if(!email || !password){
      toast({
          title:'Please fill the required field',
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"top-right",
      })
      setLoading(false);
      return;
     }
     try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data }=await axios.post('user/login',{ email, password },config);
      // console.log(data);
      toast({
        title:'Login SuccessFul',
        status:"success",
        duration:5000,
        isClosable:true,
        position:"top-right"
      });
      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
     }
     catch(error){
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
     }
};

  return (
    <VStack spacing='10px'>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input type='Email' name='email' placeholder='Enter Your Email' value={email} onChange={e=>setEmail(e.target.value)} />
      </FormControl>

      <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size='md'>
            <Input type={show?'text':'password'} name='password' placeholder='Enter Your Password' value={password} onChange={e=>setPassword(e.target.value)} />
            <InputRightElement width='4.5rem'>
              <Button bg='rgb(0,0,0,0.7)' h='1.75rem' size='sm' onClick={handleClick}>
                {show ? "Hide":"Show"}
              </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <Button
        bg='rgb(0,0,0,0.7)'
        width='100%'
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
        >
            Login
        </Button>

        <Button
        varient='solid'
        colorScheme={'red'}
        width='100%'
        onClick={()=>{
          setEmail("guest@example.com");
          setPassword('123456');
        }}
        >
           Crendential Login
        </Button>
    </VStack>
  )
}

export default Login;