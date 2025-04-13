import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ChatbotDashboard = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState([]);

  // Fetch stored knowledge
  useEffect(() => {
    fetch("https://moihub-chatbot.onrender.com/knowledge")
      .then((res) => res.json())
      .then((data) => setKnowledgeBase(data));
  }, []);

  // Train the chatbot
  const handleTrain = async () => {
    if (!question || !answer) {
      Swal.fire("Error", "Both question and answer are required!", "error");
      return;
    }

    const res = await fetch("https://moihub-chatbot.onrender.com/train", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire("Success", data.message, "success");
      setKnowledgeBase([...knowledgeBase, { question, answer }]);
      setQuestion("");
      setAnswer("");
    } else {
      Swal.fire("Error", data.error, "error");
    }
  };

  // Chat with the bot
  const handleChat = async () => {
    if (!chatInput) {
      Swal.fire("Error", "Please enter a question!", "error");
      return;
    }

    const res = await fetch("https://moihub-chatbot.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: chatInput }),
    });

    const data = await res.json();
    setChatResponse(data.response);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">MoiHub Chatbot Trainer</h2>

      {/* Training Section */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Train Chatbot</h3>
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleTrain}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Train
        </button>
      </div>

      {/* Chat Section */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Chat with Chatbot</h3>
        <input
          type="text"
          placeholder="Ask a question..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleChat}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Ask
        </button>
        {chatResponse && (
          <p className="mt-3 p-2 bg-gray-200 rounded">
            <strong>Bot:</strong> {chatResponse}
          </p>
        )}
      </div>

      {/* Knowledge Base */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
        <ul>
          {knowledgeBase.map((item, index) => (
            <li key={index} className="p-2 border-b">
              <strong>Q:</strong> {item.question} <br />
              <strong>A:</strong> {item.answer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatbotDashboard;
