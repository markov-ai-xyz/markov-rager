import renderChat from "./chat/chat.js";
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


class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    if (message.includes("hello")) {
      this.actionProvider.hello();
    }
  }
}

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  hello() {
    const message = this.createChatBotMessage("Hello from chatbot");
    this.setState((state) => {
      return { ...state, messages: [...state.messages, message] };
    });
  }
}

const renderWidget = (rootEl, config) => {
  let chatBotVisible = false;

  const toggleChatBot = () => {
    if (chatBotVisible) {
      rootEl.style.display = 'none';
      chatBotVisible = false;
    } else {
      rootEl.style.display = '';
      renderChatBot(rootEl, config);
      chatBotVisible = true;
    }
  };

  const chatBotButton = document.createElement('button');
  chatBotButton.innerText = 'Chat with us!';
  chatBotButton.onclick = toggleChatBot;
  document.body.appendChild(chatBotButton);
};

const renderChatBot = (rootEl, config) => {
  if (!config) {
    return renderErrorMessage(
      rootEl,
      "I think you forgot to feed me some props. Did you remember to pass a config, a messageparser and an actionprovider?"
    );
  }

  const propsErrors = validateProps(config, MessageParser);

  if (propsErrors.length) {
    const errorMessage = propsErrors.reduce((prev, cur) => {
      prev += cur;
      return prev;
    }, "");

    return renderErrorMessage(rootEl, errorMessage);
  }

  const intialState = {
    messages: [...config.initialMessages],
    ...config.state,
  };
  const [state, updater, registerListeners] = stateManager(intialState);

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
    ".vanilla-chatbot-kit-chat-input"
  );

  inputField.focus();
  scrollIntoView();
};

console.log("Start ci");
window.vanillaJsChatbot = { renderWidget, createChatBotMessage };

export { createChatBotMessage };
export default renderWidget;
