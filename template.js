const version = "1.0";
const defaultTimeoutMs = 1500;
const defaultChoiceTimeoutMs = 2000;

var chats = {};
var chars = [];
var char = null;
var name = "[name]";
var chatHTML = "";
var choiceHTML = "";
var callHTML = "";
var lastChatIndex = -1;
var choicesSelection = [];
var choiceSelected = "";
var callCamStatus = "off";
var callMicStatus = "on";

var playChat = null;
var playTimeout = null;

function appendVersion() {
    document.getElementById('version').innerHTML = "v" + version;
}

function getBg() {
    let main = document.getElementById('main');
    let hours = new Date().getHours();

    // if (hours >= 6 && hours <= 12) {
    //     main.style.backgroundImage = "url('bg/old/day.jpg')";
    // } else if (hours > 12 && hours <= 19) {
    //     main.style.backgroundImage = "url('bg/old/evening.jpg')";
    // } else {
    //     main.style.backgroundImage = "url('bg/old/night.jpeg')";
    // }

    if (hours >= 0 && hours <= 5) {
        main.style.background = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.55)), url('bg/midnight.png')"
    } else if (hours > 5 && hours <= 9) {
        main.style.background = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.55)), url('bg/morning.png')"
    } else if (hours > 9 && hours <= 13) {
        main.style.background = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.55)), url('bg/day.png')"
    } else if (hours > 13 && hours <= 18) {
        main.style.background = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.55)), url('bg/afternoon.png')"
    } else {
        main.style.background = "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.55)), url('bg/night.png')"
    }
}

function getName() {
    name = localStorage.getItem("name");
    if (!name || name == undefined || name === "null") {
        name = prompt("Please enter your name", "[name]");
        if (!name || name == undefined || name === "null") {
            name = "[name]";
        }
        localStorage.setItem("name", name);
    }
    document.getElementById('your-name').innerHTML = name;

    if(window.innerHeight > window.innerWidth) {
        alertOrientation();
    }

    initChats();
    constructChatList();
}

function changeName() {
    name = prompt("Please enter your name", name);
    if (!name || name == undefined || name === "null") {
        name = "[name]";
    }
    localStorage.setItem("name", name);
    document.getElementById('your-name').innerHTML = name;
}

function initChats() {
    chats = {
        "jingyuan": [
            {
                type: "ts",
                content: "",
                timeout: 500
            }, {
                type: "text",
                dir: "in",
                content: `asdasd`,
                edited: true
            }, {
                type: "text",
                dir: "in",
                content: ``
            // }, {
            //     type: "choice",
            //     content: [{
            //         key: "x1-1",
            //         text: ""
            //     }, {
            //         key: "x1-2",
            //         text: ""
            //     }]
            // }, {
            //     type: "emote",
            //     dir: "in",
            //     content: `emote/xxx.png`
            // }, {
            //     type: "choice",
            //     content: [{
            //         key: "x1-1",
            //         text: ""
            //     }, {
            //         key: "x1-2",
            //         text: ""
            //     }],
            //     showif: ""
            // }, {
            //     type: "text",
            //     dir: "in",
            //     content: ``,
            //     showif: ""
            // }, {
            //     type: "pause",
            //     timeout: 6000
            // }, {
            //     type: "notif",
            //     content: `🦁 Ko Yuan 🧡 has poked you`,
            //     timeout: 5000
            // }, {
            //     type: "notif",
            //     content: "Call ended xh xm"
            // }, {
            //     type: "call",
            //     dir: "in",
            //     content: ``
            // }, {
            //     type: "call-audio",
            //     content: ``,
            //     timeout: 5000
            // }, {
            //     type: "callfunc",
            //     funcname: `changeCallIconStatus`,
            //     funcparams: [],
            //     functimeout: 5000
            }, {
                type: "callfunc",
                funcname: `editPrevChat`,
                content: 5000
            }
        ],
    }

    initChars();
    getChar();
}

function initChars() {
    // deep clone here so original chats stays intact
    chars = [
        {
            key: "jingyuan",
            name: "Yuan🦁Yuan",
            signature: `I'm not at the Seat of Divine Foresight or with ${name}`,
            pfp: "pfp/jingyuan1.gif",
            chatpfp: "pfp/jingyuan2.png",
            chats: JSON.parse(JSON.stringify(chats.jingyuan))
        }
    ];

    chars.sort((a, b) => {
        if(a.key < b.key) { return -1; }
        if(a.key > b.key) { return 1; }
        return 0;
    });
}

