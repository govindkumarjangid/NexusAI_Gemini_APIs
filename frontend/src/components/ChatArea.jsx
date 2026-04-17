import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Mic, Sparkles, User, Plus, ArrowUp, FolderUp, SquareChevronRight, Check } from 'lucide-react';
import logo from '/nexusai-logo.svg';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import useMessageStore from '../store/useMessageStore';
import { useParams } from 'react-router-dom';

const ChatArea = () => {

  const [messages, setMessages] = useState([]);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const { isMobile, sidebarOpen, setSidebarOpen, user } = useAuthStore();
  const { currentChat, setCurrentChat, chats, createChat } = useChatStore();
  const { sendAndStreamMessage } = useMessageStore();
  const { chatId } = useParams();

  const textareaRef = useRef(null);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId && chats && chats.length > 0) {
      const found = chats.find(c => c._id === chatId);
      if (found) setCurrentChat(found);
    }
  }, [chatId, chats]);

  useEffect(() => {
    if (currentChat && currentChat.messages) {
      setMessages(currentChat.messages.map((msg, idx) => ({
        ...msg,
        id: msg._id || idx
      })));
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsAddMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let chat_id = currentChat?._id;
    let chatJustCreated = false;
    const userMessage = inputText;
    setInputText("");

    // If no chat exists, create one first
    if (!chat_id && user) {
      await createChat({ userId: user.id || user._id });
      chat_id = useChatStore.getState().currentChat?._id;
      // Refresh chat list in sidebar
      if (user.id || user._id) {
        const { getChatsByUser } = useChatStore.getState();
        await getChatsByUser(user.id || user._id);
      }
      chatJustCreated = true;
    }

    // Optimistically update local and global state
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
    setIsStreaming(true);

    // Also update Zustand global state for currentChat
    if (currentChat) {
      setCurrentChat({
        ...currentChat,
        messages: [
          ...(currentChat.messages || []),
          { role: 'user', content: userMessage },
          { role: 'assistant', content: "" }
        ]
      });
    }

    await sendAndStreamMessage({
      chatId: chat_id,
      content: userMessage,
      onStream: (text) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex].content += text;
          return newMessages;
        });
      },
      onDone: () => setIsStreaming(false)
    });
  };

  function renderMessageContent(content) {
    if (!content) return null;

    const elements = [];
    let keyCounter = 0;

    // 1. Helper: Markdown Text Parser (Khud text ko filter aur design karega)
    const parseMarkdownText = (text) => {
      // Replace all backticks with single quotes (except in code blocks)
      const lines = text.replace(/`([^`]+)`/g, "'$1'").split(/\r?\n/);
      const textElements = [];
      let inList = false;
      let listItems = [];
      let inTable = false;
      let tableRows = [];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];


        // Handle H2 Headings (####)
        if (/^####\s+/.test(line)) {
          if (inList) { textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.2em' }}>{listItems}</ul>); inList = false; listItems = []; }
          textElements.push(
            <h2 key={`h2-${keyCounter++}`} style={{ fontWeight: 700, fontSize: '1.25em', marginTop: '1em', marginBottom: '0.5em', color: '#fff' }}>
              {line.replace(/^####\s+/, '')}
            </h2>
          );
          continue;
        }

        // Horizontal rule (---)
        if (/^\s*-{3,}\s*$/.test(line)) {
          textElements.push(<hr key={`hr-${keyCounter++}`} style={{ border: 0, borderTop: '1.5px solid #333', margin: '1em 0' }} />);
          continue;
        }
        // Table row detection
        if (/^\s*\|(.+)\|\s*$/.test(line)) {
          inTable = true;
          tableRows.push(line);
          continue;
        }
        if (inTable && !/^\s*\|(.+)\|\s*$/.test(line)) {
          // End of table, render it
          if (tableRows.length >= 2) {
            const header = tableRows[0].split('|').map(cell => cell.trim()).filter(Boolean);
            const aligns = tableRows[1].split('|').map(cell => cell.trim()).filter(Boolean);
            const rows = tableRows.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
            textElements.push(
              <div key={`table-${keyCounter++}`} style={{ overflowX: 'auto', margin: '1em 0' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: '#181a1b', color: '#e6e6e6', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      {header.map((cell, idx) => (
                        <th key={idx} style={{ border: '1px solid #333', padding: '0.5em 1em', background: '#23272f', fontWeight: 700, textAlign: 'left' }}>{parseMarkdownTableCell(cell)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, ridx) => (
                      <tr key={ridx}>
                        {row.map((cell, cidx) => (
                          <td key={cidx} style={{ border: '1px solid #333', padding: '0.5em 1em', background: ridx % 2 === 0 ? '#23272f' : '#202124', verticalAlign: 'top' }}>{parseMarkdownTableCell(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          inTable = false;
          tableRows = [];
        }
        if (inTable) continue;
        // Helper to render markdown inside table cells (bold, code, etc.)
        function parseMarkdownTableCell(cell) {
          // Only bold (**text**) and inline code (`code`)
          const boldRegex = /\*\*([^*]+)\*\*/g;
          const codeRegex = /`([^`]+)`/g;
          let result = [];
          let lastIdx = 0;
          let match;
          let key = 0;
          let working = cell;
          // Handle bold
          while ((match = boldRegex.exec(working)) !== null) {
            if (match.index > lastIdx) result.push(working.slice(lastIdx, match.index));
            result.push(<strong key={'b' + key++} style={{ fontWeight: 600, color: '#fff' }}>{match[1]}</strong>);
            lastIdx = match.index + match[0].length;
          }
          if (lastIdx < working.length) result.push(working.slice(lastIdx));
          // Now handle code
          let final = [];
          lastIdx = 0;
          for (let i = 0; i < result.length; i++) {
            if (typeof result[i] === 'string') {
              let str = result[i];
              let codeMatch;
              let last = 0;
              while ((codeMatch = codeRegex.exec(str)) !== null) {
                if (codeMatch.index > last) final.push(str.slice(last, codeMatch.index));
                final.push(<code key={'c' + key++} style={{ background: '#23272f', color: '#7dd3fc', borderRadius: '4px', padding: '0.1em 0.3em', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.97em' }}>{codeMatch[1]}</code>);
                last = codeMatch.index + codeMatch[0].length;
              }
              if (last < str.length) final.push(str.slice(last));
            } else {
              final.push(result[i]);
            }
          }
          return final;
        }

        // Handle Headings (###)
        if (/^###\s+/.test(line)) {
          if (inList) { textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.2em' }}>{listItems}</ul>); inList = false; listItems = []; }
          textElements.push(
            <h3 key={`h3-${keyCounter++}`} style={{ fontWeight: 600, fontSize: '1.15em', marginTop: '1em', marginBottom: '0.5em', color: '#ffffff' }}>
              {line.replace(/^###\s+/, '')}
            </h3>
          );
          continue;
        }

        // Handle Lists (* or -)
        if (/^\s*([*-])\s+/.test(line)) {
          inList = true;
          listItems.push(
            <li key={`li-${keyCounter++}`} style={{ marginBottom: '0.2em', color: '#e5e7eb', lineHeight: '1.6' }}>
              {line.replace(/^\s*([*-])\s+/, '')}
            </li>
          );
          continue;
        }

        if (inList && !/^\s*([*-])\s+/.test(line)) {
          textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.2em', marginBottom: '0.5em' }}>{listItems}</ul>);
          inList = false;
          listItems = [];
        }

        // If line starts with ** and ends with **: treat as bold heading
        if (/^\*\*[^*]+\*\*/.test(line.trim())) {
          const headingText = line.trim().replace(/^\*\*([^*]+)\*\*:?\s*/, '$1').replace(/\*\*$/, '');
          textElements.push(
            <div key={`boldheading-${keyCounter++}`} style={{ fontWeight: 700, color: '#fff', fontSize: '1.08em', margin: '0.5em 0 0.2em 0' }}>{headingText}</div>
          );
          continue;
        }

        // Handle Bold (**text**) inside line
        let bolded = [];
        let lastIdx = 0;
        let boldMatch;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        while ((boldMatch = boldRegex.exec(line)) !== null) {
          if (boldMatch.index > lastIdx) bolded.push(line.slice(lastIdx, boldMatch.index));
          bolded.push(<strong key={`b-${keyCounter++}`} style={{ fontWeight: 600, color: '#ffffff' }}>{boldMatch[1]}</strong>);
          lastIdx = boldMatch.index + boldMatch[0].length;
        }
        if (lastIdx < line.length) bolded.push(line.slice(lastIdx));

        // Normal Text
        if (bolded.length > 0 || line.trim() !== '') {
          textElements.push(
            <p key={`p-${keyCounter++}`} style={{ margin: '0.5em 0', color: '#d1d5db', lineHeight: '1.6' }}>
              {bolded.length > 0 ? bolded : line}
            </p>
          );
        }
      }
      if (inList) textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.2em' }}>{listItems}</ul>);
      // Table at end of text
      if (inTable && tableRows.length >= 2) {
        const header = tableRows[0].split('|').map(cell => cell.trim()).filter(Boolean);
        const aligns = tableRows[1].split('|').map(cell => cell.trim()).filter(Boolean);
        const rows = tableRows.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
        textElements.push(
          <div key={`table-${keyCounter++}`} style={{ overflowX: 'auto', margin: '1em 0' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: '#181a1b', color: '#e6e6e6', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  {header.map((cell, idx) => (
                    <th key={idx} style={{ border: '1px solid #333', padding: '0.5em 1em', background: '#23272f', fontWeight: 700 }}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ridx) => (
                  <tr key={ridx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx} style={{ border: '1px solid #333', padding: '0.5em 1em', background: ridx % 2 === 0 ? '#23272f' : '#202124' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return textElements;
    };

    // 2. Main Parser: Extract Code Blocks and merge everything
    const regex = /```([\w]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // A. Pehle code se upar ka normal text daalo
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore.trim()) elements.push(...parseMarkdownText(textBefore));

      // B. Ab Code Block ko filter karke VS Code style me daalo
      const lang = match[1] ? match[1].toLowerCase() : 'text';
      const code = match[2];

      elements.push(
        <div key={`codeblock-${keyCounter++}`} style={{ margin: '1.2rem 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          {/* VS Code Style Header + Copy Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#2d2d2d', padding: '0.4rem 1rem', borderBottom: '1px solid #1e1e1e' }}>
            <span style={{ color: '#cccccc', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.85rem' }}>{lang}</span>
            <button
              onClick={(e) => {
                navigator.clipboard.writeText(code);
                const btn = e.currentTarget;
                btn.innerText = 'Copied!';
                btn.style.color = '#4bb74a'; // Green on copy
                setTimeout(() => { btn.innerText = 'Copy'; btn.style.color = '#cccccc'; }, 2000);
              }}
              style={{ background: 'transparent', color: '#cccccc', border: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.2s', fontWeight: 500 }}
            >
              Copy
            </button>
          </div>

          <SyntaxHighlighter
            language={lang === 'text' ? null : lang}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              backgroundColor: '#1e1e1e',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace" // Container font
            }}
            codeTagProps={{
              style: {
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace" // Code text font override
              }
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = regex.lastIndex;
    }

    // C. Aakhri bacha hua text daalo (Code block ke baad ka)
    const textAfter = content.slice(lastIndex);
    if (textAfter.trim()) elements.push(...parseMarkdownText(textAfter));

    return elements;
  }


  return (
    <div className="flex-1 flex flex-col h-screen bg-[#131314]">

      {/* Top Navbar */}
      <header className="h-14 flex items-center justify-between px-3 sm:px-4 border-b border-gray-700/40 sticky top-0 z-20 bg-[#131314]">
        <div className="flex items-center gap-3">
          {isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-0 sm:p-2 hover:text-gray-200 rounded-full text-gray-400 transition-colors cursor-pointer"
            >
              <SquareChevronRight size={22} />
            </button>
          )}
          <img src={logo} alt="NexusAI Logo" className="w-8 h-8 rounded-full shadow-lg" />
          <h1 className="font-semibold text-lg text-gray-200">NexusAI</h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg uppercase">
              {user.name?.[0] || '?'}
            </div>
            <span className="text-gray-200 hidden sm:flex font-normal text-base max-w-30 truncate">{user.name || 'User'}</span>
          </div>
        )}
      </header>


      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {(!currentChat || messages.length === 0) ? (
            <div className="flex flex-col items-start justify-end h-80 text-center text-gray-400 select-none">
              <div className="text-2xl font-semibold mb-2">Hi {user?.name || user?.username || 'Govind kumar'}</div>
              <div className="text-3xl">Where should we start?</div>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 sm:w-10 sm:h-10 ${msg.role === 'user'
                    ? 'bg-gray-800 text-gray-300 hidden sm:flex'
                    : 'bg-linear-to-br from-blue-500 to-purple-600 text-white'
                    }`}
                >
                  {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[90%] sm:max-w-[80%] ${msg.role === 'user'
                    ? 'bg-[#2d2f31] text-gray-100 rounded-3xl rounded-tr-sm px-5 py-1 shadow-sm'
                    : 'text-gray-200 px-2 py-2 sm:px-4 sm:py-3 leading-relaxed'
                    }`}
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words" >
                    {renderMessageContent(msg.content || msg.text)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-linear-to-t from-[#131314] to-transparent pt-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="flex flex-col bg-[#1e1f20] border border-gray-700/60 rounded-3xl px-2 py-2 shadow-sm focus-within:border-gray-600 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows="1"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Ask NexusAI anything..."
              className="w-full max-h-62.5 min-h-12.5 bg-transparent text-gray-100 placeholder-gray-500 px-4 py-3 focus:outline-none resize-none overflow-y-auto custom-scrollbar"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />

            <div className="flex items-center justify-between mt-1 px-2 pb-1 relative">
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className={`p-2 rounded-full transition-colors ${isAddMenuOpen ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 text-gray-400'
                    }`}
                >
                  <Plus size={22} className={`transition-transform duration-200 active:scale-95 cursor-pointer ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAddMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 100, scale: 0 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 100, scale: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-3 w-48 bg-[#2d2f31] border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden z-50 p-2 text-sm font-semibold"
                    >
                      <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left rounded-xl cursor-pointer">
                        <Image size={18} className="text-gray-400" />
                        <span>Upload Image</span>
                      </button>
                      <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left rounded-xl cursor-pointer">
                        <FolderUp size={18} className="text-gray-400" />
                        <span>Upload File</span>
                      </button>
                      <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left border-t border-gray-700/50 mt-1 pt-3 rounded-xl cursor-pointer">
                        <Mic size={18} className="text-gray-400" />
                        <span>Voice Input</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-[#2563eb] hover:bg-blue-500 disabled:bg-[#2d2f31] disabled:text-gray-500 text-white rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <ArrowUp size={20} />
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-xs text-gray-500 mt-3 hidden sm:block">
            NexusAI may produce inaccurate information about people, places, or facts.
          </p>
        </div>

      </div>
    </div>
  );
}

export default ChatArea;