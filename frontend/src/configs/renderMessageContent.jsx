import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const CodeBlockComponent = ({ lang, code }) => {
  const [isCopied, setIsCopied] = useState(false);


  const dedent = (text) => {
    const lines = text.split('\n');
    while (lines.length > 0 && lines[0].trim() === '') lines.shift();
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

    const minIndent = lines.reduce((min, line) => {
      if (line.trim() === '') return min;
      const match = line.match(/^(\s*)/);
      return Math.min(min, match[1].length);
    }, Infinity);

    return lines.map(line => line.slice(minIndent === Infinity ? 0 : minIndent)).join('\n');
  };

  const processedCode = dedent(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedCode);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="group w-full max-w-full overflow-hidden rounded-xl shadow-2xl my-6 border border-gray-200 dark:border-[#2d3238] transition-all duration-300 hover:shadow-accent/5">
      {/* Code Header */}
      <div
        className={`flex items-center justify-between py-2.5 px-5 border-b min-w-max w-full backdrop-blur-md bg-gray-50/80 dark:bg-[#1E2225]/90 border-gray-200 dark:border-[#2d3238]`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
          </div>
          <span className={`font-mono text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 select-none`}>
            {lang || 'text'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 transform active:scale-95 ${isCopied
            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
            : 'bg-white dark:bg-[#2d3238] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 shadow-sm'
            } cursor-pointer`}
        >
          {isCopied ? <Check size={14} className="animate-in fade-in zoom-in duration-300" /> : <Copy size={14} />}
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={lang === 'text' ? null : lang}
          style={vscDarkPlus}
          showLineNumbers={false}

          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#24A5FF',
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '0.8rem'
          }}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1.25rem',
            backgroundColor: '#1E2225',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            overflowX: 'auto',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', monospace",
            textAlign: 'left',
          }}

          codeTagProps={{ style: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', monospace", lineHeight: '1.6', textAlign: 'left' } }}
        >
          {processedCode}
        </SyntaxHighlighter>
      </div>
    </div>

  );
};


export function renderMessageContent(content, isDark) {
  if (!content || !content.trim()) return null;

  const elements = [];
  let keyCounter = 0;
  let inlineKeyCounter = 0;

  const parseInline = (str) => {
    if (!str) return str;

    // More compatible regex without lookbehinds for maximum browser support
    const parts = str.split(/(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\(.+?\\\)|(?:\$[^$]+?\$)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~)/).filter(Boolean);

    return parts.map((part, idx) => {
      const uniqueKey = `${inlineKeyCounter++}-${idx}`;

      // 1. Block Math ($$...$$ or \[...\])
      if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('\\[') && part.endsWith('\\]'))) {
        const math = part.replace(/^(\$\$|\\\[)/, '').replace(/(\$\$|\\\])$/, '').trim();
        if (!math) return part;
        return (
          <div key={`bm-${uniqueKey}`} className="my-6 block w-full overflow-x-auto text-[#111827] dark:text-[#e6e6e6] bg-gray-50/50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
            <BlockMath math={math} />
          </div>
        );
      }

      // 2. Inline Math ($...$ or \(...\))
      if ((part.startsWith('$') && part.endsWith('$')) || (part.startsWith('\\(') && part.endsWith('\\)'))) {
        const math = part.replace(/^(\$|\\\()/, '').replace(/(\$|\\\))$/, '').trim();
        if (!math) return part;
        return (
          <span key={`im-${uniqueKey}`} className="inline-flex items-center text-[#111827] dark:text-[#e6e6e6] mx-0.5 px-1.5 py-0.5 rounded-md bg-gray-100/40 dark:bg-white/10 font-medium border border-transparent hover:border-gray-200/50 dark:hover:border-white/10 transition-all cursor-default select-all">
            <InlineMath math={math} />
          </span>
        );
      }

      // 3. Inline Code (` ... `)
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={`ic-${uniqueKey}`}
            className="wrap-break-words bg-[#f1f5f9] dark:bg-[#2d3139] text-[#0369a1] dark:text-[#7dd3fc] rounded-md px-[0.4em] py-[0.1em] font-['JetBrains_Mono','Fira_Code',monospace] text-[0.85em] border border-slate-200 dark:border-slate-700/50"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // 4. Bold Text (** ... ** or __ ... __)
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        return (
          <strong key={`ib-${uniqueKey}`} className="font-bold text-[#111827] dark:text-white">
            {parseInline(part.slice(2, -2))}
          </strong>
        );
      }

      // 5. Italics (* ... * or _ ... _)
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        return (
          <em key={`ie-${uniqueKey}`} className="italic text-[#374151] dark:text-[#d1d5db]">
            {parseInline(part.slice(1, -1))}
          </em>
        );
      }

      // 6. Strikethrough (~~ ... ~~)
      if (part.startsWith('~~') && part.endsWith('~~')) {
        return (
          <del key={`is-${uniqueKey}`} className="line-through text-gray-500 opacity-70">
            {parseInline(part.slice(2, -2))}
          </del>
        );
      }

      // 7. Standard Text
      return <span key={`it-${uniqueKey}`} className="wrap-break-words">{part}</span>;
    });
  };

  const parseMarkdownText = (text) => {
    const lines = text.split(/\r?\n/);
    const textElements = [];
    let inList = false;
    let listItems = [];
    let inTable = false;
    let tableRows = [];
    let listType = 'ul'; // 'ul' or 'ol'


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
              <table className="border-collapse w-full min-w-max font-['JetBrains_Mono','Fira_Code',monospace] bg-[#fafafa] dark:bg-[#181a1b] text-[#1a1a1a] dark:text-[#e6e6e6] rounded-lg overflow-hidden text-[0.92em] text-left">
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

      // Heading Logic
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        if (inList) {
          const Tag = listType === 'ol' ? 'ol' : 'ul';
          const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
          textElements.push(<Tag key={`list-${keyCounter++}`} className={`pl-[1.5em] my-[0.5em] text-left ${listClass}`}>{listItems}</Tag>);

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

      // Horizontal Rule Logic
      if (/^\s*-{3,}\s*$/.test(line)) {
        textElements.push(<hr key={`hr-${keyCounter++}`} className="border-0 border-t border-[#e5e7eb] dark:border-[#3a3f4b] my-[1.5em]" />);
        continue;
      }

      // List Logic
      const isStandardBullet = /^\s*([*-])\s+/.test(line);
      const isNumberedList = /^\s*\d+\.\s+/.test(line);
      if (isStandardBullet || isNumberedList) {


        const currentType = isNumberedList ? 'ol' : 'ul';

        if (inList && listType !== currentType) {
          const Tag = listType === 'ol' ? 'ol' : 'ul';
          const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
          textElements.push(<Tag key={`list-${keyCounter++}`} className={`pl-[1.5em] mb-[1.2em] text-left ${listClass}`}>{listItems}</Tag>);

          listItems = [];
        }

        inList = true;
        listType = currentType;
        let cleanLine = line.replace(/^\s*([*-]|\d+\.)\s+/, '').trim();

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
        const Tag = listType === 'ol' ? 'ol' : 'ul';
        const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
        textElements.push(<Tag key={`list-${keyCounter++}`} className={`pl-[1.5em] mb-[1.2em] text-left ${listClass}`}>{listItems}</Tag>);

        inList = false;
        listItems = [];
      }


      // Paragraph Logic
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

    if (inList) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
      textElements.push(<Tag key={`list-${keyCounter++}`} className={`pl-[1.5em] mb-[1.2em] text-left ${listClass}`}>{listItems}</Tag>);
    }


    return textElements;
  };

  const regex = /(```[\w]*\n[\s\S]*?```|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.slice(lastIndex, match.index);
    if (textBefore.trim()) elements.push(...parseMarkdownText(textBefore));

    const matchedText = match[0];
    if (matchedText.startsWith('```')) {
      const langMatch = matchedText.match(/^```([\w]*)\n/);
      const lang = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : 'text';
      const code = matchedText.replace(/^```[\w]*\n/, '').replace(/```$/, '');
      elements.push(<CodeBlockComponent key={`codeblock-${keyCounter++}`} lang={lang} code={code} />);
    } else {
      const math = matchedText.replace(/^(\$\$|\\\[)/, '').replace(/(\$\$|\\\])$/, '').trim();
      elements.push(
        <div key={`blockmath-${keyCounter++}`} className="my-6 block w-full overflow-x-auto text-[#111827] dark:text-[#e6e6e6] bg-gray-50/50 dark:bg-[#1E2225]/30 p-6 rounded-xl border border-gray-200 dark:border-[#2d3238] shadow-sm backdrop-blur-sm">
          <BlockMath math={math} />
        </div>
      );
    }
    lastIndex = regex.lastIndex;
  }

  const textAfter = content.slice(lastIndex);
  if (textAfter.trim()) elements.push(...parseMarkdownText(textAfter));

  return <div className="text-left w-full space-y-2">{elements}</div>;
}