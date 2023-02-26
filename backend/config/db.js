const mongoose = require('mongoose');

const connectDB = async() => {
    try{
         mongoose.set("strictQuery", false);
         
        const conn = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnymtzn.mongodb.net/?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        });
        console.log(`MongoDB connected:${conn.connection.host}`);
    }catch(error){
        console.log(`error:${error.message}`);
        process.exit();
    }
}

module.exports=connectDB;