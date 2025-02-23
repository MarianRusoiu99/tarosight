"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TarotCard = {
  position: string;
  card: string;
  definition: string;
  interpretation: string;
};

type ReadingResponse = {
  reading: TarotCard[];
  aiResult: any; // The AI result might be a string or an object.
};

export default function TarotPage() {
  const [reading, setReading] = useState<TarotCard[] | null>(null);
  const [aiResult, setAiResult] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // Generate a tarot reading by calling the API route.
  const generateReading = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tarot/reading", { method: "POST" });
      if (res.ok) {
        const data: ReadingResponse = await res.json();
        setReading(data.reading);
        // Assume AI service returns a "result" field; fallback to stringifying if needed.
        setAiResult(data.aiResult.result || JSON.stringify(data.aiResult));
      } else {
        alert("Error generating tarot reading");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating reading");
    }
    setLoading(false);
  };

  // Send a chat message to the AI.
  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/tarot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        const aiText = data.aiResult.result || JSON.stringify(data.aiResult);
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: aiText },
        ]);
      } else {
        alert("Error communicating with AI.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending chat message");
    }
    setChatLoading(false);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Tarot Reading</h1>
          <Button
            onClick={generateReading}
            disabled={loading}
            className="mb-4"
          >
            {loading ? "Generating..." : "Generate Tarot Reading"}
          </Button>

          {reading && (
            <div className="space-y-4">
              {reading.map((card) => (
                <div
                  key={card.card}
                  className="border rounded p-4 bg-white"
                >
                  <h2 className="text-xl font-semibold">
                    {card.position}: {card.card}
                  </h2>
                  <p>
                    <strong>Definition:</strong> {card.definition}
                  </p>
                  <p>
                    <strong>Interpretation:</strong> {card.interpretation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {aiResult && (
            <div className="mt-6 p-4 bg-gray-50 border rounded">
              <h2 className="text-xl font-semibold mb-2">
                AI's Detailed Reading:
              </h2>
              <p>{aiResult}</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Chat with AI
          </h2>
          <div className="space-y-4 h-64 overflow-y-auto border p-4 mb-4 bg-white">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <span
                  className={`inline-block px-3 py-2 rounded ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={sendChat} className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={chatLoading}>
              {chatLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
} 