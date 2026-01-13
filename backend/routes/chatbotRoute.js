import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const chatbotRoute = express.Router();

chatbotRoute.post("/api/fitness-stream", async (req, res) => {
    const apiKey = process.env.GROQ_API_KEY;
    const {message} = req.body;
    res.setHeader("Content-Type", "Text/plain; charset=utf-8");// This means
    // The text inside the response uses UTF-8 encoding
    res.setHeader("Transfer-Encoding", "chunked");//It tells the browser/client that the server will send the response
    //  in small pieces (“chunks”) instead of sending it all at once.
    res.flushHeaders?.();   //It immediately sends the HTTP response headers to the client
    // Even before you finish sending the full response body. and .?->optional chaining
    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                stream: true,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a friendly Health & fitness Coach" +
                            "Ask follow up question and give safe answer , evidence based advice"
                    },
                    { role: "user", content: message }
                ]
            })
        });
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        for await (const chunk of groqRes.body) {
            buffer += decoder.decode(chunk, { stream: true });//It converts a raw binary chunk (Uint8Array)
            //  into text using UTF-8 decoding
            const lines = buffer.split("\n");
            buffer = lines.pop();
            for (const line of lines){
                const trimmed=line.trim();
                if(!trimmed || !trimmed.startsWith("data:")) continue;
                if(trimmed=== "data: [DONE]") continue;
                try{
                    const jsonStr=trimmed.replace(/^data:\s*/,"");
                    const data=JSON.parse(jsonStr);
                    console.log(data.choices?.[0]?.delta);
                    const delta=data.choices?.[0]?.delta?.content;  
                    if(delta){
                        res.write(delta);//.write() is used to send chunk of res to client before ending
                        // must be required end()
                    }
                }catch(e){

                }
            }
        }
        res.end();// req in res.wait()
    } catch (err) {
        console.log(err);
        res.status(500).end("Error in groq")
    }
});
export default chatbotRoute;




