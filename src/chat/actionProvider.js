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
          this.populateResponse(event.data);
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

          this.populateResponse("What are your skills?");
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
        this.populateResponse(data.output);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  populateResponse(message) {
    const chatBotMessage = this.createChatBotMessage(message);
    this.setState((state) => {
      return { ...state, messages: [...state.messages, chatBotMessage] };
    });
  }
}

export default ActionProvider;