function getChar() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let charKey = urlParams.get('char');
    charKey = charKey ? charKey : ""

    if (!charKey) {
        return;
    }

    chars.forEach((c) => {
        if (charKey === c.key) {
            char = c;
        }
    });

    onSelectCharacter();
}

function selectCharacter(charKey) {
    chars.forEach((c) => {
        if (charKey === c.key) {
            char = c;
        }
    });

    onSelectCharacter();
}

function onSelectCharacter() {
    initChars();

    clearInterval(playChat);
    clearTimeout(playTimeout);

    resetTimer();
    // console.log({char})

    document.getElementById('chat-name').innerHTML = char.name;

    chatHTML = "";
    callHTML = "";
    choiceHTML = "";
    lastChatIndex = -1;
    choiceSelected = "";
    choicesSelection = [];

    let chatListDiv = document.getElementById('chat-list');
    let callListDiv = document.getElementById('call-list');
    let choiceListDiv = document.getElementById('choice-list');
    chatListDiv.innerHTML = chatHTML;
    callListDiv.innerHTML = callHTML;
    choiceListDiv.innerHTML = choiceHTML;

    playChatHistory();
}

function constructChatList() {
    let innerHTML = "";

    chars.forEach((c) => {
        innerHTML += `
            <div class="char-item">
                <button onclick="selectCharacter('${c.key}')">
                    <img class="char-pic" src="${c.pfp}"></img>
                    <div class="char-name">${c.name}</div>
                </button>
            </div>
        `;
    });

    document.getElementById('char-list').innerHTML = innerHTML;
}

function playChatHistory(intervalMs) {
    let i = 0, action = {};
    if (lastChatIndex > -1) {
        i = lastChatIndex;
        lastChatIndex = -1;
    }
    if (intervalMs === undefined) {
        intervalMs = defaultTimeoutMs;
    }
    playChat = setInterval(() => {
        if (i < char.chats.length) {
            action = appendChatHistory(i);
            i++;
            // console.log({lastChatIndex, i, action});
            if (action.command === "stop") {
                lastChatIndex = i;
                clearInterval(playChat);
            } else {
                lastChatIndex = i;
                clearInterval(playChat);
                playChatHistory(action.timeoutMs);
            }
        } else {
            clearInterval(playChat);
        }
    }, intervalMs);

    if (i >= char.chats.length) {
        appendEnding();
    }
}

