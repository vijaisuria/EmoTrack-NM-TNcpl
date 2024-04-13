import React, { useState, useEffect } from "react";
import "../Styles.scss"

const Details = () => {
  const [userData, setUserData] = useState(null);

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

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/emotrack/image', {
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
      })
      .catch(error => {
        console.error('Error submitting file:', error);
      });
  };

  useEffect(() => {
    // Extract token and user ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('user');

    // Make a request to the Flask backend to fetch user details
    fetch(`http://localhost:5000/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Store user data in state
        setUserData(data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);


  return (
    <div className="detail-area " style={{ overflowX: "hidden" }}>
      <div className="detail-area-header">
        <div className="msg-profile group">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="css-i6dzq1"
          >
            <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
            <path d="M22 8.5l-10 7-10-7" />
            <path d="M2 15.5l10-7 10 7M12 2v6.5" />
          </svg>
        </div>
        {userData ? (
          <div className="detail-title"> {userData.username} </div>
        ) : (
          <div>Loading...</div>
        )}
        <div className="detail-subtitle">{userData ? userData.email : 'Loading..'}</div>
        <div className="detail-buttons">
          <button className="detail-button">
            <svg
              viewbox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-phone"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Voice
          </button>
          <button className="detail-button">
            <svg
              viewbox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-video"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Image post
          </button>
        </div>
      </div>
      <div className="detail-changes">
        <input type="text" placeholder="Search in Conversation" />
        <div className="detail-change">
          Change Color
          <div className="colors">
            <div className="color blue selected" data-color="blue"></div>
            <div className="color purple" data-color="purple"></div>
            <div className="color green" data-color="green"></div>
            <div className="color orange" data-color="orange"></div>
          </div>
        </div>
      </div>
      <div className="detail-photos">
        <div className="detail-photo">
          <p >
            <input type="file" name="image" id="imageFile" accept="image/*" onChange={handleFileChange} />
          </p>
        </div>
        <div className="detail-photo">
          {/* Display preview for uploaded photo */}
          <div class="image-space">
          {previewUrl && (
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          )}
          </div>
          {result && (
            <div>
              <p>Emotion: {result[0].emotion}</p>
              <p>Coordinates: x: {result[0].coordinates.x}
                y: {result[0].coordinates.y}
                w: {result[0].coordinates.w}
                h: {result[0].coordinates.h}</p>
            </div>
          )}
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
      <a href="https://twitter.com/AysnrTrkk" className="follow-me" target="_blank">
        <span className="follow-text">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="css-i6dzq1"
          >
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
          Follow me on Twitter
        </span>
        <span className="developer">
          <img src="https://pbs.twimg.com/profile_images/1253782473953157124/x56UURmt_400x400.jpg" />
          Aysenur Turk — @AysnrTrkk
        </span>
      </a>
    </div>
  );
};

export default Details;
