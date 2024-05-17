## Markov AI Widget

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
    <div class="markov-ai-widget"></div>
    <script type="module" src="index.js"></script>
</body>
</html>
```

#### index.js
```
import renderWidget, { createChatBotMessage } from './node_modules/markov-ai/src/index.js';

const rootEl = document.querySelector(".markov-ai-widget");
const config = {
    apiKey: "API_KEY",
    botName: "Markov",
    initialMessages: [
        createChatBotMessage('Hello there! How can I help you?', { widget: "" }),
    ],
    state: {},
    widgets: [],
};

renderWidget(rootEl, config);
```
