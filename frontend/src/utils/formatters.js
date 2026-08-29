// Utility to format byte sizes into human readable strings (e.g. 523 KB, 2.4 MB, 97 MB)
export const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null || bytes <= 0) return '-';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Map backend resource types to human-readable label
export const getResourceTypeLabel = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'video': return 'Video';
    case 'pdf': return 'PDF';
    case 'presentation': return 'Presentation';
    case 'document': return 'Document';
    case 'link': return 'External Link';
    default: return type || 'Resource';
  }
};
