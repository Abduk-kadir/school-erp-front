import axios from "axios";
import baseURL from "./baseUrl";

const buildFullFileUrl = (path, base = baseURL) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${base}${path}`;
};

const getFileNameFromUrl = (url) => {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const name = pathname.split("/").pop();
    return name || "download";
  } catch {
    return "download";
  }
};

/**
 * Download a PDF or image from a relative or absolute URL.
 * @param {string} filePath - Relative path (e.g. /uploads/file.pdf) or full URL
 * @param {{ base?: string, filename?: string }} options
 */
export const downloadFile = async (filePath, options = {}) => {
  const { base = baseURL, filename } = options;
  const fileUrl = buildFullFileUrl(filePath, base);

  if (!fileUrl) {
    throw new Error("File URL is required");
  }

  const { data } = await axios.get(fileUrl, {
    responseType: "blob",
  });

  const blob = data instanceof Blob ? data : new Blob([data]);
  const downloadName = filename || getFileNameFromUrl(fileUrl);
  const href = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = href;
  anchor.download = downloadName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(href);

  return downloadName;
};

export default downloadFile;
