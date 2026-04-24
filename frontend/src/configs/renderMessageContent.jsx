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
    <div className="w-full max-w-full overflow-x-auto rounded-lg shadow-lg my-6 text-left">
      <div
        className={`flex items-center justify-between py-2 px-6 border-b min-w-max w-full bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-900`}
      >
        <span className={`font-mono text-xs text-gray-600 dark:text-gray-300`}>
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 font-medium text-xs transition-colors ${isCopied ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'} bg-transparent border-0 cursor-pointer`}
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
          <code
            key={`ic-${inlineKeyCounter++}`}
            className="wrap-break-words bg-[#e8eaed] dark:bg-[#2d3139] text-[#0369a1] dark:text-[#7dd3fc] rounded-[4px] px-[0.35em] py-[0.15em] font-['JetBrains_Mono','Fira_Code',monospace] text-[0.8em] wrap-break-words whitespace-pre-wrap"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={`ib-${inlineKeyCounter++}`}
            className="font-bold text-[#111827] dark:text-white"
          >
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
            <div
              key={`table-${keyCounter++}`}
              className="w-full max-w-full overflow-x-auto my-[1.5em] text-left touch-pan-x"
            >
              <table className="border-collapse w-full min-w-max font-['JetBrains_Mono','Fira_Code',monospace] bg-[#fafafa] dark:bg-[#181a1b] text-[#1a1a1a] dark:text-[#e6e6e6] rounded-[8px] overflow-hidden text-[0.92em] text-left">
                <thead>
                  <tr>
                    {header.map((cell, idx) => (
                      <th
                        key={idx}
                        className="border border-[#e5e7eb] dark:border-[#333] px-[1em] py-[0.6em] bg-[#f3f4f6] dark:bg-[#23272f] font-bold text-left text-[1.05em] text-[#111827] dark:text-white"
                      >
                        {parseInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ridx) => (
                    <tr key={ridx}>
                      {row.map((cell, cidx) => (
                        <td
                          key={cidx}
                          className={`border border-[#e5e7eb] dark:border-[#333] px-[1em] py-[0.6em] ${ridx % 2 === 0 ? 'bg-white dark:bg-[#23272f]' : 'bg-[#f9fafb] dark:bg-[#202124]'} align-top text-[#374151] dark:text-[#e6e6e6] text-left`}
                        >
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
          textElements.push(<ul key={`ul-${keyCounter++}`} className="pl-[1.5em] my-[0.5em] text-left">{listItems}</ul>);
          inList = false;
          listItems = [];
        }

        const hashCount = headingMatch[1].length;
        const headingText = headingMatch[2];

        let Tag = 'h3';
        let tailwindFontSize = 'text-xl';

        if (hashCount === 2) {
          Tag = 'h1';
          tailwindFontSize = 'text-3xl';
        } else if (hashCount === 3) {
          Tag = 'h2';
          tailwindFontSize = 'text-2xl';
        } else if (hashCount === 1) {
          Tag = 'h1';
          tailwindFontSize = 'text-4xl';
        }

        textElements.push(
          <Tag
            key={`h-${keyCounter++}`}
            className={`font-bold ${tailwindFontSize} mt-[1.2em] mb-[0.5em] text-[#111827] dark:text-white wrap-break-words text-left`}
          >
            {parseInline(headingText)}
          </Tag>
        );
        continue;
      }

      if (/^\s*-{3,}\s*$/.test(line)) {
        textElements.push(<hr key={`hr-${keyCounter++}`} className="border-0 border-t border-[#e5e7eb] dark:border-[#3a3f4b] my-[1.5em]" />);
        continue;
      }

      const isStandardBullet = /^\s*([*-])\s+/.test(line);
      const isBoldBullet = /^\s*\*\*[^*]+\*\*/.test(line);

      if (isStandardBullet || isBoldBullet) {
        inList = true;
        let cleanLine = isStandardBullet ? line.replace(/^\s*([*-])\s+/, '') : line.trim();
        listItems.push(
          <li
            key={`li-${keyCounter++}`}
            className="wrap-break-words mb-[0.4em] text-[#4b5563] dark:text-[#d1d5db] leading-[1.6] ml-[0.5em] wrap-break-words text-left"
          >
            {parseInline(cleanLine)}
          </li>
        );
        continue;
      }

      if (inList && line.trim() !== '') {
        textElements.push(<ul key={`ul-${keyCounter++}`} className="pl-[1.5em] mb-[1.2em] text-left">{listItems}</ul>);
        inList = false;
        listItems = [];
      }

      if (line.trim() !== '') {
        textElements.push(
          <p
            key={`p-${keyCounter++}`}
            className="wrap-break-words my-[0.6em] text-[#4b5563] dark:text-[#d1d5db] leading-[1.6] wrap-break-words text-left"
          >
            {parseInline(line)}
          </p>
        );
      }
    }

    if (inList) textElements.push(<ul key={`ul-${keyCounter++}`} className="pl-[1.5em] mb-[1.2em] text-left">{listItems}</ul>);
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

  return <div className="text-left w-full">{elements}</div>;
}