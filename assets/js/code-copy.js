/**
 * Enhanced Code Block Copy Functionality
 * Adds copy buttons to code blocks and improves syntax highlighting
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for Prism to load, then enhance code blocks
  if (window.Prism) {
    enhanceCodeBlocks();
  } else {
    // Wait a bit for Prism to load
    setTimeout(enhanceCodeBlocks, 100);
  }
});

function enhanceCodeBlocks() {
  // Add syntax highlighting to existing code blocks
  addSyntaxHighlighting();

  // Add copy buttons to all code blocks
  addCopyButtons();

  // Add language labels to code blocks
  addLanguageLabels();
}

function addSyntaxHighlighting() {
  // Find all code blocks that don't already have syntax highlighting
  const codeBlocks = document.querySelectorAll('pre.wp-block-code, pre.wp-block-syntaxhighlighter-code, pre[class*="syntaxhighlighter"]');

  codeBlocks.forEach(function(codeBlock) {
    // Skip if already processed
    if (codeBlock.classList.contains('language-') || codeBlock.querySelector('code[class*="language-"]')) {
      return;
    }

    // Get the code content
    let codeContent = codeBlock.textContent || codeBlock.innerText;

    // Detect language based on content patterns
    let language = detectLanguage(codeContent);

    // Create a new code element with proper Prism classes
    const codeElement = document.createElement('code');
    codeElement.className = `language-${language}`;
    codeElement.textContent = codeContent;

    // Clear the pre element and add the new code element
    codeBlock.innerHTML = '';
    codeBlock.appendChild(codeElement);

    // Add Prism class to pre element
    codeBlock.classList.add(`language-${language}`);

    // Trigger Prism highlighting
    if (window.Prism) {
      Prism.highlightElement(codeElement);
    }
  });
}

function detectLanguage(code) {
  const codeText = code.toLowerCase().trim();

  // Ruby detection
  if (codeText.includes('rspec') ||
      codeText.includes('describe') ||
      codeText.includes('def ') ||
      codeText.includes('end') ||
      codeText.includes('class ') ||
      codeText.includes('module ') ||
      codeText.includes('require ') ||
      codeText.includes('rails') ||
      codeText.includes('activerecord') ||
      codeText.includes('actionmailer') ||
      codeText.includes('.rb') ||
      /\bdo\s*\|/.test(codeText) ||
      codeText.includes('puts ') ||
      codeText.includes('p ') ||
      codeText.includes('@') ||
      codeText.includes('attr_') ||
      codeText.includes('before_action') ||
      codeText.includes('after_action')) {
    return 'ruby';
  }

  // JavaScript detection
  if (codeText.includes('function') ||
      codeText.includes('const ') ||
      codeText.includes('let ') ||
      codeText.includes('var ') ||
      codeText.includes('console.log') ||
      codeText.includes('document.') ||
      codeText.includes('window.') ||
      codeText.includes('=>') ||
      codeText.includes('async ') ||
      codeText.includes('await ') ||
      codeText.includes('.js') ||
      codeText.includes('npm ') ||
      codeText.includes('yarn ')) {
    return 'javascript';
  }

  // Python detection
  if (codeText.includes('def ') ||
      codeText.includes('import ') ||
      codeText.includes('from ') ||
      codeText.includes('print(') ||
      codeText.includes('class ') ||
      codeText.includes('if __name__') ||
      codeText.includes('.py') ||
      codeText.includes('pip ') ||
      codeText.includes('python ')) {
    return 'python';
  }

  // SQL detection
  if (codeText.includes('select ') ||
      codeText.includes('from ') ||
      codeText.includes('where ') ||
      codeText.includes('insert ') ||
      codeText.includes('update ') ||
      codeText.includes('delete ') ||
      codeText.includes('create table') ||
      codeText.includes('alter table')) {
    return 'sql';
  }

  // CSS detection
  if (codeText.includes('{') && codeText.includes('}') &&
      (codeText.includes(':') || codeText.includes('px') || codeText.includes('rem') || codeText.includes('#'))) {
    return 'css';
  }

  // HTML detection
  if (codeText.includes('<') && codeText.includes('>') &&
      (codeText.includes('html') || codeText.includes('div') || codeText.includes('span'))) {
    return 'html';
  }

  // JSON detection
  if ((codeText.startsWith('{') && codeText.endsWith('}')) ||
      (codeText.startsWith('[') && codeText.endsWith(']'))) {
    try {
      JSON.parse(codeText);
      return 'json';
    } catch (e) {
      // Not valid JSON
    }
  }

  // YAML detection
  if (codeText.includes('---') ||
      /^\s*\w+:\s*/.test(codeText) ||
      codeText.includes('.yml') ||
      codeText.includes('.yaml')) {
    return 'yaml';
  }

  // Shell/Bash detection
  if (codeText.includes('#!/bin/bash') ||
      codeText.includes('$ ') ||
      codeText.includes('sudo ') ||
      codeText.includes('cd ') ||
      codeText.includes('ls ') ||
      codeText.includes('mkdir ') ||
      codeText.includes('chmod ') ||
      codeText.includes('grep ')) {
    return 'bash';
  }

  // Default to text if no language detected
  return 'text';
}

function addCopyButtons() {
  // Select both Jekyll highlight blocks and WordPress code blocks
  const codeBlocks = document.querySelectorAll('.highlight, .wp-block-code, pre.wp-block-code, pre[class*="wp-block-code"], pre[class="wp-block-code"], pre.wp-block-syntaxhighlighter-code, pre[class*="syntaxhighlighter"]');

  codeBlocks.forEach(function(codeBlock, index) {
    // Skip if copy button already exists
    if (codeBlock.querySelector('.copy-code-btn')) {
      return;
    }

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.textContent = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');

    copyButton.addEventListener('click', function() {
      copyCodeToClipboard(codeBlock, copyButton);
    });

    // Ensure the parent has relative positioning
    codeBlock.style.position = 'relative';
    codeBlock.appendChild(copyButton);
  });
}

