import React, { useState } from "react";
import "./App.css";
import { BeatLoader } from "react-spinners";
import { FaCopy } from "react-icons/fa";

const App = () => {
  const [formData, setFormData] = useState({
    language: "Spanish",
    message: "",
    model: "gpt-3.5-turbo",
  });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);

    const urlEncodedData = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      urlEncodedData.append(key, value);
    }

    try {
      const response = await fetch("http://localhost:5500/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData.toString(),
      });

      const data = await response.json();
      console.log(data.translatedText);

      setTranslation(data.translatedText);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopy = () => {
    if (translation) {
      navigator.clipboard
        .writeText(translation)
        .then(() => displayNotification())
        .catch((err) => console.error("failed to copy: ", err));
    }
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleClear = () => {
    setFormData({ ...formData, message: "" });
    setTranslation("");
  };

  return (
    <>
      <nav>
        <h1>Translation App</h1>
      </nav>

      <div className="container">
        <form onSubmit={handleOnSubmit}>
          <div className="choices">
            <div className="select">
              <select
                name="model"
                id="model"
                value={formData.model}
                onChange={handleInputChange}
              >
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
            </div>

            <div className="select">
              <select
                name="language"
                id="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="English">🇺🇸 English</option>
                <option value="Spanish">🇪🇸 Spanish</option>
                <option value="French">🇫🇷 French</option>
                <option value="Hindi">🇮🇳 Hindi</option>
                <option value="Japanese">🇯🇵 Japanese</option>
              </select>
            </div>
          </div>

          <div className="text-container">
            <div className="card text-card">
              <textarea
                className="message"
                name="message"
                placeholder="Type your message in any language..."
                onChange={handleInputChange}
                value={formData.message}
              ></textarea>
            </div>

            <div className="translation card text-card">
              <div className="copy-btn" onClick={handleCopy}>
                <FaCopy color="white" />
              </div>
              {isLoading ? (
                <BeatLoader size={12} color={"white"} />
              ) : (
                <textarea
                  className="translation-msg"
                  name="translation"
                  id="translation"
                  value={translation}
                ></textarea>
              )}
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit">Translate</button>
        </form>

        <button onClick={handleClear}>Clear</button>

        <div className={`notification ${showNotification ? "active" : ""}`}>
          Copied to clipboard!
        </div>
      </div>
    </>
  );
};

export default App;
