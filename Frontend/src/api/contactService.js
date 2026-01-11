import apiClient from "./apiClient";

// Send contact message, messageData as { name: '', surname: '', email: '', message: '' }
export const sendContactMessage = async (messageData) => {
  try {
    const response = await apiClient.post("/contact", messageData);
    return response.data;
  } catch (error) {
    console.error("Failed to send contact message:", error);
    throw error;
  }
};
