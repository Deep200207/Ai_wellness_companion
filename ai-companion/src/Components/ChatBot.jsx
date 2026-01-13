import React, { useState } from 'react'
import bg from '../assets/bg_chatbot.jpg'
import { IoSend } from "react-icons/io5";

export default function ChatBot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); // { sender: "user" | "bot", text: string }
    const [isMessage, setIsmessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput("");

        // add user message + empty bot message (for streaming)
        setMessages(prev => [
            ...prev,
            { sender: "user", text: userText },
            { sender: "bot", text: "" }
        ]);
        setIsmessage(true);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/fitness-stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText })
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
            let botText = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (done) break;

                botText += decoder.decode(value, { stream: true });

                // update last bot message with streaming text
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        sender: "bot",
                        text: botText
                    };
                    return updated;
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='w-[85%] float-right bg-cover bg-center h-full'
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className='flex justify-between items-center h-140 w-full text-white'>
                {isMessage ? (
                    <div className='w-full flex justify-center items-center h-140'>
                        <div className='w-200 bg-slate-800 h-130 rounded-3xl overflow-y-auto p-4'>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`w-full flex ${msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] m-2 p-2 rounded-3xl text-sm md:text-base whitespace-pre-wrap
                                            ${msg.sender === "user"
                                                ? "bg-violet-600 text-white"
                                                : "bg-slate-700 text-slate-100"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <p className="text-xs text-gray-400 px-2">
                                    AI is thinking…
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='w-full text-2xl bg-gradient-to-b from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent'>
                        <h1 className='text-center p-2 font-bold font-serif text-3xl'>
                            Talk To AI . . .
                        </h1>
                        <h1 className='text-center p-2'>
                            Get Health And <br />
                            Nutrition Suggestion <br />
                            And <br />
                            Stay Fit
                        </h1>
                    </div>
                )}
            </div>

            <div className='flex items-center justify-center'>
                <div className='flex mb-10 gap-2'>
                    <input
                        type="text"
                        placeholder='Type your query'
                        className='w-200 bg-slate-700 outline-0 text-white rounded-2xl p-2'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                    <IoSend
                        size={40}
                        className="text-slate-200 bg-slate-800 p-1 rounded-full hover:cursor-pointer"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
