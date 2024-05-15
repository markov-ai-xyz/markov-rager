import { postData } from "../utils.js";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  response(input) {
    const payload = {
      "input": input,
      "chat_history": []
    }

    postData('https://markovai.xyz/agent', payload)
      .then(data => {
        console.log('Data received:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
    // TODO: Delete
    const message = this.createChatBotMessage("Hello from chatbot");
    this.setState((state) => {
      return { ...state, messages: [...state.messages, message] };
    });
  }
}

export default ActionProvider;