function appendChatHistory(index) {
    let chat = char.chats[index];
    let command = "next";
    let timeoutMs = 0;
    let startCallTimerInterval = false;

    if (!chat) {
        return { command, timeoutMs };
    }

    if (choiceSelected) {
        if (chat.showif) {
            if (Array.isArray(chat.showif)) {
                let stop = true;
                chat.showif.forEach((si) => {
                    if (si === choiceSelected) {
                        stop = false;
                    }
                });
                if (stop) {
                    return { command, timeoutMs };
                }
            } else {
                if (chat.showif !== choiceSelected) {
                    return { command, timeoutMs };
                }
            }
        }
    }

    switch (chat.type) {
        case "ts":
            chatHTML += `
                <div class="chat-ts">- <span id="chat-ts">${chat.content}</span> -</div>
            `;
            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultTimeoutMs;
            break;

        case "notif":
            chatHTML += `
                <div class="chat-notif">${chat.content}</div>
            `;
            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultTimeoutMs;
            break;

        case "text":
        case "emote":
        case "pic":
            if (chat.dir === "in") {
                chatHTML += `
                    <div class="chat-bubble in">
                        <div class="left">
                            <img class="char-pic" src="${char.chatpfp}"></img>
                        </div>
                        <div class="right">
                            <div class="char-name">${char.name}</div>
                `;

                let editHTML = ``;
                if (chat.edited) {
                    editHTML = ` <span class="edited">(edited)</span>`;
                }

                if (chat.type === "text") {
                    chatHTML += `<div class="message">${chat.content}${editHTML}</div>`;
                } else if (chat.type === "emote") {
                    chatHTML += `<img class="emote" src="${chat.content}"></img>`;
                } else if (chat.type === "pic") {
                    chatHTML += `<img class="pic" src="${chat.content}"></img>`;
                }

                chatHTML += `
                        </div>
                    </div>
                `;
            } else {
                chatHTML += `
                    <div class="chat-bubble out">
                        <div class="left">
                            <div class="char-name">${name}</div>
                `;

                if (chat.type === "text") {
                    chatHTML += `<div class="message">${chat.content}</div>`;
                } else if (chat.type === "emote") {
                    chatHTML += `<img class="emote" src="${chat.content}"></img>`;
                } else if (chat.type === "pic") {
                    chatHTML += `<img class="pic" src="${chat.content}"></img>`;
                }

                chatHTML += `
                        </div>
                        <div class="right">
                            <img class="char-pic" src="pfp/you.png"></img>
                        </div>
                    </div>
                `;
            }
            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultTimeoutMs;
            break;

        case "call":
            if (!callStarted) {
                callStarted = true;
                startCallTimerInterval = true;

                callHTML += `
                    <div class="tray">
                        <div class="icon ${callMicStatus}"><img src="icons/mic_${callMicStatus}.svg" /></div>
                        <div class="icon ${callCamStatus}"><img src="icons/cam_${callCamStatus}.svg" /></div>
                        <div class="icon"><img src="icons/hangup.svg" /></div>
                    </div>
                `
            }

            callHTML += `<div class="message ${chat.dir}">${chat.content}</div>`;

            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultTimeoutMs;
            break;

        case "call-end":
            callHTML = "";
            resetTimer();
            break

        case "choice":
            command = "stop";
            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultChoiceTimeoutMs;

            choicesSelection = chat.content;
            // console.log({choicesSelection});

            chat.content.forEach((c) => {
                if (c.text) {
                    choiceHTML += `<button class="choice-btn" onclick="selectChoice('${c.key}')">${c.text}</button>`;
                } else if (c.emote) {
                    choiceHTML += `<button class="choice-btn emote" onclick="selectChoice('${c.key}')"><img src="${c.emote}"></img></button>`;
                } else if (c.pic) {
                    choiceHTML += `<button class="choice-btn emote" onclick="selectChoice('${c.key}')"><img src="${c.pic}"></img></button>`;
                } else if (c.call) {
                    choiceHTML += `<button class="choice-btn" onclick="selectChoice('${c.key}')">${c.call}</button>`;
                }
            });
            // console.log(choiceHTML);
            break;

        case "pause":
            chatHTML += ``;
            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultTimeoutMs;
            break;

        case "callfunc":
            if (chat.funcname === "changeCallIconStatus") {
                if (chat.timeout) {
                    let funcTimeout = setTimeout(() => {
                        changeCallIconStatus(chat.funcparams);
                        clearTimeout(funcTimeout);
                    }, chat.timeout);
                } else {
                    changeCallIconStatus(chat.funcparams);
                }
            } else if (chat.funcname === "editPrevChat") {
                chatHTML = chatHTML.replace(
                    `<div class="message">${char.chats[index-1].content}</div>`,
                    `<div class="message">${chat.content} <span class="edited">(edited)</span></div>`,
                )
                char.chats[index-1].content = chat.content;
                char.chats[index-1].edited = true;
            }
            break;
    }

    let chatListDiv = document.getElementById('chat-list');
    let callListDiv = document.getElementById('call-list');
    let choiceListDiv = document.getElementById('choice-list');

    // append html elements
    chatListDiv.innerHTML = chatHTML;
    choiceListDiv.innerHTML = choiceHTML;
    callListDiv.innerHTML = callHTML;

    // hide or show chat list or choice list accordingly
    if (choiceHTML) {
        playTimeout = setTimeout(() => {
            // chatListDiv.classList.add("hidden");
            // callListDiv.classList.add("hidden");
            choiceListDiv.classList.remove("hidden");
            chatListDiv.scrollTop = chatListDiv.scrollHeight;
            callListDiv.scrollTop = callListDiv.scrollHeight;
            clearTimeout(playTimeout);
        }, timeoutMs);
    } else if (callHTML) {
        chatListDiv.classList.add("hidden");
        callListDiv.classList.remove("hidden");
        choiceListDiv.classList.add("hidden");
    } else if (chatHTML) {
        chatListDiv.classList.remove("hidden");
        callListDiv.classList.add("hidden");
        choiceListDiv.classList.add("hidden");
    }

    // scroll chat list to the bottom and choice list to the top
    chatListDiv.scrollTop = chatListDiv.scrollHeight;
    callListDiv.scrollTop = callListDiv.scrollHeight;
    choiceListDiv.scrollTop = 0;

    if (startCallTimerInterval) {
        document.getElementById('call-timer').classList.remove("hidden");
        callTimerInterval = setInterval(setTime, 1000);
    }

    return { command, timeoutMs };
}

