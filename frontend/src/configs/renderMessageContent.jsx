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
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="group w-full max-w-full overflow-hidden rounded-xl shadow-2xl my-6 border border-gray-200 dark:border-[#2d3238] transition-all duration-300 hover:shadow-accent/5">
      {/* Code Header */}
      <div className="flex items-center justify-between py-2.5 px-5 border-b min-w-max w-full backdrop-blur-md bg-gray-50/80 dark:bg-[#1E2225]/90 border-gray-200 dark:border-[#2d3238]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
          </div>
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 select-none">
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
      <div className="relative w-full text-left flex flex-col items-start">
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
            width: '100%',
          }}
          codeTagProps={{ style: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', monospace", lineHeight: '1.6', textAlign: 'left', width: '100%', display: 'block' } }}
        >
          {processedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const scienceChipClass = "inline-block max-w-full align-middle text-[color-mix(in_srgb,var(--accent-color)_72%,var(--text-primary))] mx-1 font-['JetBrains_Mono','Fira_Code',monospace] text-[0.92em] font-medium transition-colors";
const mathFallbackClass = `whitespace-normal break-all ${scienceChipClass}`;

const normalizeMathSource = (math) => {
  if (!math) return "";
  return math
    .trim()
    .replace(/^(\$\$|\\\[|\\\()/, '')
    .replace(/(\$\$|\\\]|\\\))$/, '')
    .replace(/^[`'"]+/, '').replace(/[`'"]+$/, '') // Remove surrounding quotes
    .replace(/^(\*\*|__)/, '').replace(/(\*\*|__)$/, '') // Remove surrounding bold
    .replace(/\\begin\{[a-z]*\*?\}/, '')
    .replace(/\\end\{[a-z]*\*?\}/, '')
    .replace(/<=>/g, '\\rightleftharpoons ')
    .replace(/->/g, '\\to ')
    .replace(/<-/g, '\\leftarrow ')
    .replace(/>=/g, '\\ge ')
    .replace(/<=/g, '\\le ')
    .replace(/!=/g, '\\ne ')
    .trim();
};

const InlineMathContent = ({ math, id }) => {
  const normalizedMath = normalizeMathSource(math);
  if (!normalizedMath) return null;

  return (
    <span style={{ display: 'inline-block', maxWidth: '100%', overflowX: 'auto', verticalAlign: 'middle' }}>
      <span className={`${scienceChipClass} cursor-default select-all`}>
        <InlineMath
          key={id}
          math={normalizedMath}
          renderError={() => <code className={mathFallbackClass}>{normalizedMath}</code>}
        />
      </span>
    </span>
  );
};

const BlockMathContent = ({ math, id }) => {
  const normalizedMath = normalizeMathSource(math);
  if (!normalizedMath) return null;

  return (
    <div className="my-2 w-full overflow-x-auto">
      <span className={`${scienceChipClass} mx-0 whitespace-normal`}>
        <BlockMath
          key={id}
          math={normalizedMath}
          renderError={() => <code className={mathFallbackClass}>{normalizedMath}</code>}
        />
      </span>
    </div>
  );
};

const FormulaChipContent = ({ formula, id, inline = true }) => {
  let normalizedFormula = formula.trim();
  if (!normalizedFormula) return null;

  // Globally remove unwanted markdown/quotes that the AI might have mixed in
  normalizedFormula = normalizedFormula
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/[`']+/g, '');

  // Strip leading/trailing punctuation that isn't part of math
  normalizedFormula = normalizedFormula
    .replace(/^[\s,.:]+/, '')
    .replace(/[\s,.:]+$/, '');

  if (!normalizedFormula || normalizedFormula.length < 2) return null;

  // Try to render with KaTeX for better appearance
  const math = convertToLatex(normalizedFormula);

  const content = (
    <span className="inline-block whitespace-normal wrap-break-words w-full px-2">
      <InlineMath
        key={id}
        math={math}
        renderError={() => <code className={mathFallbackClass}>{normalizedFormula}</code>}
      />
    </span>
  );

  return inline
    ? <span className={`${scienceChipClass} cursor-default select-all`}>{content}</span>
    : (
      <div className="my-4 w-full">
        <div className="flex justify-start w-full">
          <span className={`${scienceChipClass} mx-0 w-full py-2 text-left`}>
            {content}
          </span>
        </div>
      </div>
    );
};

const reactionOperatorPattern = /(->|=>|<=>|→|←|⇌|=|\+)/;

const isChemistryReactionLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 180) return false;
  if (!reactionOperatorPattern.test(trimmed)) return false;

  const elementMatches = trimmed.match(/\b(?:[A-Z][a-z]?)(?:_?\d*)\b/g) || [];
  const hasChemistryState = /\((?:s|l|g|aq)\)/i.test(trimmed);
  const hasReactionArrow = /(->|=>|<=>|→|←|⇌)/.test(trimmed);

  return elementMatches.length >= 2 && (hasReactionArrow || hasChemistryState);
};

const convertToLatex = (text) => {
  if (!text) return "";
  let latex = text
    // Handle tags with spaces and entities: < sup >, &lt;sup&gt;, etc.
    .replace(/(?:<|&lt;)[\s]*sup[\s]*[\s\S]*?(?:>|&gt;)([\s\S]*?)(?:<|&lt;)[\s]*\/[\s]*sup[\s]*[\s\S]*?(?:>|&gt;)/gi, '^{$1}')
    .replace(/(?:<|&lt;)[\s]*sub[\s]*[\s\S]*?(?:>|&gt;)([\s\S]*?)(?:<|&lt;)[\s]*\/[\s]*sub[\s]*[\s\S]*?(?:>|&gt;)/gi, '_{$1}')
    .replace(/(?:<|&lt;)[\s]*i[\s]*[\s\S]*?(?:>|&gt;)([\s\S]*?)(?:<|&lt;)[\s]*\/[\s]*i[\s]*[\s\S]*?(?:>|&gt;)/gi, '$1')
    .replace(/(?:<|&lt;)[\s]*b[\s]*[\s\S]*?(?:>|&gt;)([\s\S]*?)(?:<|&lt;)[\s]*\/[\s]*b[\s]*[\s\S]*?(?:>|&gt;)/gi, '\\mathbf{$1}')
    .replace(/\*+(.*?)\*+/g, '$1') // Strip bold/italic stars
    .replace(/∫/g, '\\int ')
    .replace(/\[([a-zA-Z0-9]+)\s+to\s+([a-zA-Z0-9]+)\]/g, '_{$1}^{$2} ')
    .replace(/d\/d([xytz])/g, '\\frac{d}{d$1}')
    .replace(/([A-Z][a-z]?)(\d+)/g, '$1_{$2}')
    .replace(/\^([+-]|\d+[+-])/g, '^{$1}')
    .replace(/([+-])\^/g, '^{$1}')
    .replace(/(\d+)([A-Z])/g, '$1 $2')
    .replace(/\^([\w\d()+-]+)/g, '^{$1}')
    .replace(/->|=>|→/g, ' \\to ')
    .replace(/<-|←/g, ' \\leftarrow ')
    .replace(/<=>|⇌/g, ' \\rightleftharpoons ')
    .replace(/≈/g, ' \\approx ')
    .replace(/≠/g, ' \\neq ')
    .replace(/<=/g, ' \\le ')
    .replace(/>=/g, ' \\ge ')
    .replace(/²/g, '^{2}')
    .replace(/³/g, '^{3}')
    .replace(/\*/g, '\\cdot')
    .replace(/\+/g, '+')
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  return latex;
};

const ChemistryReactionContent = ({ reaction, id, inline = false }) => {
  const normalizedReaction = reaction.trim();
  const latex = convertToLatex(normalizedReaction);

  const content = (
    <InlineMath
      key={id}
      math={latex}
      renderError={() => <code className={scienceChipClass}>{normalizedReaction}</code>}
    />
  );

  if (inline) {
    return <span className={`${scienceChipClass} cursor-default select-all`}>{content}</span>;
  }
  return (
    <div className="my-2 w-full overflow-x-auto">
      <div className={`${scienceChipClass} mx-0`}>{content}</div>
    </div>
  );
};

// FIX: Use \\n in string instead of actual newline in regex
const normalizeMathBlocks = (text) => {
  if (!text) return "";
  return text
    .replace(/```(?:math|latex|tex)\s*\n([\s\S]*?)```/gi, (_, body) => `$$\n${body.trim()}\n$$`)
    .replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (_, body) => `$$\n${body.trim()}\n$$`)
    .replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (_, body) => `$$\n\\begin{aligned}\n${body.trim()}\n\\end{aligned}\n$$`)
    .replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, (_, body) => `$$\n\\begin{gathered}\n${body.trim()}\n\\end{gathered}\n$$`)
    .replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, (_, body) => `$$\n\\begin{aligned}\n${body.trim()}\n\\end{aligned}\n$$`)
    .replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, (_, body) => `$$\n\\begin{aligned}\n${body.trim()}\n\\end{aligned}\n$$`)
    .replace(/\\begin\{split\*?\}([\s\S]*?)\\end\{split\*?\}/g, (_, body) => `$$\n\\begin{aligned}\n${body.trim()}\n\\end{aligned}\n$$`);
};

const isStandaloneEquationLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 250) return false;
  if (/^(```|#{1,6}\s|\||[-*]\s+|\d+\.\s+)/.test(trimmed)) return false;
  if (/^\[[^\]\n]+\]\((?:https?:\/\/|mailto:)/.test(trimmed)) return false;

  const hasMathSyntax = /(\\frac|\\sqrt|\\sum|\\prod|\\int|\\lim|\\sin|\\cos|\\tan|\\log|\\ln|\\Delta|\\theta|\\alpha|\\beta|\\gamma|\\lambda|\\sigma|\\omega|\\pi|\\infty|\\partial|\\nabla|\\approx|\\neq|\\le|\\ge|[=^_]|->|<-|>=|<=|!=)/.test(trimmed);
  const hasOperators = /[=≈≠≤≥∑∏∫√∆Δ∂∞→←⇌]/.test(trimmed);
  if (!hasMathSyntax && !hasOperators) return false;

  const sentenceLikeWords = trimmed.match(/\b[a-zA-Z]{4,}\b/g) || [];
  return sentenceLikeWords.length <= 4;
};

const isUnifiedScienceFormula = (value) => {
  const text = value.trim();
  if (!text || text.length > 200) return false;
  if (/https?:\/\//i.test(text)) return false;

  const hasOperator = /(=|≈|≠|<=|>=|≤|≥|->|<-|=>|<=>|→|←|⇌|\+|-|\/|\*|∫|∑|∏)/.test(text);
  const hasScienceShape = /([A-Za-z]\([^)]*\)|[a-z]'\(?[a-z]?\)?|[A-Za-z]'?\s*\^|[A-Za-z]_?\d|[∫√Σ∑∏∆Δ∂∞]|\\(?:frac|sqrt|sum|int|lim|sin|cos|tan|log|ln|exp)|\b(?:sin|cos|tan|log|ln|exp|sec|csc|cot|arcsin|arccos|arctan)\s*\(?|\bdx\b|\bdy\b|\bdt\b|\bdu\b|\bdv\b|\bmol\b|\bM\b|\bK\b)/.test(text);

  // Stricter check: must have BOTH an operator/symbol and a science shape to be a "chip"
  // OR it must be a very clear derivative/integral notation OR have HTML math tags
  const hasHtmlMath = /(<sup>|<sub>)/i.test(text);
  const isClearMath = hasOperator && hasScienceShape;
  const isDerivative = /^[a-z]''?\([^)]+\)$/i.test(text);
  const isIntegral = /^∫.*dx$/i.test(text);

  if (!isClearMath && !isDerivative && !isIntegral && !hasHtmlMath) return false;

  // Count long words to avoid catching full sentences
  const words = text.split(/\s+/);
  const longWords = words.filter(w => w.length > 5 && /[a-z]/i.test(w));

  // If there are more than 2 long words, it's likely a sentence with some math in it
  if (longWords.length > 2) return false;

  // If the text has too many spaces compared to its length, it's likely a sentence
  if (words.length > 8 && !hasOperator) return false;

  return true;
};

const splitTextByScienceFormula = (text) => {
  const parts = [];
  // Expanded pattern to catch formulas containing HTML tags with variations and potential markdown italics
  const formulaPattern = /((?:[A-Za-z0-9][A-Za-z0-9\s\*\(\)\[\]]*?(?:<|&lt;)[\s]*sup[\s]*[\s\S]*?(?:>|&gt;).+?(?:<|&lt;)[\s]*\/[\s]*sup[\s]*[\s\S]*?(?:>|&gt;)[A-Za-z0-9\s\*\(\)\[\]]*)|(?:[A-Z][A-Za-z0-9']*(?:\([^)]+\))?\s*(?:=|≈|≠|<=|>=|≤|≥)\s*[-+]?[A-Za-z0-9_.\-\\]+)|(?:[∫√Σ∑∏∆Δ∂∞][^∫\n]*?(?:dx|dy|dt|du|dv|C|=[^ \n]+))|(?:\\?(?:sin|cos|tan|log|ln|exp|sec|csc|cot|arcsin|arccos|arctan)\s*\([^)]+\))|(?:[A-Za-z][A-Za-z0-9']*\s*(?:->|<-|=>|<=>|→|←|⇌)\s*[A-Za-z0-9_.\-\\]+)|(?:[A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+)|(?:d\/d[xytz]\s*\[?[^\]\n\*]+\]?)|(?:[a-z]''?\([^)]+\))|(?:\\[a-zA-Z]+\{[^}]*\}))/g;
  let lastIndex = 0;
  let match;

  while ((match = formulaPattern.exec(text)) !== null) {
    const candidate = match[0].trim();

    // Safety check for false positives
    if (candidate.length < 2 && !/[∫√Σ∑∏∆Δ∂∞]/.test(candidate)) continue;

    // Ensure we don't catch plain words ending in colons or just markdown
    if (candidate.includes(':') && !candidate.includes('=') && !candidate.includes('∫')) continue;
    if (candidate.startsWith('**') && candidate.endsWith('**')) continue;

    if (!isUnifiedScienceFormula(candidate) && !isChemistryReactionLine(candidate) && !candidate.startsWith('\\')) continue;

    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'formula', value: candidate });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'text', value: text }];
};

export function renderMessageContent(content, isDark) {
  if (!content || !content.trim()) return null;

  let processedContent = normalizeMathBlocks(content)
    .replace(/\barc\s+([A-Z]{1,3})\b/g, '$\\wideparen{$1}$')
    .replace(/\\arc\{([^}]+)\}/gi, '\\wideparen{$1}')
    .replace(/(^|[^\\])\b(arcsin|arccos|arctan|arccot|arcsec|arccsc|sin|cos|tan|cot|sec|csc|log|ln|exp|lim|max|min|det)\b/g, '$1\\$2')
    .replace(/\*\*(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\])\*\*/g, '$1')
    .replace(/\*\*(\$[^$]+\$|\\\(.+?\\\))\*\*/g, '$1');

  const elements = [];
  let keyCounter = 0;
  let inlineKeyCounter = 0;

  const parseInline = (str) => {
    if (!str) return str;

    const parts = str.split(/(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\(.+?\\\)|(?:\$(?:[^\$\s\\]|\\.)(?:[^\$]*?(?:[^\$\s\\]|\\.))?\$)|`[^`]+`|\[[^\]\n]+\]\((?:https?:\/\/|mailto:)[^\s)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~)/).filter(Boolean);

    return parts.map((part, idx) => {
      const uniqueKey = `${inlineKeyCounter++}-${idx}`;

      // ── Block math inside inline context ──
      if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('\\[') && part.endsWith('\\]'))) {
        return <BlockMathContent key={`bm-${uniqueKey}`} id={`bm-${uniqueKey}`} math={part} />;
      }

      // ── Inline math ──
      if ((part.startsWith('$') && part.endsWith('$')) || (part.startsWith('\\(') && part.endsWith('\\)'))) {
        return <InlineMathContent key={`im-${uniqueKey}`} id={`im-${uniqueKey}`} math={part} />;
      }

      // ── Inline code / backtick ──
      if (part.startsWith('`') && part.endsWith('`')) {
        const codeContent = part.slice(1, -1);

        const isLatexMath =
          /\\(sin|cos|tan|cot|sec|csc|frac|sqrt|sum|prod|int|lim|log|ln|exp|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|chi|psi|omega|Delta|Gamma|Theta|Lambda|Xi|Pi|Sigma|Phi|Psi|Omega|infty|partial|nabla|approx|neq|le|ge|to|leftarrow|rightarrow|pm|mp|times|div|cup|cap|in|notin|subset|supset|exists|forall|neg|lor|land|perp|parallel|angle)\b/.test(codeContent) ||
          (/^[a-zA-Z0-9\s()+\-*/=.,_^\[\]{}|\\∫±√∑∏∆Δ∂∞≈≠≤≥→←⇌]+$/.test(codeContent) &&
            /[=^_{}\\∫±√∑∏∆Δ∂∞≈≠≤≥→←⇌]/.test(codeContent) &&
            codeContent.length > 1 &&
            !/^(const|let|var|function|return|if|for|while|class|import|export)\b/.test(codeContent.trim())) ||
          /[∫±√∑∏∆Δ∂∞≈≠≤≥→←⇌]/.test(codeContent);

        if (isLatexMath) {
          const mathContent = codeContent
            .replace(/∫/g, '\\int ')
            .replace(/±/g, '\\pm ')
            .replace(/ₙ/g, '_n ')
            .replace(/\[a to b\]/gi, '_{a}^{b} ')
            .replace(/\[a to x\]/gi, '_{a}^{x} ')
            .replace(/\b(sin|cos|tan|cot|sec|csc|ln|log)\b/g, '\\$1')
            .replace(/\*/g, '\\cdot ');

          return (
            <span
              key={`im-fallback-${uniqueKey}`}
              className="inline-flex items-center text-[#111827] dark:text-[#e6e6e6] mx-0.5 px-1.5 py-0.5 rounded-md bg-gray-100/40 dark:bg-white/10 font-medium border border-transparent hover:border-gray-200/50 dark:hover:border-white/10 transition-all cursor-default select-all"
            >
              <InlineMath
                math={mathContent}
                renderError={() => (
                  <code className="wrap-break-words bg-[#f1f5f9] dark:bg-[#2d3139] text-[#0369a1] dark:text-[#7dd3fc] rounded-md px-[0.4em] py-[0.1em] font-['JetBrains_Mono','Fira_Code',monospace] text-[0.85em] border border-slate-200 dark:border-slate-700/50">
                    {codeContent}
                  </code>
                )}
              />
            </span>
          );
        }

        if (isChemistryReactionLine(codeContent)) {
          return <ChemistryReactionContent key={`chem-code-${uniqueKey}`} id={`chem-code-${uniqueKey}`} inline reaction={codeContent} />;
        }
        if (isUnifiedScienceFormula(codeContent) || isStandaloneEquationLine(codeContent)) {
          return <FormulaChipContent key={`formula-code-${uniqueKey}`} id={`formula-code-${uniqueKey}`} formula={codeContent} />;
        }

        return (
          <code
            key={`ic-${uniqueKey}`}
            className="wrap-break-words bg-[#f1f5f9] dark:bg-[#2d3139] text-[#0369a1] dark:text-[#7dd3fc] rounded-md px-[0.4em] py-[0.1em] font-['JetBrains_Mono','Fira_Code',monospace] text-[0.85em] border border-slate-200 dark:border-slate-700/50"
          >
            {codeContent}
          </code>
        );
      }

      // ── Link ──
      const linkMatch = part.match(/^\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={`link-${uniqueKey}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0369a1] dark:text-[#7dd3fc] underline underline-offset-4 decoration-[#38bdf8]/40 hover:text-[#0284c7] dark:hover:text-[#bae6fd] hover:decoration-current transition-colors wrap-break-words"
          >
            {parseInline(linkMatch[1])}
          </a>
        );
      }

      // ── Bold ──
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        const innerContent = part.slice(2, -2);
        if (/^(\$[^$]+\$|\\\(.+?\\\))$/.test(innerContent.trim())) {
          return parseInline(innerContent);
        }
        return (
          <strong key={`ib-${uniqueKey}`} className="font-bold text-[#111827] dark:text-white">
            {parseInline(innerContent)}
          </strong>
        );
      }

      // ── Italic ──
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        return (
          <em key={`ie-${uniqueKey}`} className="italic text-[#374151] dark:text-[#d1d5db]">
            {parseInline(part.slice(1, -1))}
          </em>
        );
      }

      // ── Strikethrough ──
      if (part.startsWith('~~') && part.endsWith('~~')) {
        return (
          <del key={`is-${uniqueKey}`} className="line-through text-gray-500 opacity-70">
            {parseInline(part.slice(2, -2))}
          </del>
        );
      }

      // ── Chemistry (plain text token) ──
      if (isChemistryReactionLine(part)) {
        return <ChemistryReactionContent key={`chem-${uniqueKey}`} id={`chem-${uniqueKey}`} inline reaction={part} />;
      }

      // ── Science formula split ──
      const formulaParts = splitTextByScienceFormula(part);
      if (formulaParts.some((fp) => fp.type === 'formula')) {
        return formulaParts.map((fp, fi) => {
          const fKey = `${uniqueKey}-${fi}`;
          if (fp.type === 'formula') {
            return <FormulaChipContent key={`formula-${fKey}`} id={`formula-${fKey}`} formula={fp.value} />;
          }
          return <span key={`it-${fKey}`} className="wrap-break-words">{fp.value}</span>;
        });
      }

      return <span key={`it-${uniqueKey}`} className="wrap-break-words">{part}</span>;
    });
  };

  let inList = false;
  let listItems = [];
  let inTable = false;
  let tableRows = [];
  let listType = 'ul';

  const closeList = () => {
    if (inList) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
      elements.push(
        <Tag
          key={`list-${keyCounter++}`}
          className={`pl-5 ${listClass} list-outside mb-[1.2em] text-left space-y-1`}
        >
          {listItems}
        </Tag>
      );
      inList = false;
      listItems = [];
    }
  };

  const parseMarkdownText = (text) => {
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // ── Table ──
      if (/^\s*\|(.+)\|\s*$/.test(line)) {
        closeList();
        inTable = true;
        tableRows.push(line);
        continue;
      }

      if (inTable && !/^\s*\|(.+)\|\s*$/.test(line)) {
        if (tableRows.length >= 2) {
          const header = tableRows[0].split('|').map((c) => c.trim()).filter(Boolean);
          const rows = tableRows.slice(2).map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));
          elements.push(
            <div key={`table-${keyCounter++}`} className="w-full max-w-full overflow-x-auto my-[1.5em] text-left touch-pan-x">
              <table className="border-collapse w-full min-w-max font-['JetBrains_Mono','Fira_Code',monospace] bg-[#fafafa] dark:bg-[#181a1b] text-[#1a1a1a] dark:text-[#e6e6e6] rounded-lg overflow-hidden text-[0.92em] text-left">
                <thead>
                  <tr>
                    {header.map((cell, idx) => (
                      <th key={idx} className="border border-[#e5e7eb] dark:border-[#333] px-[1em] py-[0.6em] bg-[#f3f4f6] dark:bg-[#23272f] font-bold text-left text-[1.05em] text-[#111827] dark:text-white">
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
                          className={`border border-[#e5e7eb] dark:border-[#333] px-[1em] py-[0.6em] ${ridx % 2 === 0 ? 'bg-white dark:bg-[#23272f]' : 'bg-[#f9fafb] dark:bg-[#202124]'
                            } align-top text-[#374151] dark:text-[#e6e6e6] text-left`}
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

      // ── Headings ──
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        closeList();
        const hashCount = headingMatch[1].length;
        const headingText = headingMatch[2];
        const Tag = hashCount === 1 ? 'h1' : hashCount === 2 ? 'h2' : hashCount === 3 ? 'h3' : 'h4';
        const tailwindFontSize = hashCount === 1 ? 'text-4xl' : hashCount === 2 ? 'text-3xl' : hashCount === 3 ? 'text-2xl' : 'text-xl';

        elements.push(
          <Tag
            key={`h-${keyCounter++}`}
            className={`font-bold ${tailwindFontSize} dark:text-white mb-[0.5em] mt-[1.2em] text-[#111827] text-left wrap-break-words`}
          >
            {parseInline(headingText)}
          </Tag>
        );
        continue;
      }

      // ── Horizontal rule ──
      if (/^\s*-{3,}\s*$/.test(line)) {
        closeList();
        elements.push(<hr key={`hr-${keyCounter++}`} className="border-0 border-t border-[#e5e7eb] dark:border-[#3a3f4b] my-[1.5em]" />);
        continue;
      }

      // ── List items ──
      const isStandardBullet = /^\s*([*-])\s+/.test(line);
      const isNumberedList = /^\s*(\d+)\.\s+/.test(line);

      if (isStandardBullet || isNumberedList) {
        const currentType = isNumberedList ? 'ol' : 'ul';
        if (inList && listType !== currentType) closeList();
        inList = true;
        listType = currentType;
        const cleanLine = line.replace(/^\s*([*-]|\d+\.)\s+/, '').trim();

        const isChem = isChemistryReactionLine(cleanLine);
        const isEq = isStandaloneEquationLine(cleanLine);
        const itemValue = isNumberedList ? parseInt(line.match(/^\s*(\d+)\./)[1]) : undefined;

        listItems.push(
          <li
            key={`li-${keyCounter++}`}
            value={itemValue}
            className="wrap-break-words mb-[0.4em] text-[#4b5563] dark:text-[#d1d5db] leading-[1.6] ml-[0.5em] text-left"
          >
            {isChem || isEq
              ? (isChem
                ? <ChemistryReactionContent key={`chem-li-${keyCounter}`} id={`chem-li-${keyCounter}`} inline={false} reaction={cleanLine} />
                : <FormulaChipContent key={`eq-li-${keyCounter}`} id={`eq-li-${keyCounter}`} formula={cleanLine} inline={false} />)
              : parseInline(cleanLine)}
          </li>
        );
        continue;
      }

      if (inList) {
        if (line.trim() === '') {
          closeList();
          continue;
        } else {
          closeList();
        }
      }

      // ── Block-level paragraph / chemistry / equation ──
      if (line.trim() !== '') {
        if (isChemistryReactionLine(line)) {
          elements.push(<ChemistryReactionContent key={`chem-${keyCounter++}`} id={`chem-${keyCounter}`} reaction={line} />);
          continue;
        }
        if (isStandaloneEquationLine(line)) {
          elements.push(<FormulaChipContent key={`eq-${keyCounter++}`} id={`eq-${keyCounter}`} formula={line} inline={false} />);
          continue;
        }
        elements.push(
          <p key={`p-${keyCounter++}`} className="wrap-break-words my-[0.6em] text-[#4b5563] dark:text-[#d1d5db] leading-[1.6] text-left">
            {parseInline(line)}
          </p>
        );
      }
    }
  };

  // FIX: Regex uses escaped backticks properly
  const regex = /(```[\w]*\n[\s\S]*?```|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\begin\{([a-z]*\*?)\}[\s\S]*?\\end\{\2\})/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(processedContent)) !== null) {
    const textBefore = processedContent.slice(lastIndex, match.index);
    if (textBefore.trim()) parseMarkdownText(textBefore);

    const matchedText = match[0];

    if (matchedText.startsWith('```')) {
      const langMatch = matchedText.match(/^```([\w]*)/);
      const lang = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : 'text';
      const code = matchedText
        .replace(/^```[\w]*\n?/, '')
        .replace(/\n?```\s*$/, '')
        .trim();

      if (['math', 'latex', 'tex'].includes(lang)) {
        elements.push(
          <div
            key={`blockmath-${keyCounter++}`}
            className="my-6 block w-full overflow-x-auto text-[#111827] dark:text-[#e6e6e6] bg-gray-50/50 dark:bg-[#1E2225]/30 p-6 rounded-xl border border-gray-200 dark:border-[#2d3238] shadow-sm backdrop-blur-sm"
          >
            <BlockMath
              math={code}
              renderError={() => <CodeBlockComponent lang={lang} code={code} />}
            />
          </div>
        );
      } else {
        elements.push(<CodeBlockComponent key={`codeblock-${keyCounter++}`} lang={lang} code={code} />);
      }
    } else {
      elements.push(
        <BlockMathContent key={`blockmath-${keyCounter++}`} id={`blockmath-${keyCounter}`} math={matchedText} />
      );
    }

    lastIndex = regex.lastIndex;
  }

  const textAfter = processedContent.slice(lastIndex);
  if (textAfter.trim()) parseMarkdownText(textAfter);

  closeList();
  return <div className="text-left w-full space-y-2">{elements}</div>;
}
