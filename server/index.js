import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDb from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoute from './routes/authRoute.js'
import sessionRoute from './routes/sessionRoute.js'
import zegoRoute from './routes/zegoRoute.js'


dotenv.config();


const app =express();
const PORT = process.env.PORT;


const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials:true
}

/* we should use  below start function to ensure that server starts after database connection . 

const startServer = async () => {
    await connectDb();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
*/

// we should not use connectDb directly like below 

connectDb();

app.use(cors(corsOption));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/api/health', (req,res) => {
    res.json({
        status: 'OK',
        message:'EduMeet server is running',
        timestamp:new Date().toISOString()
    })
})
 
//Api routes
app.use('/api/auth',authRoute)
app.use('/api/session',sessionRoute)
app.use('/api/zego', zegoRoute)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})