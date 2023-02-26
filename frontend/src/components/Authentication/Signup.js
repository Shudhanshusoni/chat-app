import { Button, Input, FormControl, FormLabel, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React,{useState} from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Signup = () => {
    const [show,setShow]=useState(false);
    const [datas,setDatas]=useState({
        name:"",
        email:"",
        password:"",
        cpassword:"",
})
const [pic,setPic]=useState()
 const [loading,setLoading]=useState(false);
 const toast = useToast();
 const navigate=useNavigate();

const handleChange=(e)=>{
    e.preventDefault();
    const {name,value}=e.target;
    setDatas((prev)=>{
        return {...prev,[name]:value }
    });
};
//console.log(data);

const handleClick=()=>setShow(!show)

const postDetails=(pics)=>{
  setLoading(true);
  if(pics === undefined){
    toast({
      title: 'Please Select an Image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position:"top-right",
    });
    return;
  }
   if(pics.type === "image/jpeg" || pics.type === "image/png"){
   const data = new FormData();
   data.append('file',pics);
   data.append('upload_preset','chat-app');
   data.append('cloud_name','dm80pfbsy');
   fetch('https://api.cloudinary.com/v1_1/dm80pfbsy/image/upload',{
    method:'post',
    body:data,
   }).then((res)=>res.json()).then((data)=>{
      setPic(data.url.toString());
      setLoading(false);
   }).catch((err)=>{
    console.log(err);
    setLoading(false);
   })
  }else{
    toast({
      title: 'Please Select an Image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position:"top-right",
    })
    return;
  }
};

const submitHandler=async()=>{
  const {name,email,password,cpassword}=datas;
  setLoading(true);
  if(!name || !email || !password || !cpassword){
    toast({
      title:'Please fill the required field',
      status:"warning",
      duration:5000,
      isClosable:true,
      position:"top-right"
    })
    setLoading(false);
    return;
  }
  if(password!==cpassword){
    toast({
      title:'Password not match',
      status:'warning',
      duration:5000,
      isClosable:true,
      position:'top-right'
    });
    return;
  }
  try{
    const config = {
      headers:{
        'content-type':'application/json'
      }
    };
    const {data}=await axios.post('/user',{name,email,password,pic},
    config
    );
    toast({
      title:'Resgistration',
      status:'success',
      duration:5000,
      isClosable:true,
      position:'top-right'
    });
    localStorage.setItem('userInfo',JSON.stringify(data));
    setLoading(false);
    navigate('/chats');
   
  }catch(err){
   toast({
    title:'Something went wrong',
    description: err.response.data.message,
    status:err,
    duration:5000,
    isClosable:true,
    position:'top-right'
   })
   setLoading(false);
  }
};
  return (
    <VStack spacing='5px'>
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input id="text" type='name' name='name' placeholder='Enter Your Name' onChange={handleChange} />
        </FormControl>

        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input id="text" type='Email' name='email' placeholder='Enter Your Email' onChange={handleChange} />
        </FormControl>
        
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size='md'>
            <Input id="text" type={show?'text':'password'} name='password' placeholder='Enter Your Password' onChange={handleChange} />
            <InputRightElement width='4.5rem'>
              <Button bg='rgb(0,0,0,0.7)' h='1.75rem' size='sm' onClick={handleClick}>
                {show ? "Hide":"Show"}
              </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size='md'>
            <Input id="text" type={show?'text':'password'} name='cpassword' placeholder='Confirm Your Password' onChange={handleChange} />
            <InputRightElement width='4.5rem'>
              <Button bg='rgb(0,0,0,0.7)' h='1.75rem' size='sm' onClick={handleClick}>
                {show ? "Hide":"Show"}
              </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>


        <FormControl id="pic">
            <FormLabel>Upload Your Image</FormLabel>
            <Input type='file' p={1.5} accept='image/*' name='pic' onChange={(e)=>postDetails(e.target.files[0])} />
        </FormControl>

        <Button
        bg='rgb(0,0,0,0.7)'
        width='100%'
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup