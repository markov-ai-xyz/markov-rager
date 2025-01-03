export const uniqueIdGenerator = () => {
  let num = 1;
  return () => {
    return (num += 1);
  };
};

const uniqueId = uniqueIdGenerator();

export const botMessage = (message) => {
  if (message.type === "bot") {
    return true;
  }
  return false;
};

export const createChatMessage = (message, type) => {
  return {
    message: message,
    type: type,
    id: uniqueId(),
  };
};

export const createChatBotMessage = (message, options) => {
  return {
    ...createChatMessage(message, "bot"),
    ...options,
    loading: true,
  };
};

export const createClientMessage = (message) => {
  return createChatMessage(message, "user");
};

export const callIfExists = (func, ...args) => {
  if (func) {
    return func(...args);
  }
};

export const getObject = (object) => {
  if (typeof object === "object") return object;
  return {};
};

export const getWidgets = (config) => {
  if (config.widgets) {
    return config.widgets;
  }
  return [];
};

export const scrollIntoView = () => {
  const chatContainer = document.querySelector(
    ".markov-chatbot-kit-chat-message-container"
  );

  chatContainer.scrollTop = chatContainer.scrollHeight;
};

export const validateProps = (config, MessageParser) => {
  const errors = [];
  
  const apiKeyErrors = validateApiKey(config.apiKey);
  if (apiKeyErrors.length > 0) {
    errors.push(...apiKeyErrors);
  }

  if (!config.initialMessages) {
    errors.push(
      "Config must contain property 'initialMessages', and it expects it to be an array of chatbotmessages."
    );
  }

  const messageParser = new MessageParser();
  if (!messageParser["parse"]) {
    errors.push(
      "Messageparser must implement the method 'parse', please add this method to your object. The signature is parse(message: string)."
    );
  }

  return errors;
};

export const validateApiKey = async (apiKey) => {
  const errors = [];

  if (!apiKey || typeof apiKey !== 'string') {
    errors.push("API key is missing or is not a string.");
    return errors;
  }

  const response = await fetch('https://www.markovai.xyz/validate-api-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey
    }
  });

  if (!response.ok) {
    errors.push("Invalid API key.");
    return errors;
  }

  const data = await response.json();
  localStorage.setItem('markovJwt', data.token);

  return errors;
};

export async function postData(url, payload) {
  var token = localStorage.getItem('markovJwt');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}
