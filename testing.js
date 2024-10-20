const version = "2.03";
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

    if (hours >= 6 && hours <= 12) {
        main.style.backgroundImage = "url('bg/day.jpg')";
    } else if (hours > 12 && hours <= 19) {
        main.style.backgroundImage = "url('bg/evening.jpg')";
    } else {
        main.style.backgroundImage = "url('bg/night.jpg')";
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
    localStorage.removeItem("name");
    location.reload();
}

function initChats() {
    chats = {
        jingyuan: [
            {
                type: "text",
                dir: "in",
                content: `pspspsps`,
            },
            {
                type: "text",
                dir: "in",
                content: `${name}?`,
            },
            {
                type: "notif",
                dir: "in",
                content: `🦁 Ko Yuan 🧡 has poked you`,
            },
            {
                type: "notif",
                dir: "in",
                content: `🦁 Ko Yuan 🧡 has poked you`,
            },
            {
                type: "notif",
                dir: "in",
                content: `🦁 Ko Yuan 🧡 has poked you`,
            },
            {
                type: "text",
                dir: "in",
                content: `${name}`,
            },
            {
                type: "text",
                dir: "in",
                content: `${name}`,
                timeout: 4000
            },
            {
                type: "text",
                dir: "in",
                content: `Meow?`
            },
            {
                type: "choice",
                content: [
                    {
                        key: "jy1-1",
                        text: "m. meow?"
                    },
                    {
                        key: "jy1-2",
                        text: "???"
                    }
                ],
            },
            {
                type: "emote",
                dir: "in",
                content: `emote/jingyuan2.png`
            },
            {
                type: "emote",
                dir: "in",
                content: `emote/jingyuan5.png`
            },
        ],
        blade: [
            {
                type: "choice",
                content: [
                    {
                        key: "b1-1",
                        text: "meow"
                    }
                ],
            },
            {
                type: "pause",
                timeout: 3000
            },
            {
                type: "choice",
                content: [
                    {
                        key: "b2-1",
                        text: "meow?"
                    }
                ],
            },
            {
                type: "pause",
                timeout: 1000
            },
            {
                type: "choice",
                content: [
                    {
                        key: "b3-1",
                        text: "MEOW!!!!!!!!!!!"
                    }
                ],
            },
            {
                type: "emote",
                dir: "in",
                content: `emote/blade4.png`
            },
            {
                type: "text",
                dir: "in",
                content: `What now`,
            },
            {
                type: "choice",
                content: [
                    {
                        key: "b4-1",
                        text: "i 💙 u"
                    }
                ],
            },
            {
                type: "pause",
                timeout: 3000
            },
            {
                type: "text",
                dir: "in",
                content: `Ok`,
            },
            {
                type: "choice",
                content: [
                    {
                        key: "b5-1",
                        emote: "emote/tuskpir1.png"
                    },
                    {
                        key: "b5-2",
                        emote: "emote/pompom1.png"
                    }
                ],
            },
            {
                type: "text",
                dir: "in",
                content: `Alright, alright`,
                timeout: 4000
            },
            {
                type: "emote",
                dir: "in",
                content: `emote/pompom2.png`,
            },
            {
                type: "text",
                dir: "in",
                content: `Does that suffice?`,
            },
            {
                type: "choice",
                content: [
                    {
                        key: "b6-1",
                        emote: "emote/pompom3.png"
                    }
                ],
            },
        ],
        sunday: [
            {
                type: "choice",
                content: [
                    {
                        key: "su1-1",
                        text: "have your feathers molted yet?"
                    }
                ],
            },
            {
                type: "text",
                dir: "in",
                content: `Indeed it has.`,
            },
            {
                type: "text",
                dir: "in",
                content: `In fact, they <i>just</i> did.`,
            },
            {
                type: "choice",
                content: [
                    {
                        key: "su2-1",
                        text: "be there in an hour to pamper my favorite halovian ❤️"
                    }
                ],
            },
            {
                type: "text",
                dir: "in",
                content: `Oh my. Well, if it isn't too much of a trouble, that would be lovely.`,
            },
            {
                type: "text",
                dir: "in",
                content: `I'll have your favorite snacks prepared.`,
            },
            {
                type: "emote",
                dir: "in",
                content: `emote/sunday1.png`,
            },
        ]
    }

    initChars();
    getChar();
}

