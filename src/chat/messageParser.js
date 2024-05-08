class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }
  
  parse(message) {
    this.actionProvider.response();
  }
}

export default MessageParser;
