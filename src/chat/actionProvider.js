import { postData } from "../utils.js";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.phoneNumber = '';
    this.isNumberConfirmed = false;
  }

  handlePhoneNumber(input) {
    let chatHistory = [];
    this.setState((state) => {
      chatHistory = [...state.messages];
      chatHistory.pop();
      return state;
    });

    const wsUrl = "wss://www.markovai.xyz/authenticate";

    try {
      const ws = new WebSocket(wsUrl);
      ws.onopen = function() {
          ws.send(input);
      };

      ws.onmessage = function(event) {
          const data = JSON.parse(event.data);
          this.populateResponse(data.message);
          if (data.status == "Confirm") {
            this.isNumberConfirmed = true;
          }
      }.bind(this);

      ws.onclose = function() {
          if (this.isNumberConfirmed) {
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

            this.phoneNumber = input;
            this.populateResponse("What skills are you seeking a job for?");
          }
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
      "chat_history": chatHistory,
      "phone_number": this.phoneNumber
    }

    postData('https://www.markovai.xyz/erekrut-agent', payload)
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
