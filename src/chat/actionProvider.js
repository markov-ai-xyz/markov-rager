import { postData } from "../utils.js";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  response(input) {
    let chatHistory = [];
    this.setState((state) => {
      chatHistory = [...state.messages];
      chatHistory.pop();
      return state;
    });

    const payload = {
      "input": input,
      "chat_history": chatHistory
    }

    postData('https://www.markovai.xyz/agent', payload)
      .then(data => {
        console.log('Data Received:', data);
        const output = data.output;
        const message = this.createChatBotMessage(output);
        this.populateResponse(message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  populateResponse(message) {
    this.setState((state) => {
      return { ...state, messages: [...state.messages, message] };
    });
  }
}

export default ActionProvider;
