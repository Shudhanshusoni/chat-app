const dotenv=require('dotenv')
const express=require('express');
const connectDB = require('./config/db');
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoutes')
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
const path=require('path');


dotenv.config({path: path.relative(process.cwd(), path.join(__dirname,'.env'))});

connectDB();
const app = express();

app.use(express.json());


const PORT = process.env.PORT || 8000;



app.use('/user',userRoutes)
app.use('/chat',chatRoutes)
app.use('/message',messageRoutes);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1,"./frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "./frontend/build/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on('connection',(socket)=>{
  console.log('connected to socket.io');
   
  socket.on('setup',(userData)=>{
  socket.join(userData._id);
  socket.emit('connected')
  });

  socket.on('join chat',(room)=>{
  socket.join(room);
  console.log('user joined Room: '+room);
  })

  socket.on('typing',(room)=>socket.in(room).emit('typing'));

  socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'));

  socket.on('new message',(newMessageReceived)=>{
  var chat=newMessageReceived.chat;
  if(!chat.users){
    return console.log('chat.users not defined'); 
  }
  chat.users.forEach((user) => {
    if(user._id == newMessageReceived.sender._id){
        return;
    }
    socket.in(user._id).emit('message received',newMessageReceived);
  })
  });

  socket.off('setup',()=>{
    console.log('user disconnected');
    socket.leave(userData._id);
  });
})