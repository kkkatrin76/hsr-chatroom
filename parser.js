const version = "1.0";
const defaultTimeoutMs = 1500;
const defaultChoiceTimeoutMs = 2000;

var chats = ``;
var type = "";
var dir = "in";

let contentElem, emoteElem, picElem, callElem, timeoutElem, showifElem;
let choiceKey1Elem, choiceKey2Elem, choiceKey3Elem, choiceText1Elem, choiceText2Elem, choiceText3Elem, choiceEmote1Elem, choiceEmote2Elem, choiceEmote3Elem, choicePic1Elem, choicePic2Elem, choicePic3Elem;
let codeElem;
let content, emote, pic, call, showIf, timeout;
let choiceKey1, choiceKey2, choiceKey3, choiceText1, choiceText2, choiceText3, choiceEmote1, choiceEmote2, choiceEmote3, choicePic1, choicePic2, choicePic3;

async function init() {
    codeElem = document.getElementById('code');

    contentElem = document.getElementById('content-wrapper');
    emoteElem = document.getElementById('emote-wrapper');
    picElem = document.getElementById('pic-wrapper');
    callElem = document.getElementById('call-wrapper');
    timeoutElem = document.getElementById('timeout-wrapper');
    showifElem = document.getElementById('showif-wrapper');

    choiceKey1Elem = document.getElementById('choice-key-1-wrapper');
    choiceKey2Elem = document.getElementById('choice-key-2-wrapper');
    choiceKey3Elem = document.getElementById('choice-key-3-wrapper');
    choiceText1Elem = document.getElementById('choice-text-1-wrapper');
    choiceText2Elem = document.getElementById('choice-text-2-wrapper');
    choiceText3Elem = document.getElementById('choice-text-3-wrapper');
    choiceEmote1Elem = document.getElementById('choice-emote-1-wrapper');
    choiceEmote2Elem = document.getElementById('choice-emote-2-wrapper');
    choiceEmote3Elem = document.getElementById('choice-emote-3-wrapper');
    choicePic1Elem = document.getElementById('choice-pic-1-wrapper');
    choicePic2Elem = document.getElementById('choice-pic-2-wrapper');
    choicePic3Elem = document.getElementById('choice-pic-3-wrapper');

    content = document.getElementById('content');
    emote = document.getElementById('emote');
    pic = document.getElementById('pic');
    call = document.getElementById('call');
    showIf = document.getElementById('showif');
    timeout = document.getElementById('timeout');

    choiceKey1 = document.getElementById('choice-key-1-wrapper');
    choiceKey2 = document.getElementById('choice-key-2-wrapper');
    choiceKey3 = document.getElementById('choice-key-3-wrapper');
    choiceText1 = document.getElementById('choice-text-1-wrapper');
    choiceText2 = document.getElementById('choice-text-2-wrapper');
    choiceText3 = document.getElementById('choice-text-3-wrapper');
    choiceEmote1 = document.getElementById('choice-emote-1-wrapper');
    choiceEmote2 = document.getElementById('choice-emote-2-wrapper');
    choiceEmote3 = document.getElementById('choice-emote-3-wrapper');
    choicePic1 = document.getElementById('choice-pic-1-wrapper');
    choicePic2 = document.getElementById('choice-pic-2-wrapper');
    choicePic3 = document.getElementById('choice-pic-3-wrapper');

    await onChangeType();
}

async function appendVersion() {
    document.getElementById('version').innerHTML = "v" + version;
}

async function copyCode() {
    navigator.clipboard.writeText(codeElem.innerHTML);
    alert("Copied!");
}

async function appendItem() {
    let itemType = document.getElementById('item-type').value;
    let timeoutValue = defaultTimeoutMs;
    
    if (showIf) {
        chats += `
{
    showif: "${showIf.value}",`;
    } else {
        chats += `
{`;
    }

    switch(itemType) {

        case "timestamp":
            chats += `
    type: "ts",
    content: "${content.value}",
`;
            break;

//==================================================================
        case "chat-text": 
        chats += `
    type: "text",
    dir: "in",
    content: "${content.value}"
`;
            break;

//==================================================================
        case "chat-emote": 
        chats += `
    type: "emote",
    dir: "in",
    content: "emote/${content.value}"
`;
            break;

//==================================================================
        case "chat-pic": 
        chats += `
    type: "pic",
    dir: "in",
    content: "pic/${content.value}"
`;
            break;

//==================================================================
        case "choice-text": 
        chats += `
    type: "pic",
    dir: "in",
    content: "pic/${content.value}"
`;
            break;

//==================================================================
        case "choice-emote": 
            break;

//==================================================================
        case "choice-pic": 
            break;

//==================================================================
        case "choice-call": 
            break;

        case "pause":
            break;

//==================================================================
        case "notif": 
            break;

//==================================================================
        case "call": 
            break;

//==================================================================
        case "call-end": 
            break;

//==================================================================
        case "call-function": 
            break;

//==================================================================
    }

    if (!timeout.value) {
        chats += ``;
    } else if (timeout.value != timeoutValue) {
        chats += `    timeout: ${timeout.value}
`;
    }

    chats += `},`;

    codeElem.innerHTML = chats;
}

