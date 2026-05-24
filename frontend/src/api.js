import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});

export const uploadDocument = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  // DON'T manually set Content-Type - let Axios set it with the correct boundary
  const response = await api.post("/upload", formData, {
    onUploadProgress
    // Remove the headers section entirely
  });

  return response.data;
};

export const askQuestion = async ({ documentId, question }) => {
  const response = await api.post("/ask", {
    document_id: documentId,
    question
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};