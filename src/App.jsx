import React, { useState, version } from "react";
import "./App.css";
import { BeatLoader } from "react-spinners";
import { FaCopy } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [formData, setFormData] = useState({
    action: "translate",
    language: "Spanish",
    message: "",
    version: "gpt-3.5-turbo",
    model: "ChatGPT",
  });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleModelChange = (e) => {
    const ver = {
      ChatGPT: "gpt-3.5-turbo",
      Gemini: "gemini-1.5-flash",
      Deepl: "Default",
    };

    setFormData({
      ...formData,
      model: e.target.value,
      version: ver[e.target.value],
    });
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
      const response = await fetch(`${API_URL}/translations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData.toString(),
      });

      const data = await response.json();
      console.log(data.result);

      setTranslation(data.result);
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
                onChange={handleModelChange}
              >
                <option value="ChatGPT">ChatGPT</option>
                <option value="Gemini">Gemini</option>
                <option value="Deepl">Deepl</option>
              </select>
            </div>

            {formData.model === "ChatGPT" && (
              <div className="select">
                <select
                  name="version"
                  id="version"
                  value="gpt-3.5-turbo"
                  onChange={handleInputChange}
                >
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  <option value="gpt-4">gpt-4</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="gpt-4o">gpt-4o</option>
                </select>
              </div>
            )}
            {formData.model === "Gemini" && (
              <div className="select">
                <select
                  name="version"
                  id="version"
                  onChange={handleInputChange}
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                </select>
              </div>
            )}
            {formData.model === "Deepl" && (
              <div className="select">
                <select
                  name="version"
                  id="version"
                  value="Default"
                  onChange={handleInputChange}
                >
                  <option value="Default">Default</option>
                </select>
              </div>
            )}

            <div className="select">
              <select
                name="action"
                id="action"
                defaultValue="Default"
                value={formData.action}
                onChange={handleInputChange}
              >
                <option value="translate">💬 Translate</option>
                {formData.model !== "Deepl" && (
                  <>
                    <option value="synonyms">👥 Synonyms</option>
                    <option value="grammar">✅ Grammar Check</option>
                  </>
                )}
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
                {formData.model !== "Deepl" && (
                  <option value="Hindi">🇮🇳 Hindi</option>
                )}
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