function appendEnding() {
    chatHTML += `<div class="chat-notif">- This chat has ended -</div>`;

    playTimeout = setTimeout(() => {
        let chatListDiv = document.getElementById('chat-list');
        chatListDiv.innerHTML = chatHTML;
        chatListDiv.scrollTop = chatListDiv.scrollHeight;
        clearTimeout(playTimeout);
    }, 1000);
}

function selectChoice(key) {
    let newItem = null;
    choicesSelection.forEach((item, i) => {
        if (item.key === key) {
            newItem = {
                type: item.call ? "call" : (item.pic ? "pic" : (item.text ? "text" : "emote")),
                dir: "out",
                content: item.call ? item.call : (item.pic ? item.pic : (item.text ? item.text : item.emote)),
                showif: key,
                timeout: item.timeout === undefined ? defaultTimeoutMs : item.timeout
            };
        }
    });

    // console.log({newItem});

    choiceSelected = key;
    choiceHTML = "";

    if (callHTML) {
        document.getElementById('call-list').classList.remove("hidden");
        document.getElementById('call-list').scrollTop = document.getElementById('call-list').scrollHeight;
    } else {
        document.getElementById('chat-list').classList.remove("hidden");
        document.getElementById('chat-list').scrollTop = document.getElementById('chat-list').scrollHeight;
    }
    document.getElementById('choice-list').classList.add("hidden");
    document.getElementById('choice-list').innerHTML = choiceHTML;

    char.chats.splice(lastChatIndex, 0, newItem);

    playChatHistory();
}

function changeCallIconStatus({ icon }) {
    if (icon === "mic") {
        let prevCallMicStatus = callMicStatus;
        callMicStatus = callMicStatus === "on" ? "off" : "on";
        callHTML = callHTML.replace(
            `class="icon ${prevCallMicStatus}"><img src="icons/mic_${prevCallMicStatus}.svg`,
            `class="icon ${callMicStatus}"><img src="icons/mic_${callMicStatus}.svg`
        );
    } else if (icon === "cam") {
        let prevCallCamStatus = callCamStatus;
        callCamStatus = callCamStatus === "on" ? "off" : "on";
        callHTML = callHTML.replace(
            `icon ${prevCallCamStatus}"><img src="icons/cam_${prevCallCamStatus}.svg`,
            `icon ${callCamStatus}"><img src="icons/cam_${callCamStatus}.svg`
        );
    }
    let callListDiv = document.getElementById('call-list');
    callListDiv.innerHTML = callHTML;
}

// Countup timer for call
var totalSeconds = 0;
var callStarted = false;
var callTimerInterval;

function setTime() {
    var minutesLabel = document.getElementById("timer-min");
    var secondsLabel = document.getElementById("timer-sec");
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function resetTimer() {
    totalSeconds = 0;
    callStarted = false;
    clearInterval(callTimerInterval);

    document.getElementById('call-timer').classList.add("hidden");
}

// Misc. functions
function formatTsFromADate(date, operator, day) {
    if (day === 1 && operator === "-") {
        return "Yesterday";
    }

    if (!date) {
        date = new Date();
    } else {
        date = new Date(date);
    }

    if (!operator || !day || day === 0) {
        return `${date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()}`;
    }

    if (operator === "+") {
        date.setDate(date.getDate() + day);
    } else if (operator === "-") {
        date.setDate(date.getDate() - day);
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

// Mobile device alert
var warned = false;
var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(orientationEvent, function() {
    // alert('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);
    if (window.orientation === 0 || window.orientation === 180) {
        if (!warned) {
            alertOrientation();
        }
    }
}, false);

function alertOrientation() {
    alert("Attention! Page best viewed in landscape orientation and optimized for PC 2560 × 1600 and iPhone 13 Pro screens.")
    warned = true;
}
