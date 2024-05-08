import { createBotChatMessage } from "./chat.js";

export const createErrorMessage = (message) => {
  const container = document.createElement("div");
  container.classList.add("vanilla-chatbot-kit-error");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("vanilla-chatbot-kit-error-container");

  const messageObject = {
    message,
    loading: false,
    id: 1,
  };

  const botMessage = createBotChatMessage(messageObject);

  innerContainer.appendChild(botMessage);

  container.appendChild(innerContainer);

  return container;
};
