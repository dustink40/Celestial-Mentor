import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import celestialmentorLogo from '../assets/celestialmentor-logo.png';

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(output.text);
    setIsGenerating(false);
    handleSpeak(output.text);
  };

  const handleSpeak = (text) => {
    let lines = text.split('\n');
    setIsSpeaking(true);

    lines.forEach((line) => {
      let msg = new SpeechSynthesisUtterance(line);
      msg.rate = 1.3;
      msg.onstart = () => {
        console.log("Speaking:", line);
      };
      msg.onend = () => {
        if (line === lines[lines.length - 1]) {
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.speak(msg);
    });
  };

  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      handleSpeak(apiOutput);
    }
  }, [isSpeaking]);

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>Celestial-Mentor | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>"CosmicGuide AI: Navigating the Universe""</h1>
          </div>
          <div className="header-subtitle">
            <h2>"Embark on a quest through the stars with guidance from our expert AI."</h2>
          </div>
        </div>
        <div className="logo-container">
          <Image src={deckexpertLogo} alt="Your logo" />
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="Hello OWEN, I am Your Celestial-Mentor. Your personal guide into the cosmos!"
            value={userInput}
            onChange={onUserChangedText}
          />

          <div className="prompt-buttons">
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>

          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Answer</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a href="https://buildspace.so/builds/ai-writer" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={celestialmentorLogo} className="balls" alt="Your logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