function addLanguageLabels() {
  const codeBlocks = document.querySelectorAll('.highlight, .wp-block-code, pre.wp-block-code, pre[class*="wp-block-code"], pre.wp-block-syntaxhighlighter-code, pre[class*="syntaxhighlighter"]');

  codeBlocks.forEach(function(codeBlock) {
    // Try to detect language from class names
    const classList = codeBlock.classList;
    let language = '';

    // Look for language-specific classes
    for (let className of classList) {
      if (className.startsWith('language-')) {
        language = className.replace('language-', '');
        break;
      }
    }

    // Check for WordPress syntaxhighlighter language attribute
    if (!language) {
      const parent = codeBlock.parentElement;
      if (parent && parent.innerHTML.includes('"language":"')) {
        const match = parent.innerHTML.match(/"language":"(\w+)"/);
        if (match) {
          language = match[1];
        }
      }
    }

    // Check parent element for language info
    if (!language) {
      const parent = codeBlock.parentElement;
      if (parent && parent.classList.contains('highlighter-rouge')) {
        const parentClasses = parent.classList;
        for (let className of parentClasses) {
          if (className.startsWith('language-')) {
            language = className.replace('language-', '');
            break;
          }
        }
      }
    }

    // Check for Jekyll highlight liquid tag pattern
    if (!language) {
      const preElement = codeBlock.querySelector('pre');
      if (preElement && preElement.className) {
        const match = preElement.className.match(/highlight-(\w+)/);
        if (match) {
          language = match[1];
        }
      }
    }

    // For syntaxhighlighter blocks, check the comment above
    if (!language && codeBlock.classList.contains('wp-block-syntaxhighlighter-code')) {
      const prevSibling = codeBlock.parentElement.previousElementSibling;
      if (prevSibling && prevSibling.innerHTML.includes('syntaxhighlighter/code')) {
        const match = prevSibling.innerHTML.match(/"language":"(\w+)"/);
        if (match) {
          language = match[1];
        }
      }
      // Default to detecting common patterns in the code
      if (!language) {
        const codeText = codeBlock.textContent.toLowerCase();
        if (codeText.includes('rspec') || codeText.includes('describe') || codeText.includes('def ') || codeText.includes('end')) {
          language = 'ruby';
        } else if (codeText.includes('function') || codeText.includes('const ') || codeText.includes('let ')) {
          language = 'javascript';
        } else if (codeText.includes('class ') || codeText.includes('def ')) {
          language = 'python';
        }
      }
    }

    // Set data attribute for CSS styling
    if (language) {
      codeBlock.setAttribute('data-lang', language.toUpperCase());
    }
  });
}

function copyCodeToClipboard(codeBlock, button) {
  let code = '';

  // Handle different code block structures
  if (codeBlock.classList.contains('wp-block-code') ||
      codeBlock.classList.contains('wp-block-syntaxhighlighter-code') ||
      codeBlock.tagName === 'PRE' ||
      (codeBlock.className && (codeBlock.className.includes('wp-block-code') || codeBlock.className.includes('syntaxhighlighter')))) {
    // WordPress style code blocks
    const codeElement = codeBlock.querySelector('code') || codeBlock;
    code = codeElement.textContent || codeElement.innerText;
  } else {
    // Jekyll highlight blocks - try to get code from table structure (with line numbers)
    const table = codeBlock.querySelector('table');
    if (table) {
      const codeLines = table.querySelectorAll('td:last-child');
      code = Array.from(codeLines).map(td => td.textContent).join('\n');
    } else {
      // Fallback to pre element
      const pre = codeBlock.querySelector('pre');
      if (pre) {
        code = pre.textContent;
      }
    }
  }

  // Clean up the code (remove extra whitespace and decode HTML entities)
  code = code.trim()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#91;/g, '[')
    .replace(/&#93;/g, ']');

  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    // Modern async clipboard API
    navigator.clipboard.writeText(code).then(function() {
      showCopySuccess(button);
    }).catch(function(err) {
      console.error('Failed to copy code: ', err);
      fallbackCopyToClipboard(code, button);
    });
  } else {
    // Fallback for older browsers
    fallbackCopyToClipboard(code, button);
  }
}

function fallbackCopyToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showCopySuccess(button);
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    showCopyError(button);
  }

  document.body.removeChild(textArea);
}

function showCopySuccess(button) {
  const originalText = button.textContent;
  button.textContent = 'Copied!';
  button.classList.add('copied');

  setTimeout(function() {
    button.textContent = originalText;
    button.classList.remove('copied');
  }, 2000);
}

function showCopyError(button) {
  const originalText = button.textContent;
  button.textContent = 'Error';
  button.classList.add('error');

  setTimeout(function() {
    button.textContent = originalText;
    button.classList.remove('error');
  }, 2000);
}

// Add keyboard shortcut for copying code (Ctrl+Shift+C when hovering over code block)
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    const hoveredElement = document.querySelector('.highlight:hover, .wp-block-code:hover, pre.wp-block-code:hover, pre[class*="wp-block-code"]:hover, pre.wp-block-syntaxhighlighter-code:hover, pre[class*="syntaxhighlighter"]:hover');
    if (hoveredElement) {
      const copyButton = hoveredElement.querySelector('.copy-code-btn');
      if (copyButton) {
        e.preventDefault();
        copyButton.click();
      }
    }
  }
});
