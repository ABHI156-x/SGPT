import express from "express";
import Thread from "../models/Thread.js";
import getApiResponse from "../utils/api.js";
import authMiddleware from "../middleware/authmiddleware.js";


const router = express.Router();

router.post("/test" ,authMiddleware , async(req , res) => {
    try {
        const thread = new Thread({
            threadId:"xys",
            userId :req.user.userId,
            title : "Testing new "
        });

        const response =await thread.save();
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to save in db"});
    }
});


//get all thread
router.get("/thread",authMiddleware, async(req, res) => {
    try {
        const threads = await Thread.find({userId :req.user.userId}).sort({updatedAt : -1});
        //descending order of updateAt .. most recent chat on top
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch thread"});
    }
});

router.get("/thread/:threadId",authMiddleware,async(req ,res)=>{
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({
            threadId,
            userId: req.user.userId
        });
        if(!thread){
            return res.status(404).json({error : "Thread not found"});
        }
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId" ,authMiddleware , async (req, res) => {
    const {threadId} = req.params;
    try {
        const deleteThread = await Thread.findOneAndDelete({
            threadId ,
            userId: req.user.userId
    });

        if(!deleteThread){
           return res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success :"Thread deleted successfully "});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.post("/chat",authMiddleware, async (req, res) => {
    const {threadId , message} =req.body;

    if(!threadId || !message){
       return res.status(400).json({error:"missing required fields"});
    }

    try {
        let thread = await Thread.findOne({
            threadId ,
            userId: req.user.userId
    });

        if(!thread){
            //create a new thread in db
            thread = new Thread({
                threadId,
                userId: req.user.userId,
                title :message,
                messages: [{role :"user", content :message}]
            });
        }else{
            thread.messages.push({role:"user", content:message});
        }
// get ai response
        const assitantreply = await getApiResponse(message);
//saved the ai response
        thread.messages.push({role:"assistant" ,content :assitantreply});

        await thread.save();
        res.json({reply :assitantreply});

    } catch (error) {
        console.log("Chat error:",error);
        if(error.status === 429){
            return res.status(429).json({message:"AI request limit reached. Please try again later."});
        }

        if(error.status === 503){
            return res.status(503).json({message:"AI service is temporarily unavaible. Please try again in a moment"});
        }

        return res.status(500).json({ message: "Something went wrong while generating the response." });
    }
});

export default router;