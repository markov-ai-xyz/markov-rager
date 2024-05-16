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
      console.log(...state.messages);
      return { ...state, messages: [...state.messages, message] };
    });
  }
}

export default ActionProvider;