function initChars() {
    // deep clone here so original chats stays intact
    chars = [
        {
            key: "jingyuan",
            name: "🦁 Ko Yuan 🧡",
            pfp: "pfp/jingyuan1.png",
            chatpfp: "pfp/jingyuan1.png",
            signature: "A good day for a nap...",
            chats: JSON.parse(JSON.stringify(chats.jingyuan))
        },
        {
            key: "blade",
            name: "🗡️ my sad little meow meow 🐈‍⬛",
            pfp: "pfp/blade1.png",
            chatpfp: "pfp/blade1.png",
            signature: "",
            chats: JSON.parse(JSON.stringify(chats.blade))
        },
        {
            key: "sunday",
            name: "🐓🪽😇",
            pfp: "pfp/sunday1.png",
            chatpfp: "pfp/sunday1.png",
            signature: "If you are born weak, which god should you turn to for solace?",
            chats: JSON.parse(JSON.stringify(chats.sunday))
        },
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

function changeBg() {
    let main = document.getElementById('main');

    main.style.backgroundImage = `url('bg/unreadmessages/${char.key}.jpeg')`;
}
function callChangeBg({ path }) {
    let main = document.getElementById('main');

    main.style.backgroundImage = `url(${path})`;
}

function onSelectCharacter() {
    initChars();
    
    clearInterval(playChat);
    clearTimeout(playTimeout);

    resetTimer();
    // console.log({char})

    document.getElementById('chat-unselected').classList.add("hidden");
    document.getElementById('chat-info').classList.remove("hidden");
    document.getElementById('chat-list-wrapper').classList.remove("hidden");
    document.getElementById('c2').classList.remove("unselected");

    document.getElementById('chat-name').innerHTML = char.name;
    document.getElementById('chat-signature').innerHTML = char.signature.length > 0 ? char.signature : "No signature.";

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
                    <img class="char-arrow" src="icons/chevron.svg" />
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

    let choiceIsEmote = false;

    switch (chat.type) {
        case "ts":
            chatHTML += `
                <div class="chat-ts">- <span id="chat-ts">${chat.content}</span> -</div>
            `;
            timeoutMs = chat.timeout !== undefined ? chat.timeout : defaultTimeoutMs;
            break;

        case "notif":
            chatHTML += `
                <div class="chat-notif"><img src="${chat.icon ? chat.icon : "icons/warning.svg"}" /><span>${chat.content}</span></div>
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

                if (chat.type === "text") {
                    chatHTML += `<div class="message">${chat.content}</div>`;
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
                    choiceIsEmote = true;
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
            }
            if (chat.funcname === "changeBg") {
                if (chat.timeout) {
                    let funcTimeout = setTimeout(() => {
                        callChangeBg(chat.funcparams);
                        clearTimeout(funcTimeout);
                    }, chat.timeout);
                } else {
                    changeCallIconStatus(chat.funcparams);
                }
            }
            break
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
            if (choiceIsEmote) {
                choiceListDiv.classList.add("flex");
            }
            callListDiv.classList.add("hidden");
            choiceListDiv.classList.remove("hidden");

            // scroll chat list to the bottom and choice list to the top
            chatListDiv.scrollTop = chatListDiv.scrollHeight;
            callListDiv.scrollTop = callListDiv.scrollHeight;
            choiceListDiv.scrollTop = 0;
            
            clearTimeout(playTimeout);
        }, timeoutMs);
    } else if (callHTML) {
        choiceListDiv.classList.remove("flex");
        chatListDiv.classList.add("hidden");
        callListDiv.classList.remove("hidden");
        choiceListDiv.classList.add("hidden");
    } else if (chatHTML) {
        choiceListDiv.classList.remove("flex");
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
    chatHTML += `<div class="chat-notif"><img src="icons/offline.svg" /><span>Your friend ${char.name} is offline</span></div>`;

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
