import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from './routes/user.js';
import { recipesRouter } from "./routes/recipes.js";


const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect("mongodb+srv://ymoha2723:Coventry2@recipess.n211zrs.mongodb.net/recipess?retryWrites=true&w=majority&appName=Recipess");


 

app.listen(3000, () => console.log("SERVER STARTED!"));

 


