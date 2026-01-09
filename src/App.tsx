// src/App.tsx

import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import TerminalWindow from './components/TerminalWindow';
import CanvasBackground from './components/CanvasBackground';
import LandingSection from './components/LandingSection';
import InfoSection from './components/InfoSection';
import { ChatMessage, AnalysisResult } from './types';
import siteConfig from './siteConfig.json';
// CSS imports are now handled in index.tsx, but we rely on classes defined there.

import templates from './data/templates';
import { mockAnalysis } from './data/analysis_mock';
import IntroOverlay from './components/IntroOverlay';
import ArrowOverlay from './components/ArrowOverlay';

function App() {
  // Theme State
  const [activeTheme, setActiveTheme] = useState<'premium' | 'retro' | 'hybrid'>(siteConfig.activeTheme as 'premium' | 'retro' | 'hybrid');
  // @ts-ignore
  const themeConfig = siteConfig.themes[activeTheme];

  // Dynamic Name (overrides theme name if present from template)
  const [dynamicName, setDynamicName] = useState<string | null>(null);

  // State for chat window 
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // State for analysis result
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // State to force re-render of terminal (replay animation)
  const [terminalKey, setTerminalKey] = useState(0);

  // State for suggested message (pre-typed)
  const [suggestedMessage, setSuggestedMessage] = useState<string>("");

  // Keep track of remaining messages in the current template to simulate a flow
  const [remainingTemplateMessages, setRemainingTemplateMessages] = useState<any[]>([]);

  // function to load chat history from local templates
  const loadChatHistory = (id: string | null, isTemplate: boolean = false) => {
    const templateKey = id || "example";
    const template = templates[templateKey] || templates["example"];

    if (template) {
      if (template.name) {
        setDynamicName(template.name);
      }

      const allMessages = template.messages || [];
      // Start at 50%
      let cutoff = Math.floor(allMessages.length / 2);

      // Ensure we stop AT a user message (so we can suggest it)
      // If the message at cutoff is 'assistant', include it in history and move forward
      while (cutoff < allMessages.length && allMessages[cutoff].role !== 'user') {
        cutoff++;
      }

      const loadedMessages = allMessages.slice(0, cutoff).map((msg: any, idx: number) => ({
        id: `msg-${Date.now()}-${idx}`,
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toLocaleTimeString()
      }));

      setChatMessages(loadedMessages);

      // The next one is likely a user message (or we hit end)
      const remaining = allMessages.slice(cutoff);

      if (remaining.length > 0 && remaining[0].role === 'user') {
        setSuggestedMessage(remaining[0].content);
        // The remaining queue starts AFTER this user message
        setRemainingTemplateMessages(remaining.slice(1));
      } else {
        // If we hit end or it's weird, just empty
        setSuggestedMessage("");
        setRemainingTemplateMessages([]);
        // If there are remaining bot messages because we ran off end? (Unlikely due to loop)
        if (remaining.length > 0) {
          // Auto-play the rest if they are bot?
          processNextMessages(remaining);
        }
      }

      setAnalysisResult(template.analysis || mockAnalysis);
      // Force terminal update
      setTerminalKey(prev => prev + 1);
    }
  };

  // Helper to process the queue of future messages
  const processNextMessages = (queue: any[]) => {
    if (queue.length === 0) {
      setSuggestedMessage("");
      setRemainingTemplateMessages([]);
      return;
    }

    const next = queue[0];
    if (next.role === 'assistant') {
      // Delay to simulate typing/thinking
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}-${Math.random()}`,
          content: next.content,
          role: 'bot', // App uses 'bot' for assistant
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, botMsg]);

        // Force terminal update
        setTerminalKey(prev => prev + 1);

        // Recurse
        processNextMessages(queue.slice(1));
      }, 1000 + Math.random() * 500); // 1-1.5s delay
    } else {
      // It is a user message. Suggest it and stop.
      // We set remaining messages to be AFTER this one
      setSuggestedMessage(next.content);
      setRemainingTemplateMessages(queue.slice(1));
    }
  };

  const handleUserMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      content: text,
      role: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Force terminal update
    setTerminalKey(prev => prev + 1);

    // Clear suggestion temporarily (will be reset if next is user)
    setSuggestedMessage("");

    // Trigger bot flow
    processNextMessages(remainingTemplateMessages);
  };

  // --- Load the user's chat when the app first starts ---
  useEffect(() => {
    // Load default example on start
    loadChatHistory("example", true);
  }, []);

  // pass new analysis to terminalwindow.
  const updateAnalysis = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  // Switch theme handler
  const toggleTheme = () => {
    setActiveTheme(prev => {
      if (prev === 'premium') return 'retro';
      if (prev === 'retro') return 'hybrid';
      return 'premium';
    });
  };

  // Get current config
  // themeConfig is defined at top now
  const themeClasses = `App ${themeConfig.styles.layout} ${themeConfig.styles.chat} ${themeConfig.styles.terminal}`;

  return (
    <div className={themeClasses} style={{ position: 'relative' }}>
      <IntroOverlay theme={activeTheme} />
      <ArrowOverlay theme={activeTheme} color={themeConfig.intro.fontColor} />
      <CanvasBackground theme={activeTheme} />
      <LandingSection themeConfig={themeConfig} />

      {/* Absolute Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '8px 16px',
          borderRadius: '20px',
          background: activeTheme === 'premium' ? 'rgba(255,255,255,0.1)' : '#00AAAA',
          color: activeTheme === 'premium' ? 'white' : 'black',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          fontFamily: activeTheme === 'premium' ? 'Inter' : 'Courier New',
          fontWeight: 'bold',
          border: activeTheme === 'premium' ? '1px solid rgba(255,255,255,0.2)' : '2px solid black'
        }}
      >
        {activeTheme === 'premium' ? 'SWITCH TO RETRO' : activeTheme === 'retro' ? 'SWITCH TO WHATSAPP' : 'SWITCH TO PREMIUM'}
      </button>

      <div id="app-content" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <div className="main-layout">
          {/* Chat Selector moved to ChatWindow Header */}

          <div className="chat-column">
            <ChatWindow
              messages={chatMessages}
              setMessages={setChatMessages}
              updateAnalysis={updateAnalysis}
              loadChat={loadChatHistory}
              // @ts-ignore
              chatPartnerName={dynamicName || themeConfig.chatPartnerName || "AI Assistant"}
              suggestedMessage={suggestedMessage}
              onSend={handleUserMessage}
              availableTemplates={Object.keys(templates).filter(k => k !== 'example')}
            />
          </div>

          <div className="terminal-column">
            {/* Pass the new state object and key to force reset */}
            <TerminalWindow key={terminalKey} analysis={analysisResult} />
          </div>
        </div>

        {/* Info Section positioned below the main interaction area */}
        <InfoSection themeConfig={themeConfig} />
      </div>
    </div>
  );
}

export default App;