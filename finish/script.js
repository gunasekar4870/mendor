

const socket = io();
const chatMessages = document.getElementById('chatMessages');
const chatbox = document.getElementById('chatbox');
const sendMessageButton = document.getElementById('sendMessage');

// Disable chatbox initially
chatbox.disabled = true;

// Enable chatbox when therapist connects
socket.on('therapistConnected', () => {
    chatbox.disabled = false;
});

// Send message on Enter key press
chatbox.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        sendMessage();
    }
});

// Send message on button click
sendMessageButton.addEventListener('click', sendMessage);

function sendMessage() {
    const messageText = chatbox.value.trim();
    if (messageText) {
        // Send message to therapist
        socket.emit('sendMessage', messageText);

        // Append user message to chat
        const userMessageElement = createMessageElement('You', messageText);
        chatMessages.appendChild(userMessageElement);

        // Process user input and generate bot response
        processUserInput(messageText);

        // Clear chatbox input
        chatbox.value = '';
    }
}

function createMessageElement(sender, messageText) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chat-message');

    const senderElement = document.createElement('p');
    senderElement.classList.add('chat-message-sender');
    senderElement.textContent = sender;

    const messageContent = document.createElement('p');
    messageContent.classList.add('chat-message-content');
    messageContent.textContent = messageText;

    messageContainer.appendChild(senderElement);
    messageContainer.appendChild(messageContent);

    return messageContainer;
}

// Receive therapist messages
socket.on('receiveMessage', (messageData) => {
    const therapistMessage = createMessageElement(messageData.sender, messageData.message);
    chatMessages.appendChild(therapistMessage);
});

const userMessage = [
    ["hi", "hey", "hello"],
    ["sure", "yes", "no"],
    ["are you genius", "are you nerd", "are you intelligent"],
    ["i hate you", "i dont like you"],
    ["how are you", "how is life", "how are things", "how are you doing"],
    ["how is corona", "how is covid 19", "how is covid19 situation"],
    ["what are you doing", "what is going on", "what is up"],
    ["how old are you"],
    ["who are you", "are you human", "are you bot", "are you human or bot"],
    ["who created you", "who made you", "who is your creator"],
  
    [
        "your name please",
        "your name",
        "may i know your name",
        "what is your name",
        "what call yourself"
    ],
    ["i love you"],
    ["happy", "good", "fun", "wonderful", "fantastic", "cool", "very good"],
    ["bad", "bored", "tired"],
    ["help me", "tell me story", "tell me joke"],
    ["ah", "ok", "okay", "nice", "welcome"],
    ["thanks", "thank you"],
    ["what should i eat today"],
    ["bro"],
    ["what", "why", "how", "where", "when"],
    ["corona", "covid19", "coronavirus"],
    ["you are funny"],
    ["i dont know"],
    ["boring"],
    ["im tired"]
];

const botReply = [
    ["Hello!", "Hi!", "Hey!", "Hi there!"],
    ["Okay"],
    ["Yes I am! "],
    ["I'm sorry about that. But I like you, dude."],
    [
        "Fine... how are you?",
        "Pretty well, how are you?",
        "Fantastic, how are you?"
    ],
    ["Getting better. There?", "Somewhat okay!", "Yeah fine. Better stay home!"],
  
    [
        "Nothing much",
        "About to go to sleep",
        "Can you guess?",
        "I don't know actually"
    ],
    ["I am always young."],
    ["I am just a bot", "I am a bot. What are you?"],
    ["Sabitha Kuppusamy"],
    ["I am nameless", "I don't have a name"],
    ["I love you too", "Me too"],
    ["Have you ever felt bad?", "Glad to hear it"],
    ["Why?", "Why? You shouldn't!", "Try watching TV", "Chat with me."],
    ["What about?", "Once upon a time..."],
    ["Tell me a story", "Tell me a joke", "Tell me about yourself"],
    ["You're welcome"],
    ["Briyani", "Burger", "Sushi", "Pizza"],
    ["Dude!"],
    ["Yes?"],
    ["Please stay home"],
    ["Glad to hear it"],
    ["Say something interesting"],
    ["Sorry for that. Let's chat!"],
    ["Take some rest, Dude!"]
];

const alternative = [
    "Same here, dude.",
    "That's cool! Go on...",
    "Dude...",
    "Ask something else...",
    "Hey, I'm listening..."
];

function processUserInput(userInput) {
    let text = userInput.toLowerCase().replace(/[^\w\s\d]/gi, "");
  
    text = text
        .replace(/[\W_]/g, " ")
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "")
        .trim();
  
    let comparedText = compare(userMessage, botReply, text);
  
    let botResponse = comparedText
        ? comparedText
        : alternative[Math.floor(Math.random() * alternative.length)];
    addChat('Bot', botResponse);
}

function compare(triggerArray, replyArray, string) {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
        for (let y = 0; y < replyArray.length; y++) {
            if (triggerArray[x][y] == string) {
                item = replyArray[x];
                item = item[Math.floor(Math.random() * item.length)];
            }
        }
    }
    if (item) return item;
    else return containMessageCheck(string);
}

function containMessageCheck(string) {
    let expectedReply = [
        [
            "Good Bye, dude",
            "Bye, See you!",
            "Dude, Bye. Take care of your health in this situation."
        ],
        ["Good Night, dude", "Have a sound sleep", "Sweet dreams"],
        ["Have a pleasant evening!", "Good evening too", "Evening!"],
        ["Good morning, Have a great day!", "Morning, dude!"],
        ["Good Afternoon", "Noon, dude!", "Afternoon, dude!"]
    ];
    let expectedMessage = [
        ["bye", "tc", "take care"],
        ["night", "good night"],
        ["evening", "good evening"],
        ["morning", "good morning"],
        ["noon"]
    ];
    let item;
    for (let x = 0; x < expectedMessage.length; x++) {
        if (expectedMessage[x].includes(string)) {
            item = expectedReply[x];
            item = item[Math.floor(Math.random() * item.length)];
        }
    }
    return item;
}

function addChat(sender, messageText) {
    const mainDiv = document.getElementById("message-section");
    let senderDiv = document.createElement("div");
    senderDiv.id = sender.toLowerCase();
    senderDiv.classList.add("message");
    senderDiv.innerHTML = `<span id="${sender.toLowerCase()}-response">${messageText}</span>`;
    mainDiv.appendChild(senderDiv);
  
    var scroll = document.getElementById("message-section");
    scroll.scrollTop = scroll.scrollHeight;
    voiceControl(messageText);
}
