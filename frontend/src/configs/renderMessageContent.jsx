import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React from 'react';

export function renderMessageContent(content) {
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
          <code key={`ic-${inlineKeyCounter++}`} className="wrap-break-words" style={{ background: '#2d3139', color: '#7dd3fc', borderRadius: '4px', padding: '0.15em 0.35em', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.9em', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`ib-${inlineKeyCounter++}`} style={{ fontWeight: 600, color: '#ffffff' }}>
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
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 'max-content', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: '#181a1b', color: '#e6e6e6', borderRadius: '8px', overflow: 'hidden', fontSize: '0.92em' }}>
                <thead>
                  <tr>
                    {header.map((cell, idx) => (
                      <th key={idx} style={{ border: '1px solid #333', padding: '0.6em 1em', background: '#23272f', fontWeight: 700, textAlign: 'left', fontSize: '1.05em', color: '#fff' }}>
                        {parseInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ridx) => (
                    <tr key={ridx}>
                      {row.map((cell, cidx) => (
                        <td key={cidx} style={{ border: '1px solid #333', padding: '0.6em 1em', background: ridx % 2 === 0 ? '#23272f' : '#202124', verticalAlign: 'top', color: '#e6e6e6', textAlign: 'left' }}>
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

      if (/^#{3,4}\s+/.test(line)) {
        if (inList) {
          textElements.push(<ul key={`ul-${keyCounter++}`} style={{ paddingLeft: '1.2em', margin: '0.5em 0', textAlign: 'left' }}>{listItems}</ul>);
          inList = false;
          listItems = [];
        }
        textElements.push(
          <h3 key={`h-${keyCounter++}`} style={{ fontWeight: 600, fontSize: '1.2em', marginTop: '1.2em', marginBottom: '0.5em', color: '#ffffff', wordBreak: 'break-word', textAlign: 'left' }}>
            {parseInline(line.replace(/^#{3,4}\s+/, ''))}
          </h3>
        );
        continue;
      }

      if (/^\s*-{3,}\s*$/.test(line)) {
        textElements.push(<hr key={`hr-${keyCounter++}`} style={{ border: 0, borderTop: '1px solid #3a3f4b', margin: '1.5em 0' }} />);
        continue;
      }

      const isStandardBullet = /^\s*([*-])\s+/.test(line);
      const isBoldBullet = /^\s*\*\*[^*]+\*\*/.test(line);

      if (isStandardBullet || isBoldBullet) {
        inList = true;
        let cleanLine = isStandardBullet ? line.replace(/^\s*([*-])\s+/, '') : line.trim();
        listItems.push(
          <li key={`li-${keyCounter++}`} className="wrap-break-words" style={{ marginBottom: '0.4em', color: '#d1d5db', lineHeight: '1.6', marginLeft: '0.5em', wordBreak: 'break-word', textAlign: 'left' }}>
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
          <p key={`p-${keyCounter++}`} className="wrap-break-words" style={{ margin: '0.6em 0', color: '#d1d5db', lineHeight: '1.6', wordBreak: 'break-word', textAlign: 'left' }}>
            {parseInline(line)}
          </p>
        );
      }
    }

    if (inList) textElements.push(<ul key={`ul-${keyCounter++}`} style={{ marginBottom: '1.2em', textAlign: 'left' }}>{listItems}</ul>);
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
      <div key={`codeblock-${keyCounter++}`} className="w-full max-w-full overflow-x-auto rounded-lg shadow-lg" style={{ margin: '1.5rem 0', WebkitOverflowScrolling: 'touch', textAlign: 'left' }}>
        <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 border-b border-[#1e1e1e] min-w-max w-full">
          <span style={{ color: '#cccccc', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.85rem' }}>{lang}</span>
          <button
            onClick={(e) => {
              navigator.clipboard.writeText(code);
              const btn = e.currentTarget;
              btn.innerText = 'Copied!';
              btn.style.color = '#4bb74a';
              setTimeout(() => { btn.innerText = 'Copy'; btn.style.color = '#cccccc'; }, 2000);
            }}
            style={{ background: 'transparent', color: '#cccccc', border: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.2s', fontWeight: 500, marginLeft: 'auto' }}
          >
            Copy
          </button>
        </div>

        <SyntaxHighlighter
          language={lang === 'text' ? null : lang}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1rem', backgroundColor: '#1e1e1e', fontSize: '0.9rem', lineHeight: '1.5', overflowX: 'auto', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", textAlign: 'left' }}
          codeTagProps={{ style: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" } }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    );
    lastIndex = regex.lastIndex;
  }

  const textAfter = content.slice(lastIndex);
  if (textAfter.trim()) elements.push(...parseMarkdownText(textAfter));

  return elements;
}