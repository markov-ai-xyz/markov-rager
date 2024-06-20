class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }
  
  parse(message) {
    const phoneNumberPattern = /^[0-9]+$/;

    if (phoneNumberPattern.test(message)) {
      this.actionProvider.handlePhoneNumber(message);
    } 
    else {
      this.actionProvider.response(message);
    }
  }
}

export default MessageParser;
