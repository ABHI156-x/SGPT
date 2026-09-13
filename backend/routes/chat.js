import express from "express";
import Thread from "../models/Thread.js";
import getApiResponse from "../utils/api.js";

const router = express.Router();

router.post("/test" , async(req , res) => {
    try {
        const thread = new Thread({
            threadId:"xys",
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
router.get("/thread", async(req, res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt : -1});
        //descending order of updateAt .. most recent chat on top
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch thread"});
    }
});

router.get("/thread/:threadId",async(req ,res)=>{
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error : "Thread not found"});
        }
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId" , async (req, res) => {
    const {threadId} = req.params;
    try {
        const deleteThread = await Thread.findOneAndDelete({threadId});

        if(!deleteThread){
            res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success :"Thread deleted successfully "});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.post("/chat", async (req, res) => {
    const {threadId , message} =req.body;

    if(!threadId || !message){
        res.status(400).json({error:"missing required fields"});
    }

    try {
        let thread = await Thread.findOne({threadId});

        if(!thread){
            //create a new thread in db
            thread = new Thread({
                threadId,
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
        thread.updateAt= new Date();

        await thread.save();
        res.json({reply :assitantreply});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong"});
    }
});

export default router;