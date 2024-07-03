## Erika Interface

### Sample Usage

#### index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="./node_modules/markov-ai/index.css" />
    <title>Chatbot</title>
</head>
<body>
    <div class="erika-interface"></div>
    <script type="module" src="index.js"></script>
</body>
</html>
```

#### index.js
```
import renderWidget, { createChatBotMessage } from './node_modules/markov-ai/src/index.js';

const rootEl = document.querySelector(".erika-interface");
const config = {
    apiKey: "API_KEY",
    botName: "Erika",
    initialMessages: [
        createChatBotMessage('Hello there, please share your 10 digit phone number to get started!', { widget: "" }),
    ],
    state: {},
    widgets: [],
};

localStorage.removeItem('markovJwt');
renderWidget(rootEl, config);
```
