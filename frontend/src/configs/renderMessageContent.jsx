import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CodeBlockComponent = ({ lang, code }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-lg shadow-lg" style={{ margin: '1.5rem 0', WebkitOverflowScrolling: 'touch', textAlign: 'left' }}>
      <div
        className="flex items-center justify-between py-2 px-6 border-b min-w-max w-full"
        style={{
          background: isDark ? '#2d2d2d' : '#f0f0f0',
          borderColor: isDark ? '#1e1e1e' : '#ddd',
        }}
      >
        <span style={{ color: isDark ? '#cccccc' : '#555555', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.85rem' }}>
          {lang}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            color: isCopied ? '#4bb74a' : (isDark ? '#cccccc' : '#555555'),
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'color 0.2s',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <SyntaxHighlighter
        language={lang === 'text' ? null : lang}
        style={isDark ? vscDarkPlus : oneLight}
        customStyle={{
          margin: 0,
          padding: '1rem 1.5rem',
          backgroundColor: isDark ? '#1e1e1e' : '#fafafa',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          overflowX: 'auto',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          textAlign: 'left'
        }}
        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" } }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};


export function renderMessageContent(content, isDark) {
  if (!content) return null;

  const elements = [];
  let keyCounter = 0;
  let inlineKeyCounter = 0;

  const parseInline = (str) => {
    if (!str) return str;
    const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/).filter(Boolean);
    return parts.map((part) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={`ic-${inlineKeyCounter++}`} className="wrap-break-words" style={{ background: isDark ? '#2d3139' : '#e8eaed', color: isDark ? '#7dd3fc' : '#0369a1', borderRadius: '4px', padding: '0.15em 0.35em', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.8em', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`ib-${inlineKeyCounter++}`} style={{ fontWeight: 700, color: isDark ? '#ffffff' : '#111827' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={`it-${inlineKeyCounter++}`} className="wrap-break-words">{part}</span>;
    });
  };

  const parseMarkdownText = (text) => {
    const lines = text.split(/\r?\n/);
    const textElements = [];
    let inList = false;
    let listItems = [];
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (/^\s*\|(.+)\|\s*$/.test(line)) {
        inTable = true;
        tableRows.push(line);
        continue;
      }
      if (inTable && !/^\s*\|(.+)\|\s*$/.test(line)) {
        if (tableRows.length >= 2) {
          const header = tableRows[0].split('|').map((c) => c.trim()).filter(Boolean);
          const rows = tableRows.slice(2).map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));
          textElements.push(
            <div key={`table-${keyCounter++}`} className="w-full max-w-full overflow-x-auto" style={{ margin: '1.5em 0', WebkitOverflowScrolling: 'touch', textAlign: 'left' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 'max-content', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: isDark ? '#181a1b' : '#fafafa', color: isDark ? '#e6e6e6' : '#1a1a1a', borderRadius: '8px', overflow: 'hidden', fontSize: '0.92em', textAlign: 'left' }}>
                <thead>
                  <tr>
                    {header.map((cell, idx) => (
                      <th key={idx} style={{ border: isDark ? '1px solid #333' : '1px solid #e5e7eb', padding: '0.6em 1em', background: isDark ? '#23272f' : '#f3f4f6', fontWeight: 700, textAlign: 'left', fontSize: '1.05em', color: isDark ? '#fff' : '#111827' }}>
                        {parseInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ridx) => (
                    <tr key={ridx}>
                      {row.map((cell, cidx) => (
                        <td key={cidx} style={{ border: isDark ? '1px solid #333' : '1px solid #e5e7eb', padding: '0.6em 1em', background: isDark ? (ridx % 2 === 0 ? '#23272f' : '#202124') : (ridx % 2 === 0 ? '#ffffff' : '#f9fafb'), verticalAlign: 'top', color: isDark ? '#e6e6e6' : '#374151', textAlign: 'left' }}>
                          {parseInline(cell)}
                        </td>
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

      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        if (inList) {
          textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.5em', margin: '0.5em 0', textAlign: 'left' }}>{listItems}</ul>);
          inList = false;
          listItems = [];
        }

        const hashCount = headingMatch[1].length;
        const headingText = headingMatch[2];

        let Tag = 'h3';
        let fontSize = '1.2em';

        if (hashCount === 2) {
          Tag = 'h1';
          fontSize = '1.8em';
        } else if (hashCount === 3) {
          Tag = 'h2';
          fontSize = '1.5em';
        } else {
          Tag = `h${Math.min(hashCount, 6)}`;
        }

        textElements.push(
          <Tag key={`h-${keyCounter++}`} style={{ fontWeight: 700, fontSize: fontSize, marginTop: '1.2em', marginBottom: '0.5em', color: isDark ? '#ffffff' : '#111827', wordBreak: 'break-word', textAlign: 'left' }}>
            {parseInline(headingText)}
          </Tag>
        );
        continue;
      }

      if (/^\s*-{3,}\s*$/.test(line)) {
        textElements.push(<hr key={`hr-${keyCounter++}`} style={{ border: 0, borderTop: isDark ? '1px solid #3a3f4b' : '1px solid #e5e7eb', margin: '1.5em 0' }} />);
        continue;
      }

      const isStandardBullet = /^\s*([*-])\s+/.test(line);
      const isBoldBullet = /^\s*\*\*[^*]+\*\*/.test(line);

      if (isStandardBullet || isBoldBullet) {
        inList = true;
        let cleanLine = isStandardBullet ? line.replace(/^\s*([*-])\s+/, '') : line.trim();
        listItems.push(
          <li key={`li-${keyCounter++}`} className="wrap-break-words" style={{ marginBottom: '0.4em', color: isDark ? '#d1d5db' : '#4b5563', lineHeight: '1.6', marginLeft: '0.5em', wordBreak: 'break-word', textAlign: 'left' }}>
            {parseInline(cleanLine)}
          </li>
        );
        continue;
      }

      if (inList && line.trim() !== '') {
        textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.5em', marginBottom: '1.2em', textAlign: 'left' }}>{listItems}</ul>);
        inList = false;
        listItems = [];
      }

      if (line.trim() !== '') {
        textElements.push(
          <p key={`p-${keyCounter++}`} className="wrap-break-words" style={{ margin: '0.6em 0', color: isDark ? '#d1d5db' : '#4b5563', lineHeight: '1.6', wordBreak: 'break-word', textAlign: 'left' }}>
            {parseInline(line)}
          </p>
        );
      }
    }

    if (inList) textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.5em', marginBottom: '1.2em', textAlign: 'left' }}>{listItems}</ul>);
    return textElements;
  };

  const regex = /```([\w]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.slice(lastIndex, match.index);
    if (textBefore.trim()) elements.push(...parseMarkdownText(textBefore));

    const lang = match[1] ? match[1].toLowerCase() : 'text';
    const code = match[2];

    elements.push(
      <CodeBlockComponent key={`codeblock-${keyCounter++}`} lang={lang} code={code} />
    );

    lastIndex = regex.lastIndex;
  }

  const textAfter = content.slice(lastIndex);
  if (textAfter.trim()) elements.push(...parseMarkdownText(textAfter));

  return <div style={{ textAlign: 'left', width: '100%' }}>{elements}</div>;
}