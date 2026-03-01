import { type FC, type CSSProperties } from 'react';
import DOMPurify from 'dompurify';

interface HtmlContentProps {
  htmlStr: string;
  color?: string;
  style?: CSSProperties;
  isUserInput?: boolean;
}

export const HtmlContent: FC<HtmlContentProps> = ({
  htmlStr,
  color,
  style,
  isUserInput = false,
}) => {
  if (!htmlStr) return null;

  if (isUserInput) {
    const escapedHtml = htmlStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br />');

    return (
      <div
        style={{
          fontSize: '0.875rem',
          color: color || 'inherit',
          ...style,
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: escapedHtml }}
          style={{ wordBreak: 'break-word' }}
        />
      </div>
    );
  }

  const hasHtmlTag = /<[^>]+>/.test(htmlStr);
  const processedHtml = hasHtmlTag ? htmlStr : htmlStr?.replace(/\n/g, '<br />');

  const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  });

  return (
    <div
      style={{
        fontSize: '0.875rem',
        color: color || 'inherit',
        ...style,
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        style={{ wordBreak: 'break-word' }}
      />
    </div>
  );
};
