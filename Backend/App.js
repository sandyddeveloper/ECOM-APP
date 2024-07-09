import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/db.js";


dotenv.config();
 
const port = process.env.PORT;
const app = express();


app.get("/",(req, res) =>{
    res.send("hello world")
})
app.listen(port, () =>{
    console.log(`the server is runner in  ${port}`);
    connectDB();
})