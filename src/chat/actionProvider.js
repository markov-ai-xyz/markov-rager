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

  response() {
    
  }
}

export default ActionProvider;
