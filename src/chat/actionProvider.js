import { postData } from "../utils.js";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  handlePhoneNumber(input) {
    let chatHistory = [];
    this.setState((state) => {
      chatHistory = [...state.messages];
      chatHistory.pop();
      return state;
    });

    const wsUrl = "ws://13.202.121.182/authenticate";

    try {
      const ws = new WebSocket(wsUrl);
      ws.onopen = function() {
          ws.send(input);
      };

      ws.onmessage = function(event) {
          const message = this.createChatBotMessage(event.data);
          this.populateResponse(message);
      }.bind(this);

      ws.onclose = function() {
          const latitude = localStorage.getItem('latitude');
          const longitude = localStorage.getItem('longitude');
          const payload = {
            "phone": input,
            "lat": latitude,
            "long": longitude,
          } 
          postData('https://www.markovai.xyz/location', payload)
            .then(data => {
              console.log('Data Received:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });

          const message = this.createChatBotMessage("What are your skills?");
          this.populateResponse(message);
      }.bind(this);

      ws.onerror = function(error) {
          console.error(`WebSocket error: ${error.message}`);
      };
    } catch (e) {
        console.error(`WebSocket error: ${e.message}`);
    }
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
