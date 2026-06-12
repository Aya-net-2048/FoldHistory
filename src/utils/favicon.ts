export const getFaviconUrl = (url: string, size: number = 64): string => {
  const fullUrl = url.startsWith('http') ? url : `https://${url}/`;

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
    const faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
    faviconUrl.searchParams.append('pageUrl', fullUrl);
    faviconUrl.searchParams.append('size', size.toString());
    return faviconUrl.toString();
  }
  
  // Fallback for local development or unsupported environments
  try {
    const domain = new URL(fullUrl).hostname;
    return `https://api.iowen.cn/favicon/${domain}.png`;
  } catch {
    return '';
  }
};
