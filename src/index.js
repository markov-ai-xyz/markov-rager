import renderChat from "./chat/chat.js";
import ActionProvider from "./chat/actionProvider.js";
import MessageParser from "./chat/messageParser.js";
import {
  createChatBotMessage,
  createClientMessage,
  getWidgets,
  scrollIntoView,
  validateProps,
} from "./utils.js";
import { createErrorMessage } from "./chat/errorMessage.js";
import stateManager from "./state/state.js";
import WidgetRegistry from "./widgetRegistry/widgetRegistry.js";

const renderWidget = (rootEl, config) => {
  rootEl.classList.add('markov-container');
  document.body.appendChild(rootEl);

  let chatBotVisible = false;
  const toggleChatBot = (event) => {
    event.stopPropagation();
    if (chatBotVisible) {
      hideChatBot();
    } else {
      showChatBot();
    }
  };
  
  const showChatBot = () => {
    if (!rootEl.innerHTML) {
      renderChatBot(rootEl, config);
    }
    rootEl.style.display = 'block';
    chatBotVisible = true;
  };
  
  const hideChatBot = () => {
    rootEl.style.display = 'none';
    chatBotVisible = false;
  };
  
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.onclick = toggleChatBot;
  icon.classList.add('markov-icon');
  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 33" width="50" height="50">
        <path d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88 0 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z" fill="#2898ec"></path>
      </svg>`;
  
  document.body.appendChild(icon);

  captureCoordinates();
};

const captureCoordinates = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      localStorage.setItem('latitude', latitude);
      localStorage.setItem('longitude', longitude);
    });
  } else {
    console.log("Geolocation not supported by this browser.");
  }
}

const renderChatBot = (rootEl, config) => {
  if (!config) {
    return renderErrorMessage(
      rootEl,
      "I think you forgot to feed me some props. Did you remember to pass a config, a messageparser and an actionprovider?"
    );
  }

  const propsErrors = validateProps(config, MessageParser);

  const initialState = {
    messages: propsErrors.length
      ? propsErrors.map((propsError) => createChatBotMessage(propsError, {}))
      : config.initialMessages,
    ...config.state,
  };  
  const [state, updater, registerListeners] = stateManager(initialState);

  const actionProviderInstance = new ActionProvider(
    createChatBotMessage,
    updater,
    createClientMessage
  );
  const messageParserInstance = new MessageParser(actionProviderInstance);

  const widgetRegistry = new WidgetRegistry(
    updater,
    actionProviderInstance
  );
  const widgets = getWidgets(config);
  widgets.forEach((widget) => widgetRegistry.addWidget(widget));

  registerListeners((newState) =>
    render(
      rootEl,
      newState,
      messageParserInstance,
      config,
      updater,
      widgetRegistry
    )
  );

  render(
    rootEl,
    state,
    messageParserInstance,
    config,
    updater,
    widgetRegistry
  );
};

let current;

const renderErrorMessage = (rootEl, message) => {
  if (current) {
    rootEl.removeChild(current);
  }

  const errorMessage = createErrorMessage(message);
  rootEl.appendChild(errorMessage);
};

const render = (
  rootEl,
  state,
  messageParserInstance,
  config,
  updater,
  widgetRegistry
) => {
  if (current) {
    rootEl.removeChild(current);
  }

  const chat = renderChat(
    config,
    state,
    messageParserInstance,
    updater,
    widgetRegistry
  );

  current = chat;
  rootEl.appendChild(chat);

  const inputField = document.querySelector(
    ".markov-chatbot-kit-chat-input"
  );

  inputField.focus();
  scrollIntoView();
};

console.log("Start ci");
window.markovJsChatbot = { renderWidget, createChatBotMessage };

export { createChatBotMessage };
export default renderWidget;
