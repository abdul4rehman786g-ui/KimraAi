(function(){



// user data
const script = document.currentScript;
const userId = script?.dataset?.userId



const theme = "neon"
let assistantConfig = null



// Load CSS

const link = document.createElement("link")

link.rel = "stylesheet"

link.href = "https://kirma-ai-pjpg.vercel.app/assistant.css"

document.head.appendChild(link)
 

// Create Popup


const popup = document.createElement("div")

popup.className = `kimra-popup theme-${theme}`

popup.innerHTML = `

    <div class="kimra-overlay"></div>

    <div class="kimra-content">

      <div class="kimra-top">

        <!-- Orb -->
        <div class="kimra-orb-wrap">

          <div class="kimra-orb-glow"></div>

          <div class="kimra-orb"></div>

        </div>

        <!-- Assistant Title -->
        <h2 class="kimra-title">
          Hello! I'm kimra AI
        </h2>

        <!-- Assistant Subtitle -->
        <p class="kimra-sub">
          Your smart voice assistant.
          <br />
          Ask anything about your website.
        </p>

        <!-- Status -->
        <div class="kimra-status">
          Tap button to Speak
        </div>

        <!-- Voice Wave -->
        <div class="kimra-wave">

          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>

        <!-- User Text -->
        <div class="kimra-user-text"></div>

        <!-- AI Text -->
        <div class="kimra-ai-text"></div>

      </div>

      <!-- Bottom -->
      <div class="kimra-bottom">

       

        <!-- Mic Button -->
        <button class="kimra-mic">

          <img
            src="https://kirma-ai-pjpg.vercel.app/mic.svg"
            alt="mic"
            class="kimra-mic-icon"
          />

        </button>

      </div>

    </div>

  `;
document.body.appendChild(
    popup
  );



   const button =
    document.createElement("button");

  button.className =
    `kimra-btn theme-${theme}`;

  button.innerHTML = `
    <img
      src="https://kirma-ai-pjpg.vercel.app/logo.png"
      alt="logo"
    />
  `;

  document.body.appendChild(
    button
  );

  
const loadAssistant = async () => {
  try {
    const res = await fetch(
      `https://kimra-ba.vercel.app/api/assistant/config/${userId}`
    );

    const data = await res.json();




    if (data.user) {
  assistantConfig = data.user;
  applyConfig();
}

  } catch (error) {
    console.log("Assistant Load Error:", error);
  }
};



const applyConfig = () => {

  if (!assistantConfig)
    return;

  
  popup.className =
    `kimra-popup theme-${assistantConfig.theme}`;

  button.className =
    `kimra-btn theme-${assistantConfig.theme}`;

  
  const title =
    popup.querySelector(
      ".kimra-title"
    );

  title.innerText =
    `Hello! I'm ${assistantConfig.assistantName}`;

  const sub =
    popup.querySelector(
      ".kimra-sub"
    );

  sub.innerHTML = `
    Welcome to
    ${assistantConfig.businessName}.
    <br />
    Ask anything about your website.
  `;
};

  
loadAssistant();

  let open = false;

  button.onclick = () => {

    open = !open;

    popup.style.display =
      open
        ? "flex"
        : "none";
  };


const status = popup.querySelector(".kimra-status");
const wave = popup.querySelector(".kimra-wave");
const userText = popup.querySelector(".kimra-user-text");
const aiText = popup.querySelector(".kimra-ai-text");
const mic = popup.querySelector(".kimra-mic");

const speak = (text) => {
  window.speechSynthesis.cancel();
  aiText.innerText = text;
  status.innerText = "AI Speaking...";
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "hi-IN";
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  speech.onend = () => {
    status.innerText = "Tap button to Speak";
    wave.style.opacity = "0";
  };
  window.speechSynthesis.speak(speech);
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  mic.onclick = () => {
    wave.style.opacity = "1";
    status.innerText = "Listening...";
    userText.innerText = "";
    aiText.innerText = "";
    recognition.start();
  };

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    userText.innerText = "You: " + text;
    recognition.stop();

    setTimeout(async () => {
      try {
        status.innerText = "Thinking...";
        const res = await fetch("https://kimra-ba.vercel.app/api/assistant/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            userId,
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          if (data.action === "navigate") {
            speak(data.response);
            setTimeout(() => {
              window.location.href = data.path;
            }, 1500);
          } else {
            speak(data.aiResponse);
          }
        } else {
          speak(data.message);
        }
      } catch (error) {
        console.log(error);
        speak("Server Error");
      }
    }, 600);
  };

  recognition.onerror = () => {
    status.innerText = "Tap to Speak";
    wave.style.opacity = "0";
  };
} else {
  status.innerText = "Speech Recognition not supported";
}


})();


