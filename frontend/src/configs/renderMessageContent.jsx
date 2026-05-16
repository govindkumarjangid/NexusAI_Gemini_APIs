import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import "katex/dist/katex.min.css";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

function CodeBlock({ language, value, isDark }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={`my-4 overflow-hidden rounded-2xl border shadow-lg ${isDark
        ? "border-[#2d3238] bg-[#1E1E1E]"
        : "border-gray-200 bg-white"
        }`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2 ${isDark
          ? "border-[#2d3238] bg-[#1a1d21]"
          : "border-gray-200 bg-gray-50"
          }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>

          <span
            className={`text-[11px] uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {language || "text"}
          </span>
        </div>

        <button
          onClick={copyCode}
          className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-all ${isDark
            ? "border-[#3b4048] bg-[#2a2f36] text-gray-300 hover:bg-[#343a43]"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* CODE */}
      <SyntaxHighlighter
        language={language}
        style={isDark ? vscDarkPlus : oneLight}
        customStyle={{
          margin: 0,
          padding: "18px",
          fontSize: "16px",
          lineHeight: "1.4",
          overflowX: "auto",
          fontWeight: 600,
          background: isDark ? "#1E1E1E" : "#ffffff",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function RenderMessage({ content, isDark = true }) {
  if (!content?.trim()) return null;

  const cleanContent = useMemo(() => {
    return (
      content
        .trim()
        .replace(/\\\[/g, "$$")
        .replace(/\\\]/g, "$$")
        .replace(/\\\(/g, "$")
        .replace(/\\\)/g, "$")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\\\$/g, "$")
        .replace(/\n\s*\*\s*\n/g, "\n")
        .replace(/```([\s\S]*?)```/g, (match, p1) => {
          const text = p1.trim();

          if (
            /^[a-zA-Z0-9\s=+\-*/^().\\α-ωΑ-Ω]+$/.test(text) &&
            text.length < 80
          ) {
            return `$$${text}$$`;
          }

          return match;
        })
    );
  }, [content]);

  return (
    <div
      className={`ai-markdown w-full max-w-none text-[15px] leading-5 ${isDark ? "text-gray-300" : "text-gray-700"
        }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false }]]}
        components={{

          code({ className, children, node, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");

            const isInline = node?.position?.start?.line === node?.position?.end?.line && !match;

            if (isInline || !match && !String(children).includes("\n")) {
              return (
                <code
                  {...rest}
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[0.9em] ${isDark
                    ? "bg-[#2b313a] text-[#7dd3fc]"
                    : "bg-gray-100 text-sky-700"
                    }`}
                >
                  {children}
                </code>
              );
            }

            // BLOCK CODE
            return (
              <CodeBlock
                language={match?.[1] || "text"}
                value={String(children).replace(/\n$/, "")}
                isDark={isDark}
              />
            );
          },

          // HEADINGS
          h1: ({ children }) => (
            <h1
              className={`md:text-4xl text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2
              className={` md:text-3xl text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3
              className={` md:text-2xl text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4
              className={`md:text-xl text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {children}
            </h4>
          ),

          // PARAGRAPH
          p: ({ children }) => (
            <p className="leading-5">
             🧠 {children}
            </p>
          ),

          // LISTS
          ul: ({ children }) => (
            <ul className="list-['👉'] pl-5">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-5">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-6 pl-2">
              {children}
            </li>
          ),

          // STRONG
          strong: ({ children }) => (
            <strong
              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {children}
            </strong>
          ),

          // BLOCKQUOTE
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-4 px-4 py-2 italic rounded-r-lg ${isDark
                ? "border-sky-500 bg-[#1d2630] text-gray-300"
                : "border-sky-400 bg-sky-50 text-gray-700"
                }`}
            >
              {children}
            </blockquote>
          ),

          // LINKS
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`underline ${isDark
                ? "text-sky-400 hover:text-sky-300"
                : "text-sky-700 hover:text-sky-800"
                }`}
            >
              {children}
            </a>
          ),

          // TABLE
          table: ({ children }) => (
            <div
              className={`overflow-x-auto rounded-xl border ${isDark
                ? "border-[#2d3238]"
                : "border-gray-300"
                }`}
            >
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th
              className={`border px-4 py-2 text-left font-semibold ${isDark
                ? "border-[#2d3238] bg-[#22262d] text-white"
                : "border-gray-300 bg-gray-100 text-gray-900"
                }`}
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td
              className={`border px-4 py-2 ${isDark
                ? "border-[#2d3238] text-gray-300"
                : "border-gray-300 text-gray-700"
                }`}
            >
              {children}
            </td>
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}