async function onChangeType() {
    let itemType = document.getElementById('item-type').value;

    // document.getElementById('timeout').value = defaultChoiceTimeoutMs;

    switch(itemType) {
        case "timestamp":
            type = "ts";
            timeout.value = defaultTimeoutMs;

            contentElem.classList.remove("hidden");
            emoteElem.classList.add("hidden");
            picElem.classList.add("hidden");
            callElem.classList.add("hidden");

            choiceKey1Elem.classList.add("hidden");
            choiceKey2Elem.classList.add("hidden");
            choiceKey3Elem.classList.add("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");

            break;

        case "chat-text": 
            type = "text";
            timeout.value = defaultTimeoutMs;

            contentElem.classList.remove("hidden");
            emoteElem.classList.add("hidden");
            picElem.classList.add("hidden");
            callElem.classList.add("hidden");

            choiceKey1Elem.classList.add("hidden");
            choiceKey2Elem.classList.add("hidden");
            choiceKey3Elem.classList.add("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");

            break;

        case "chat-emote": 
            type = "emote";
            timeout.value = defaultTimeoutMs;

            contentElem.classList.remove("hidden");
            emoteElem.classList.add("hidden");
            picElem.classList.add("hidden");
            callElem.classList.add("hidden");

            choiceKey1Elem.classList.add("hidden");
            choiceKey2Elem.classList.add("hidden");
            choiceKey3Elem.classList.add("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");
            
            break;

        case "chat-pic": 


            choiceKey1Elem.classList.add("hidden");
            choiceKey2Elem.classList.add("hidden");
            choiceKey3Elem.classList.add("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");
            
            break;

        case "choice-text": 
            type = "choice";
            timeout.value = defaultChoiceTimeoutMs;

            contentElem.classList.remove("hidden");
            textElem.classList.add("hidden");
            emoteElem.classList.add("hidden");
            picElem.classList.add("hidden");
            callElem.classList.add("hidden");

            choiceKey1Elem.classList.remove("hidden");
            choiceKey2Elem.classList.remove("hidden");
            choiceKey3Elem.classList.remove("hidden");
            choiceText1Elem.classList.remove("hidden");
            choiceText2Elem.classList.remove("hidden");
            choiceText3Elem.classList.remove("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");
            
            break;

        case "choice-emote": 
            type = "choice";
            timeout.value = defaultChoiceTimeoutMs;
            

            choiceKey1Elem.classList.remove("hidden");
            choiceKey2Elem.classList.remove("hidden");
            choiceKey3Elem.classList.remove("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.remove("hidden");
            choiceEmote2Elem.classList.remove("hidden");
            choiceEmote3Elem.classList.remove("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");
            
            break;

        case "choice-pic": 
            type = "choice";
            timeout.value = defaultChoiceTimeoutMs;

            choiceKey1Elem.classList.remove("hidden");
            choiceKey2Elem.classList.remove("hidden");
            choiceKey3Elem.classList.remove("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.remove("hidden");
            choicePic2Elem.classList.remove("hidden");
            choicePic3Elem.classList.remove("hidden");
            
            break;

        case "choice-call": 
            type = "choice";
            timeout.value = defaultChoiceTimeoutMs;


            choiceKey1Elem.classList.remove("hidden");
            choiceKey2Elem.classList.remove("hidden");
            choiceKey3Elem.classList.remove("hidden");
            choiceText1Elem.classList.add("hidden");
            choiceText2Elem.classList.add("hidden");
            choiceText3Elem.classList.add("hidden");
            choiceEmote1Elem.classList.add("hidden");
            choiceEmote2Elem.classList.add("hidden");
            choiceEmote3Elem.classList.add("hidden");
            choicePic1Elem.classList.add("hidden");
            choicePic2Elem.classList.add("hidden");
            choicePic3Elem.classList.add("hidden");
            
            break;

        case "pause":
            type = "pause";
            contentElem.classList.add("hidden");
            textElem.classList.add("hidden");
            emoteElem.classList.add("hidden");
            picElem.classList.add("hidden");
            callElem.classList.add("hidden");
            break;

        case "notif": 
            break;

        case "call": 
            break;

        case "call-end": 
            break;

        case "call-function": 
            break;

    }
}