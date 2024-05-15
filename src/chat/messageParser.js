class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }
  
  parse(message) {
    this.actionProvider.response(message);
  }
}

export default MessageParser;
