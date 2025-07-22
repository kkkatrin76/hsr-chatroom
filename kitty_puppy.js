const version = "1.01";
const defaultTimeoutMs = 1500;
const defaultChoiceTimeoutMs = 500;
const defaultChoiceNextTimeoutMs = 1500;

var chats = {};
var chars = [];
var char = null;
var name = "[name]";
var yourPfp = "pfp/you.png";
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
    //     main.style.backgroundImage = "url('bg/day.jpg')";
    // } else if (hours > 12 && hours <= 19) {
    //     main.style.backgroundImage = "url('bg/evening.jpg')";
    // } else {
    //     main.style.backgroundImage = "url('bg/night.jpeg')";
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
        // "charkey": [
        //     {
        //         type: "ts",
        //         content: "",
        //         timeout: 500
        //     }, {
        //         type: "choice",
        //         content: [{
        //             key: "x1-1",
        //             text: ""
        //         }, {
        //             key: "x1-2",
        //             text: ""
        //         }],
        //         timeout: 500     // show this chat in {{timeout}} ms
        //     }, {
        //         type: "text",
        //         dir: "in",
        //         content: ``      // timeout for NEXT chat
        //     }, {
        //         type: "emote",
        //         dir: "in",
        //         content: `emote/xxx.png`
        //     }, {
        //         type: "choice",
        //         content: [{
        //             key: "x1-1",
        //             text: ""
        //         }, {
        //             key: "x1-2",
        //             text: ""
        //         }],
        //         showif: ""
        //     }, {
        //         type: "text",
        //         dir: "in",
        //         content: ``,
        //         showif: ""
        //     }, {
        //         type: "pause",
        //         timeout: 6000
        //     }, {
        //         type: "notif",
        //         content: `🦁 Ko Yuan 🧡 has poked you`,
        //         timeout: 5000
        //     }, {
        //         type: "notif",
        //         content: "Call ended xh xm"
        //     }, {
        //         type: "call",
        //         dir: "in",
        //         content: ``
        //     }, {
        //         type: "call-audio",
        //         content: ``,
        //         timeout: 5000
        //     }
        // ],
        blade: [{
            type: "ts",
            content: "15:43",
            timeout: 500
        }, {
            type: "choice",
            content: [{
                key: "b1-1",
                text: "pspspsps who's a good boy!!!",
            }, {
                key: "b1-2",
                text: "pspspsps here kitty kitty!",
            }],
            timeout: 500 // show this chat in {{timeout}} ms
        }, 
        // ====================================================
        {
            showif: "b1-1",
            type: "choice",
            content: [{
                key: "b1-1-1",
                text: "pspspspspspspsps"
            }],
            timeout: 500
        }, {
            showif: "b1-1-1",
            type: "choice",
            content: [{
                key: "b1-1-2",
                text: "BLADE PLAY WITH ME"
            }],
            timeout: 500
        }, {
            showif: "b1-1-2",
            type: "choice",
            content: [{
                key: "b1-1-3",
                text: "BLADE I NEED ENRICHMENT"
            }],
            timeout: 2000
        }, {
            showif: "b1-1-3",
            type: "text",
            dir: "in",
            content: `I doubt "good" is a suitable adjective to use here`,
            timeout: 3000
        }, {
            showif: "b1-1-3",
            type: "text",
            dir: "in",
            content: `If anything you are most definitely the puppy here, with that level of attention-seeking`,
            timeout: 4000
        }, {
            showif: "b1-1-3",
            type: "choice",
            content: [{
                key: "b1-1-4",
                text: "BARK BARK BARK"
            }, {
                key: "b1-1-5",
                text: "i am not a puppy >:("
            }]
        }, {
            showif: "b1-1-4",
            type: "text",
            dir: "in",
            content: `Stop`,
            timeout: 2000
        }, {
            showif: "b1-1-4",
            type: "choice",
            content: [{
                key: "b1-1-6",
                text: "WOOF WOOF WOOF AWROOOO"
            }]
        }, {
            showif: "b1-1-6",
            type: "text",
            dir: "in",
            content: `I can see that you are emulating a Siberian Husky`,
            timeout: 2000
        }, {
            showif: "b1-1-6",
            type: "text",
            dir: "in",
            content: `Stop.`,
            timeout: 4000
        }, {
            showif: "b1-1-6",
            type: "text",
            dir: "in",
            content: `Is encouraging insanity what the young kids call 'enrichment' these days`,
            timeout: 2000
        }, {
            showif: "b1-1-6",
            type: "choice",
            content: [{
                key: "b1-1-7",
                text: "you're no fun"
            }]
        }, {
            showif: "b1-1-7",
            type: "text",
            dir: "in",
            content: `I'll leave that responsibility to you`,
            timeout: 2000
        }, {
            showif: "b1-1-7",
            type: "choice",
            content: [{
                key: "b1-1-8",
                text: "rawr i'm blade i'm very not fun ← this is you rn"
            }]
        }, {
            showif: "b1-1-8",
            type: "text",
            dir: "in",
            content: `First you accuse me of being a dog and now a dinosaur`,
            timeout: 4000
        }, {
            showif: "b1-1-8",
            type: "text",
            dir: "in",
            content: `Make up your mind`,
            timeout: 2000
        }, {
            showif: "b1-1-5",
            type: "text",
            dir: "in",
            content: `Sure`,
            timeout: 5000
        }, {
            showif: "b1-1-5",
            type: "text",
            dir: "in",
            content: `Puppy.`,
            timeout: 2000
        }, {
            showif: "b1-1-5",
            type: "choice",
            content: [{
                key: "b1-1-5-1",
                text: "NOOOOOO"
            }]
        }, {
            showif: "b1-1-5-1",
            type: "text",
            dir: "in",
            content: `Remind me`,
            timeout: 5000
        }, {
            showif: "b1-1-5-1",
            type: "text",
            dir: "in",
            content: `Who wanted to be put in a collar last week?`,
            timeout: 3000
        }, {
            showif: "b1-1-5-1",
            type: "choice",
            content: [{
                key: "b1-1-5-2",
                text: "......."
            }]
        }, {
            showif: "b1-1-5-2",
            type: "text",
            dir: "in",
            content: `That's what I thought`,
            timeout: 2000
        }, 
        // ====================================================
        {
            showif: "b1-2",
            type: "text",
            dir: "in",
            content: `The mochi cat abomination is not with me`,
            timeout: 4000
        }, {
            showif: "b1-2",
            type: "text",
            dir: "in",
            content: `Last I checked Silver Wolf was using it as her armrest while she was playing her games`,
            timeout: 2000
        }, {
            showif: "b1-2",
            type: "choice",
            content: [{
                key: "b1-2-1",
                text: "AND YOU DIDNT THINK TO SAVE OUR SON???????????"
            }]
        }, {
            showif: "b1-2-1",
            type: "text",
            dir: "in",
            content: `No`,
            timeout: 2000
        }, {
            showif: "b1-2-1",
            type: "choice",
            content: [{
                key: "b1-2-2",
                text: "you are a horrible father"
            }]
        }, {
            showif: "b1-2-2",
            type: "text",
            dir: "in",
            content: `I told you it was a bad idea to adopt a pet`,
            timeout: 2000
        }, {
            showif: "b1-2-2",
            type: "choice",
            content: [{
                key: "b1-2-3",
                text: "dont talk as if you didnt feed him treats yesterday"
            }]
        }, {
            showif: "b1-2-3",
            type: "pause",
            timeout: 5000
        }, {
            showif: "b1-2-3",
            type: "text",
            dir: "in",
            content: `I never did that`,
            timeout: 2000
        }, {
            showif: "b1-2-3",
            type: "notif",
            content: "You sent a photo attachment",
            timeout: 5000
        }, {
            showif: "b1-2-3",
            type: "emote",
            dir: "in",
            content: `emote/blade1.png`,
            timeout: 4000
        }, {
            showif: "b1-2-3",
            type: "text",
            dir: "in",
            content: `That is not me`,
            timeout: 2000
        }, {
            showif: "b1-2-3",
            type: "choice",
            content: [{
                key: "b1-2-4",
                text: "then who was it? yingxing?"
            }]
        }, {
            showif: "b1-2-4",
            type: "pause",
            timeout: 5000
        }, {
            showif: "b1-2-4",
            type: "text",
            dir: "in",
            content: `Fine`,
            timeout: 2000
        }, {
            showif: "b1-2-4",
            type: "text",
            dir: "in",
            content: `I'll fetch the critter`,
            timeout: 2000
        }, {
            showif: "b1-2-4",
            type: "choice",
            content: [{
                key: "b1-2-5",
                text: "yayyyyyyyy come to bed soon i wanna cuddle you both"
            }]
        }, {
            showif: "b1-2-5",
            type: "emote",
            dir: "in",
            content: `emote/blade4.png`,
            timeout: 2000
        }],
        
        jingyuan: [{
            type: "ts",
            content: "14:02",
            timeout: 500
        }, {
            type: "choice",
            content: [{
                key: "j1-1",
                text: "pspspsps who's a good boy!!!",
            }, {
                key: "j1-2",
                text: "pspspsps here kitty kitty!",
            }]
        }, 
        // ====================================================
        {
            showif: "j1-1",
            type: "emote",
            dir: "in",
            content: "emote/jingyuan6.png",
            timeout: 3000
        }, {
            showif: "j1-1",
            type: "text",
            dir: "in",
            content: "Boy?"
        }, {
            showif: "j1-1",
            type: "choice",
            content: [{
                key: "j1-1-1",
                text: "BOY :3"
            }, {
                key: "j1-1-2",
                text: "sorry you're right"
            }]
        }, {
            showif: "j1-1-1",
            type: "emote",
            dir: "in",
            content: "emote/jingyuan1.png"
        }, {
            showif: "j1-1-1",
            type: "text",
            dir: "in",
            content: "Me?"
        }, {
            showif: "j1-1-2",
            type: "choice",
            content: [{
                key: "j1-1-3",
                text: "WHO'S A GOOD MAN!!!!!"
            }]
        }, {
            showif: "j1-1-3",
            type: "emote",
            dir: "in",
            content: "emote/jingyuan3.png"
        }, {
            showif: "j1-1-3",
            type: "text",
            dir: "in",
            content: "Me!"
        }, {
            showif: ["j1-1-1","j1-1-3"],
            type: "choice",
            content: [{
                key: "j1-1-4",
                text: "yes you areeeeee ❤️"
            }]
        }, {
            showif: "j1-1-4",
            type: "text",
            dir: "in",
            content: "Goodness me.",
            timeout: 2000
        }, {
            showif: "j1-1-4",
            type: "text",
            dir: "in",
            content: `You are such a healing presence in my life, my beloved ${name}.`,
            timeout: 3000
        }, {
            showif: "j1-1-4",
            type: "text",
            dir: "in",
            content: "If you missed me so much, you could've just dropped by the Seat of Divine Foresight.",
            timeout: 2000
        }, {
            showif: "j1-1-4",
            type: "text",
            dir: "in",
            content: "I would have been honored to welcome you and keep you company."
        }, {
            showif: "j1-1-4",
            type: "choice",
            content: [{
                key: "j1-1-5",
                text: "yuan, you just wanted an excuse to slack off"
            }]
        }, {
            showif: "j1-1-5",
            type: "text",
            dir: "in",
            content: "Haha, oh dear."
        }, {
            showif: "j1-1-5",
            type: "text",
            dir: "in",
            content: "Am I truly that transparent to you?",
            timeout: 3000
        }, {
            showif: "j1-1-5",
            type: "text",
            dir: "in",
            content: "Be that as it may, seeing you after toiling for hours buried in yawn-inducing paperwork would surely lift my spirits..."
        }, {
            showif: "j1-1-5",
            type: "choice",
            content: [{
                key: "j1-1-6",
                text: "okay okay i'll be there in an hour"
            }]
        }, {
            showif: "j1-1-6",
            type: "emote",
            dir: "in",
            content: "emote/jingyuan3.png"
        },
        // ====================================================
        {
            showif: "j1-2",
            type: "emote",
            dir: "in",
            content: "emote/jingyuan1.png",
            timeout: 3000
        }, {
            showif: "j1-2",
            type: "text",
            dir: "in",
            content: "Meow?"
        }, {
            showif: "j1-2",
            type: "choice",
            content: [{
                key: "j1-2-1",
                text: "OHMFYEJDHWKOFBWLXHSKCKWB"
            }]
        }, {
            showif: "j1-2-1",
            type: "choice",
            content: [{
                key: "j1-2-2",
                text: "ALL THE SCRITCHES. ALL THE SCRITCHES AND TREATOS FOR YOU MY LOVEEEE"
            }]
        }, {
            showif: "j1-2-2",
            type: "emote",
            dir: "in",
            content: "emote/jingyuan3.png",
            timeout: 3000
        }, {
            showif: "j1-2-2",
            type: "text",
            dir: "in",
            content: "Will you be visiting me today, my love?"
        }, {
            showif: "j1-2-2",
            type: "choice",
            content: [{
                key: "j1-2-3",
                text: "sorry, i'm too busy today ;("
            }, {
                key: "j1-2-4",
                text: "yes ofc!!!"
            }]
        }, {
            showif: "j1-2-3",
            type: "text",
            dir: "in",
            content: "I see. That's okay, don't feel bad.",
            timeout: 3000
        }, {
            showif: "j1-2-3",
            type: "text",
            dir: "in",
            content: "I'll come visit you instead, my workload for the day is almost finished."
        }, {
            showif: "j1-2-3",
            type: "text",
            dir: "in",
            content: "Meow~"
        }, {
            showif: "j1-2-3",
            type: "choice",
            content: [{
                key: "j1-2-5",
                text: "okay!! :))"
            }]
        }, {
            showif: "j1-2-4",
            type: "text",
            dir: "in",
            content: "Oh?",
            timeout: 2000
        }, {
            showif: ["j1-2-4"],
            type: "text",
            dir: "in",
            content: "I'm honored to be graced by your presence this afternoon."
        }, {
            showif:["j1-2-4"],
            type: "text",
            dir: "in",
            content: "I shall fluff your favorite cushions.",
            timeout: 3000
        }, {
            showif: ["j1-2-4", "j1-2-5"],
            type: "text",
            dir: "in",
            content: "In return, will you allow me (your favorite kitten) to lounge on your lap for a little nap?"
        }, {
            showif: ["j1-2-4", "j1-2-5"],
            type: "emote",
            dir: "in",
            content: "emote/jingyuan2.png"
        }],
        
        mydei: [{
            type: "ts",
            content: "16:45",
            timeout: 500
        }, {
            type: "choice",
            content: [{
                key: "m1-1",
                text: "pspspsps who's a good boy!!!",
            }, {
                key: "m1-2",
                text: "pspspsps here kitty kitty!",
            }]
        }, 
        // ====================================================
        {
            showif: "m1-1",
            type: "emote",
            dir: "in",
            content: "emote/mydei1.png"
        }, {
            showif: "m1-1",
            type: "text",
            dir: "in",
            content: "Who?"
        }, {
            showif: "m1-1",
            type: "choice",
            content: [{
                key: "m1-1-1",
                text: "You!!!!!",
            }, {
                key: "m1-1-2",
                text: "Phainon!!!!!",
            }]
        }, {
            showif: "m1-1-1",
            type: "text",
            dir: "in",
            content: `"Boys" doesn't exist in a Kremnoan's dictionary.`
        }, {
            showif: "m1-1-1",
            type: "text",
            dir: "in",
            content: `We only have "men".`
        }, {
            showif: "m1-1-1",
            type: "choice",
            content: [{
                key: "m1-1-3",
                text: "Babe be fr with me for a sec, how thin is the Kremnoan's dictionary",
            }]
        }, {
            showif: "m1-1-3",
            type: "text",
            dir: "in",
            content: `Who knows.`
        }, {
            showif: "m1-1-2",
            type: "text",
            dir: "in",
            content: "........."
        }, {
            showif: "m1-1-2",
            type: "text",
            dir: "in",
            content: `Why are you texting me then?`
        }, {
            showif: "m1-1-2",
            type: "choice",
            content: [{
                key: "m1-1-4",
                text: "I was just kidding ofc you're the goodest boy please don't sulk",
            }]
        }, {
            showif: "m1-1-4",
            type: "text",
            dir: "in",
            content: `I wasn't sulking.`
        }, {
            showif: ["m1-1-3", "m1-1-4"],
            type: "text",
            dir: "in",
            content: `If you're done fooling around, come back home.`
        }, {
            showif: ["m1-1-3", "m1-1-4"],
            type: "text",
            dir: "in",
            content: `I made you honey pancakes.`
        },
        // ====================================================
        {
            showif: "m1-2",
            type: "text",
            dir: "in",
            content: "No."
        }, {
            showif: "m1-2",
            type: "choice",
            content: [{
                key: "m1-2-1",
                text: "Please...... You'll look sooooo cute with these cat ears............",
            }]
        }, {
            showif: "m1-2-1",
            type: "text",
            dir: "in",
            content: "No."
        }, {
            showif: "m1-2-1",
            type: "choice",
            content: [{
                key: "m1-2-2",
                text: "PLEASEEEE",
            }]
        }, {
            showif: "m1-2-2",
            type: "text",
            dir: "in",
            content: "I'm busy."
        }, {
            showif: "m1-2-2",
            type: "choice",
            content: [{
                key: "m1-2-3",
                text: "I WANT MY MEOWDEIIIIIIIIII",
            }]
        }, {
            showif: "m1-2-3",
            type: "text",
            dir: "in",
            content: "I'm exercising."
        }, {
            showif: "m1-2-3",
            type: "choice",
            content: [{
                key: "m1-2-4",
                text: "Okay fine.... What about lion ears? Will you wear those? :3",
            }, {
                key: "m1-2-5",
                text: "Pretty please? With pommy milk on top??",
            }, {
                key: "m1-2-6",
                text: "Oh.",
            }]
        }, {
            showif: "m1-2-4",
            type: "emote",
            dir: "in",
            content: "emote/mydei1.png"
        }, {
            showif: "m1-2-4",
            type: "text",
            dir: "in",
            content: "Perhaps."
        }, {
            showif: "m1-2-4",
            type: "choice",
            content: [{
                key: "m1-2-7",
                text: "with the tail too?",
            }]
        }, {
            showif: "m1-2-7",
            type: "text",
            dir: "in",
            content: "Don't push your luck."
        }, 
        
        {
            showif: "m1-2-5",
            type: "text",
            dir: "in",
            content: "....."
        }, {
            showif: "m1-2-5",
            type: "text",
            dir: "in",
            content: "I'm listening."
        }, {
            showif: "m1-2-5",
            type: "choice",
            content: [{
                key: "m1-2-8",
                text: "i'll bring a custard pudding too ❤️",
            }]
        }, {
            showif: "m1-2-8",
            type: "text",
            dir: "in",
            content: "Very well, we have a deal."
        }, {
            showif: "m1-2-8",
            type: "text",
            dir: "in",
            content: "But it must be done within our abode.",
            timeout: 3000
        }, {
            showif: "m1-2-8",
            type: "text",
            dir: "in",
            content: "And no photos."
        }, {
            showif: "m1-2-8",
            type: "text",
            dir: "in",
            content: "Or videos.",
            timeout: 3000
        }, {
            showif: "m1-2-8",
            type: "text",
            dir: "in",
            content: "Or anything that would leave behind a record."
        }, 
        
        {
            showif: "m1-2-6",
            type: "choice",
            content: [{
                key: "m1-2-10",
                text: "Well then....... Can I watch? :)",
            }]
        }, {
            showif: "m1-2-10",
            type: "text",
            dir: "in",
            content: "Again?"
        }, {
            showif: "m1-2-10",
            type: "choice",
            content: [{
                key: "m1-2-11",
                pic: "pic/kitten_cry.GIF",
            }]
        }, {
            showif: "m1-2-11",
            type: "text",
            dir: "in",
            content: "Tch.",
            timeout: 3000
        }, {
            showif: "m1-2-11",
            type: "text",
            dir: "in",
            content: "You're very lucky you're cute."
        }, {
            showif: "m1-2-11",
            type: "text",
            dir: "in",
            content: "Bring me an extra water bottle."
        }],

        phainon: [{
            type: "ts",
            content: "17:16",
            timeout: 500
        }, {
            type: "choice",
            content: [{
                key: "p1-1",
                text: "pspspsps who's a good boy!!!",
            }, {
                key: "p1-2",
                text: "pspspsps here kitty kitty!",
            }]
        }, 
        // ====================================================
        {
            showif: "p1-1",
            type: "emote",
            dir: "in",
            content: "emote/phainon2.png"
        }, {
            showif: "p1-1",
            type: "text",
            dir: "in",
            content: "Me?"
        }, {
            showif: "p1-1",
            type: "choice",
            content: [{
                key: "p1-1-1",
                text: "YES YES YOU AREEEEEEEE",
            }]
        }, {
            showif: "p1-1-1",
            type: "text",
            dir: "in",
            content: ":)",
            timeout: 2000
        }, {
            showif: "p1-1-1",
            type: "text",
            dir: "in",
            content: "Well, since dogs, like chimeras, need regular walks...",
            timeout: 2500
        }, {
            showif: "p1-1-1",
            type: "text",
            dir: "in",
            content: "Can we take a walk around Marmoreal Market this afternoon then?"
        }, {
            showif: "p1-1-1",
            type: "choice",
            content: [{
                key: "p1-1-2",
                text: "Anything for my puppy ❤️",
            }, {
                key: "p1-1-3",
                text: "Hmmm idk...",
            }]
        }, {
            showif: "p1-1-3",
            type: "pause",
            timeout: 5000
        }, {
            showif: "p1-1-3",
            type: "notif",
            content: "Phainon sent you an audio message"
        }, {
            showif: "p1-1-3",
            type: "notif",
            content: "<i>[ Audio messaege transcription unavailable ]</i>"
        }, {
            showif: "p1-1-3",
            type: "choice",
            content: [{
                key: "p1-1-4",
                text: "Did. Did you just bark for me",
            }]
        }, {
            showif: "p1-1-4",
            type: "pause",
            timeout: 5000
        }, {
            showif: "p1-1-4",
            type: "notif",
            content: "Phainon sent you an audio message"
        }, {
            showif: "p1-1-4",
            type: "notif",
            content: "<i>[ Audio messaege transcription unavailable ]</i>"
        }, {
            showif: "p1-1-4",
            type: "choice",
            content: [{
                key: "p1-1-5",
                text: "STOP WHINING YOU'RE SHAMELESS OMG OK FINE",
            }]
        }, {
            showif: ["p1-1-2", "p1-1-5"],
            type: "emote",
            dir: "in",
            content: "emote/chimera3.png"
        },
        // ====================================================
        {
            showif: "p1-2",
            type: "text",
            dir: "in",
            content: "Me?"
        }, {
            showif: "p1-2",
            type: "emote",
            dir: "in",
            content: "emote/chimera1.png",
            timeout: 3000
        }, {
            showif: "p1-2",
            type: "text",
            dir: "in",
            content: "But the other day you called me a puppy...."
        }, {
            showif: "p1-2",
            type: "choice",
            content: [{
                key: "p1-2-1",
                text: "Either way, the point is that you're adorable ❤️",
            }]
        }, {
            showif: "p1-2-1",
            type: "emote",
            dir: "in",
            content: "emote/phainon1.png",
            timeout: 2000
        }, {
            showif: "p1-2-1",
            type: "text",
            dir: "in",
            content: `${name}, you're making me blush haha`,
            timeout: 3000
        }, {
            showif: "p1-2-1",
            type: "text",
            dir: "in",
            content: `You're adorable too! Like this endearing little chimera I saw the other day ❤️`,
            timeout: 4000
        }, {
            showif: "p1-2-1",
            type: "text",
            dir: "in",
            content: `If we were both chimeras, do you think we'd have a happy little chimera family?`
        }, {
            showif: "p1-2-1",
            type: "choice",
            content: [{
                key: "p1-2-2",
                text: "That's too cute of an idea.... Are you trying to make me cry???",
            }, {
                key: "p1-2-3",
                text: "Do chimeras even have the ability to reproduce....?",
            }]
        }, {
            showif: "p1-2-2",
            type: "text",
            dir: "in",
            content: `Noooo don't cry! I'm sorry ;(`,
            timeout: 3000
        }, {
            showif: "p1-2-2",
            type: "text",
            dir: "in",
            content: `Coming over ASAP with chocolates and a cute little chimera for you to pet wait for me`
        }, {
            showif: "p1-2-3",
            type: "text",
            dir: "in",
            content: `.... A good question.`,
            timeout: 3000
        }, {
            showif: "p1-2-3",
            type: "text",
            dir: "in",
            content: `Well, we can always adopt! :D`,
            timeout: 4000
        }, {
            showif: "p1-2-3",
            type: "text",
            dir: "in",
            content: `Now I'm imagining your little chimera form.....`,
            timeout: 4000
        }, {
            showif: "p1-2-3",
            type: "text",
            dir: "in",
            content: `.........`
        }, {
            showif: "p1-2-3",
            type: "notif",
            content: "Phainon is offline"
        }, {
            showif: "p1-2-3",
            type: "choice",
            content: [{
                key: "p1-2-4",
                text: "Uh oh",
            }]
        }, {
            showif: "p1-2-4",
            type: "notif",
            content: "Phainon is offline"
        }, {
            showif: "p1-2-4",
            type: "choice",
            content: [{
                key: "p1-2-5",
                text: "Phainon NO",
            }]
        }, {
            showif: "p1-2-5",
            type: "notif",
            content: "Phainon is offline"
        }, {
            showif: "p1-2-5",
            type: "choice",
            content: [{
                key: "p1-2-6",
                text: "PHAINON",
            }]
        }, {
            showif: "p1-2-6",
            type: "notif",
            content: "Phainon is offline"
        }, {
            showif: "p1-2-6",
            type: "choice",
            content: [{
                key: "p1-2-7",
                text: "PHAINON KHASLANA DO NOT",
            }]
        }, {
            showif: "p1-2-7",
            type: "text",
            dir: "in",
            content: `Coming back home in 30 with a gift for you`
        }, {
            showif: "p1-2-7",
            type: "text",
            dir: "in",
            content: `Could you make sure we have milk and berries in the fridge I think they're a little peckish`
        }],
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
        },
        {
            key: "blade",
            name: "🐾 Guard Dog 🗡️",
            signature: "<i>Signature unavailable</i>",
            pfp: "pfp/blade1.gif",
            chatpfp: "pfp/blade2.png",
            chats: JSON.parse(JSON.stringify(chats.blade))
        },
        {
            key: "mydei",
            name: "👑💪🏻",
            signature: `No, I don't know where ${name} is.`,
            pfp: "pfp/mydei1.gif",
            chatpfp: "pfp/mydei2.png",
            chats: JSON.parse(JSON.stringify(chats.mydei))
        },
        {
            key: "phainon",
            name: "💙💛💙 Snowy 💛💙💛",
            signature: `${name}'s husband 💕`,
            pfp: "pfp/phainon1.gif",
            chatpfp: "pfp/phainon2.png",
            chats: JSON.parse(JSON.stringify(chats.phainon))
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
    // console.log("selectCharacter")
    chars.forEach((c) => {
        if (charKey === c.key) {
            char = c;
        }
    });

    onSelectCharacter();
}

function onSelectCharacter() {
    document.getElementById('c2').classList.remove("unselected");
    document.getElementById('chat-unselected').classList.add("hidden");
    document.getElementById('chat-info').classList.remove("hidden");
    document.getElementById('chat-list-wrapper').classList.remove("hidden");

    initChars();

    clearInterval(playChat);
    clearTimeout(playTimeout);

    resetTimer();
    // console.log({char})

    document.getElementById('chat-name').innerHTML = char.name;
    document.getElementById('chat-signature').innerHTML = char.signature;

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
            console.log({lastChatIndex, i, action});
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
                <div class="chat-notif"><img src="icons/warning.svg" /> ${chat.content}</div>
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
    choiceListDiv.scrollTop = 0;
    chatListDiv.scrollTop = chatListDiv.scrollHeight;
    callListDiv.scrollTop = callListDiv.scrollHeight;

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
                timeout: item.timeout === undefined ? defaultChoiceNextTimeoutMs : item.timeout
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
