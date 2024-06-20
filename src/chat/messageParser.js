class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
    this.isFirstInteraction = true;
  }

  parse(message) {
    if (this.isFirstInteraction) {
      this.handleFirstInteraction(message);
    } else {
      this.actionProvider.response(message);
    }
  }

  handleFirstInteraction(message) {
    const phoneNumberPattern = /^\d{10}$/;

    if (phoneNumberPattern.test(message)) {
      const formattedNumber = this.prependCountryCode(message);
      this.actionProvider.handlePhoneNumber(formattedNumber);
      this.isFirstInteraction = false;
    } else {
      this.actionProvider.populateResponse("I apologize for the confusion. Could you please provide your 10 digit phone number?");
    }
  }

  prependCountryCode(number) {
    return `91${number}`;
  }
}

export default MessageParser;
