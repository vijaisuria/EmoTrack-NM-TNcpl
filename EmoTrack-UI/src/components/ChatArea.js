import React, { useState } from "react";

const ChatArea = () => {
  const [messages, setMessages] = useState([
    { emotrack: "Greetings of the Day, How may I help you today?" },
    { user: "how are you", emotrack: "good" },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Function to handle sending a message
  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = { user: inputValue, emotrack: "" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Send user message to the backend
      fetch('http://localhost:5000/emotrack/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputValue })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Update the emotrack field in the last message with the predicted emoji and emotion
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].emotrack = `${data.predicted_emoji} ${data.predicted_emotion}`;
            return updatedMessages;
          });
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });

      setInputValue(""); // Clear input after sending
    }
  };

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    if (file.type !== 'audio/flac') {
      alert('Please select a .flac audio file');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    fetch('http://localhost:5000/emotrack/audio', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setResult(data);

        setMessages(prevMessages => [
          ...prevMessages,
          { userMessage: previewUrl, emotrack: data.predicted_emotion }
        ]);
      })
      .catch(error => {
        console.error('Error submitting file:', error);
      });
  };

  return (
    <div className="chat-area">
      <div className="chat-area-header">
        <div className="chat-area-title">Share your thoughts!</div>
        <div className="chat-area-group">
          <img
            className="chat-area-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png"
            alt=""
          />
          <img
            className="chat-area-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png"
            alt=""
          />
          <img
            className="chat-area-profile"
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png"
            alt=""
          />
          <span>+4</span>
        </div>
      </div>
      <div className="chat-area-main">
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.user && (
              <div className={`chat-msg owner`}>
                <div className="chat-msg-content">
                  <div className="chat-msg-text">{message.user}</div>
                </div>
              </div>
            )}
            {message.emotrack && (
              <div className="chat-msg">
                <div className="chat-msg-content">
                  <div className="chat-msg-text">{message.emotrack}</div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

      </div>
      <div className="chat-area-footer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-video"
        >
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-image"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-plus-circle"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <div className="detail-photo">
        <input type="file" name="audio" id="audioFile" accept=".flac" onChange={handleFileChange} />
      </div>

      <svg onClick={handleSubmit}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-paperclip"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
        <input
          type="text"
          placeholder="Type something here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <svg onClick={sendMessage} fill="#fff" height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 495.003 495.003">
          <g id="XMLID_51_">
            <path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
		l-67.6-32.22V456.687z"/>
            <path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
		c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
		l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
		L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"/>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-smile"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-thumbs-up"
        >
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      </div>
    </div>
  );
};

export default ChatArea;
