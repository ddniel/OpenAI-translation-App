import React, { useState } from "react";
import "./App.css";
import OpenAI from 'openai';
import { BeatLoader } from "react-spinners";
import { FaCopy } from "react-icons/fa";


const App = () => {
  const [formData, setFormData] = useState({ language: "Hindi", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true // This is the default and can be omitted
  });


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };
  const translate = async () => {
    const { language, message } = formData;
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `Translate this into ${language}: ${message}` }],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    });
    console.log(response)
    console.log(response.choices)
    const translatedText = response.choices[0].message.content.trim();
    setIsLoading(false);
    setTranslation(translatedText);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    translate();
  };

  const handleCopy = () => {
    
    if(translation){
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
    setFormData({...formData, message: ""})
    setTranslation('')
  }

  return (
    <>
    
    <nav>
      <h1>Translation App</h1>
    </nav>
    
    <div className="container">

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <select name="language" id="language" value={formData.language} onChange={handleInputChange}>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Hindi">Hindi</option>
            <option value="Japanese">Japanese</option>

          </select>
        </div>

        <div className="text-container">
      
          <div className="card text-card">
            <textarea className="message"
                name="message"
                placeholder="Type your message in any language..."
                onChange={handleInputChange}
                value={formData.message}
              ></textarea>
          </div>
        

          <div className="translation card text-card">
            <div className="copy-btn" onClick={handleCopy}>
              <FaCopy color="white"/>
            </div>
            {isLoading ? <BeatLoader size={12} color={"white"} /> : <textarea className="translation-msg" name="translation" id="translation" value={translation}></textarea> }
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
