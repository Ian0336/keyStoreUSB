/* pages */
let verifyPage = {
  body: `
<button id="verifyBtn" class="button">
  <div class="svg-wrapper-1">
    <div class="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path
          fill="currentColor"
          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
        ></path>
      </svg>
    </div>
  </div>
  <span>Verify</span>
</button>
<button id="newBtn" class="button">
  <div class="svg-wrapper-2">
    <div class="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-plus"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
  </div>
  <span>Sign up</span>
</button>
`,
  verifyFunc: () => {
    if (!port) return;
    console.log("verify");
    userData.type = "verify";
    userData.id = Math.floor(Math.random() * 100000).toString();
    userData.url = window.location.href.split("/")[2];
    userData.username = "";
    userData.password = "";
    let tmpStr = JSON.stringify(userData);
    let arr = [];
    for (let i = 0, j = tmpStr.length; i < j; ++i) {
      arr.push(tmpStr.charCodeAt(i));
    }
    let tmpUint8Array = new Uint8Array(arr);
    console.log(tmpUint8Array);
    port.send(tmpUint8Array);
    verifyPage.destroy();
    loadingPage.init();
  },
  newFunc: () => {
    console.log("new");
    verifyPage.destroy();
    signUpPage.init();
  },
  init: () => {
    document.getElementById("mainArea").innerHTML = verifyPage.body;
    verifyPage.verifyBtn = document.getElementById("verifyBtn");
    verifyPage.newBtn = document.getElementById("newBtn");
    verifyPage.verifyBtn.addEventListener("click", verifyPage.verifyFunc);
    verifyPage.newBtn.addEventListener("click", verifyPage.newFunc);
    state = "verifyPage";
  },
  destroy: () => {
    state = "";
    verifyPage.verifyBtn.removeEventListener("click", verifyPage.verifyFunc);
    verifyPage.newBtn.removeEventListener("click", verifyPage.newFunc);
  },
};
let signUpPage = {
  body: `<input
  type="text"
  autocomplete="off"
  name="text"
  class="input"
  placeholder="Username"
  id="usernameInput"
/>
<input
  type="text"
  autocomplete="off"
  name="text"
  class="input"
  placeholder="Password"
  id="passwordInput"
/>
<button id="verifyBtn" class="button">
  <div class="svg-wrapper-1">
    <div class="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path
          fill="currentColor"
          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
        ></path>
      </svg>
    </div>
  </div>
  <span>Verify</span>
</button>`,
  verifyFunc: () => {
    if (!port) return;
    if (signUpPage.verifyBtn.disabled) return;
    console.log("new account");
    userData.type = "new";
    userData.id = Math.floor(Math.random() * 100000).toString();
    userData.url = window.location.href.split("/")[2];
    userData.username = signUpPage.usernameText;
    userData.password = signUpPage.passwordText;
    let tmpStr = JSON.stringify(userData);
    let arr = [];
    for (let i = 0, j = tmpStr.length; i < j; ++i) {
      arr.push(tmpStr.charCodeAt(i));
    }
    let tmpUint8Array = new Uint8Array(arr);
    console.log(tmpUint8Array);
    port.send(tmpUint8Array);
    signUpPage.destroy();
    loadingPage.init();
  },
  usernameFunc: (e) => {
    signUpPage.usernameText = e.target.value;
    console.log(signUpPage.usernameText);
    if (
      signUpPage.usernameText.length > 0 &&
      signUpPage.passwordText.length > 0
    )
      signUpPage.verifyBtn.disabled = false;
    else signUpPage.verifyBtn.disabled = true;
  },
  passwordFunc: (e) => {
    signUpPage.passwordText = e.target.value;
    if (
      signUpPage.usernameText.length > 0 &&
      signUpPage.passwordText.length > 0
    )
      signUpPage.verifyBtn.disabled = false;
    else signUpPage.verifyBtn.disabled = true;
  },
  usernameText: "",
  passwordText: "",
  init: () => {
    document.getElementById("mainArea").innerHTML = signUpPage.body;
    signUpPage.verifyBtn = document.getElementById("verifyBtn");
    signUpPage.usernameInput = document.getElementById("usernameInput");
    signUpPage.passwordInput = document.getElementById("passwordInput");
    signUpPage.verifyBtn.addEventListener("click", signUpPage.verifyFunc);
    signUpPage.usernameInput.addEventListener(
      "change",
      signUpPage.usernameFunc
    );
    signUpPage.passwordInput.addEventListener(
      "change",
      signUpPage.passwordFunc
    );
    state = "signUpPage";
    if (
      signUpPage.usernameText.length > 0 &&
      signUpPage.passwordText.length > 0
    )
      signUpPage.verifyBtn.disabled = false;
    else signUpPage.verifyBtn.disabled = true;
  },
  destroy: () => {
    state = "";
    signUpPage.verifyBtn.removeEventListener("click", signUpPage.verifyFunc);
    signUpPage.usernameInput.removeEventListener(
      "change",
      signUpPage.usernameFunc
    );
    signUpPage.passwordInput.removeEventListener(
      "change",
      signUpPage.passwordFunc
    );
  },
};
let loadingPage = {
  body: `<span class="loader"></span>
  <div class="svgContainer" id="svgContainer">
    <svg
      width="100px"
      height="100px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z"
        fill="#757575"
      />
    </svg>

    <svg
      width="100px"
      height="100px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 10V4.6C17 4.03995 17 3.75992 16.891 3.54601C16.7951 3.35785 16.6422 3.20487 16.454 3.10899C16.2401 3 15.9601 3 15.4 3H8.6C8.03995 3 7.75992 3 7.54601 3.10899C7.35785 3.20487 7.20487 3.35785 7.10899 3.54601C7 3.75992 7 4.03995 7 4.6V10M10.5 7V6M13.5 7V6M11.4 21H12.6C14.8402 21 15.9603 21 16.816 20.564C17.5686 20.1805 18.1805 19.5686 18.564 18.816C19 17.9603 19 16.8402 19 14.6V11.6C19 11.0399 19 10.7599 18.891 10.546C18.7951 10.3578 18.6422 10.2049 18.454 10.109C18.2401 10 17.9601 10 17.4 10H6.6C6.03995 10 5.75992 10 5.54601 10.109C5.35785 10.2049 5.20487 10.3578 5.10899 10.546C5 10.7599 5 11.0399 5 11.6V14.6C5 16.8402 5 17.9603 5.43597 18.816C5.81947 19.5686 6.43139 20.1805 7.18404 20.564C8.03968 21 9.15979 21 11.4 21Z"
        stroke="#757575"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>`,
  init: () => {
    document.getElementById("mainArea").innerHTML = loadingPage.body;
    state = "loadingPage";
    let loopTimer = setInterval(() => {
      if (receivedData.includes("}")) {
        console.log(receivedData);
        loadingPage.destroy();
        successPage.init();
        clearInterval(loopTimer);
      }
    }, 500);
  },
  destroy: () => {
    state = "";
  },
};
let successPage = {
  body: `<div class="success-animation">
  <svg
    class="checkmark"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
  >
    <circle
      class="checkmark__circle"
      cx="26"
      cy="26"
      r="25"
      fill="none"
    />
    <path
      class="checkmark__check"
      fill="none"
      d="M14.1 27.2l7.1 7.2 16.7-16.8"
    />
  </svg>
</div>
<div class="copyArea" id="copyArea">
  username
  <button class="copyyy" id="usernameCopyBtn">
    <span
      data-text-end="Copied!"
      data-text-initial="Copy to clipboard"
      class="tooltippp"
    ></span>
    <span>
      <svg
        xml:space="preserve"
        style="enable-background: new 0 0 512 512"
        viewBox="0 0 6.35 6.35"
        y="0"
        x="0"
        height="20"
        width="20"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="clipboard"
      >
        <g>
          <path
            fill="currentColor"
            d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
          ></path>
        </g>
      </svg>
      <svg
        xml:space="preserve"
        style="enable-background: new 0 0 512 512"
        viewBox="0 0 24 24"
        y="0"
        x="0"
        height="18"
        width="18"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="checkmarkkk"
      >
        <g>
          <path
            data-original="#000000"
            fill="currentColor"
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
          ></path>
        </g>
      </svg>
    </span>
  </button>
</div>
<div class="copyArea">
  password
  <button class="copyyy" id="passwordCopyBtn">
    <span
      data-text-end="Copied!"
      data-text-initial="Copy to clipboard"
      class="tooltippp"
    ></span>
    <span>
      <svg
        xml:space="preserve"
        style="enable-background: new 0 0 512 512"
        viewBox="0 0 6.35 6.35"
        y="0"
        x="0"
        height="20"
        width="20"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="clipboard"
      >
        <g>
          <path
            fill="currentColor"
            d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
          ></path>
        </g>
      </svg>
      <svg
        xml:space="preserve"
        style="enable-background: new 0 0 512 512"
        viewBox="0 0 24 24"
        y="0"
        x="0"
        height="18"
        width="18"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="checkmarkkk"
      >
        <g>
          <path
            data-original="#000000"
            fill="currentColor"
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
          ></path>
        </g>
      </svg>
    </span>
  </button>
</div>`,
  usernameCopyFunc: () => {
    console.log("usernameCopy");
  },
  passwordCopyFunc: () => {
    console.log("passwordCopy");
  },
  init: () => {
    document.getElementById("mainArea").innerHTML = successPage.body;
    successPage.usernameCopyBtn = document.getElementById("usernameCopyBtn");
    successPage.passwordCopyBtn = document.getElementById("passwordCopyBtn");
    successPage.usernameCopyBtn.addEventListener(
      "click",
      successPage.usernameCopyFunc
    );
    successPage.passwordCopyBtn.addEventListener(
      "click",
      successPage.passwordCopyFunc
    );
    state = "successPage";
  },
  destroy: () => {
    state = "";
    successPage.usernameCopyBtn.removeEventListener(
      "click",
      successPage.usernameCopyFunc
    );
    successPage.passwordCopyBtn.removeEventListener(
      "click",
      successPage.passwordCopyFunc
    );
  },
};

let constPage = {
  htmlPrefix: ` <div class="connectContainer" id="connectContainer">
    <button id="connectBtn">
      <span class="text1" id="connectBtnText">Click here to connect</span>
    </button>
  </div>
  <div class="closeBTNContainer">
    <button class="closeBTN" title="closeBTN" id="closeBtn"></button>
  </div>
  <div class="retryBTNContainer">
    <button class="retryBTN" title="retryBTN" id="retryBtn">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#000000"
          d="M14.9547098,7.98576084 L15.0711,7.99552 C15.6179,8.07328 15.9981,8.57957 15.9204,9.12636 C15.6826,10.7983 14.9218,12.3522 13.747,13.5654 C12.5721,14.7785 11.0435,15.5888 9.37999,15.8801 C7.7165,16.1714 6.00349,15.9288 4.48631,15.187 C3.77335,14.8385 3.12082,14.3881 2.5472,13.8537 L1.70711,14.6938 C1.07714,15.3238 3.55271368e-15,14.8776 3.55271368e-15,13.9867 L3.55271368e-15,9.99998 L3.98673,9.99998 C4.87763,9.99998 5.3238,11.0771 4.69383,11.7071 L3.9626,12.4383 C4.38006,12.8181 4.85153,13.1394 5.36475,13.3903 C6.50264,13.9466 7.78739,14.1285 9.03501,13.9101 C10.2826,13.6916 11.4291,13.0839 12.3102,12.174 C13.1914,11.2641 13.762,10.0988 13.9403,8.84476 C14.0181,8.29798 14.5244,7.91776 15.0711,7.99552 L14.9547098,7.98576084 Z M11.5137,0.812976 C12.2279,1.16215 12.8814,1.61349 13.4558,2.14905 L14.2929,1.31193 C14.9229,0.681961 16,1.12813 16,2.01904 L16,6.00001 L12.019,6.00001 C11.1281,6.00001 10.6819,4.92287 11.3119,4.29291 L12.0404,3.56441 C11.6222,3.18346 11.1497,2.86125 10.6353,2.60973 C9.49736,2.05342 8.21261,1.87146 6.96499,2.08994 C5.71737,2.30841 4.57089,2.91611 3.68976,3.82599 C2.80862,4.73586 2.23802,5.90125 2.05969,7.15524 C1.98193,7.70202 1.47564,8.08224 0.928858,8.00448 C0.382075,7.92672 0.00185585,7.42043 0.0796146,6.87364 C0.31739,5.20166 1.07818,3.64782 2.25303,2.43465 C3.42788,1.22148 4.95652,0.411217 6.62001,0.119916 C8.2835,-0.171384 9.99651,0.0712178 11.5137,0.812976 Z"
        />
      </svg>
    </button>
  </div>
  <div class="terminalContainer">
    <div class="text" id="webURLText"></div>
  </div>

  <div class="mainArea" id="mainArea">`,
  htmlSuffix: `</div>`,
  isShrink: false,
  connectBtnMouseEnterFunc: () => {
    constPage.connectBtnText.innerHTML = "Connect...";
  },
  connectBtnMouseLeaveFunc: () => {
    if (port) {
      constPage.connectBtnText.innerHTML = port.name;
    } else {
      constPage.connectBtnText.innerHTML = "Click here to Connect";
    }
  },
  connectBtnClickFunc: () => {
    if (port) {
      port.disconnect();

      port = null;
    } else {
      serial
        .requestPort()
        .then((selectedPort) => {
          port = selectedPort;
          connect();
          console.log("port: " + port.name);
          constPage.connectBtnText.innerHTML = port.name;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  usbDisconnectFunc: (event) => {
    if (port && port.device_ === event.device) {
      port = null;
      constPage.connectBtnText.innerHTML = "Click here to Connect";
    }
  },
  closeBtnClickFunc: () => {
    // container's opacity decreases 0.1 every 0.1s
    var opacity = 1;
    var interval = setInterval(function () {
      opacity -= 0.1;
      constPage.container.style.opacity = opacity;
      if (opacity <= 0) {
        clearInterval(interval);
        constPage.destroy();
      }
    }, 50);
  },
  URLChangeFunc: () => {
    // just get the domain of the URL and set it to the text
    var domain = window.location.href.split("/")[2];
    constPage.URLText.innerHTML = domain;
  },
  shrinkBtnClickFunc: () => {
    /* constPage.isShrink = !constPage.isShrink;
    if (constPage.isShrink) {
      
    } */
  },
  init: () => {
    // add prefix and suffix to the html
    //<div class="container" id="container">
    if (document.getElementById("keyStoreContainer") != null) return;
    constPage.container = document.createElement("div");
    constPage.container.className = "keyStoreContainer";
    constPage.container.id = "keyStoreContainer";
    //insert the container to the body at the first position
    document.body.insertBefore(constPage.container, document.body.firstChild);
    constPage.container.innerHTML = constPage.htmlPrefix + constPage.htmlSuffix;

    constPage.connectBtnText = document.getElementById("connectBtnText");
    constPage.connectBtn = document.getElementById("connectBtn");
    constPage.closeBtn = document.getElementById("closeBtn");
    constPage.shrinkBtn = document.getElementById("retryBtn");
    constPage.URLText = document.getElementById("webURLText");

    constPage.connectBtn.addEventListener(
      "mouseenter",
      constPage.connectBtnMouseEnterFunc
    );
    constPage.connectBtn.addEventListener(
      "mouseleave",
      constPage.connectBtnMouseLeaveFunc
    );
    constPage.shrinkBtn.addEventListener("click", constPage.shrinkBtnClickFunc);
    constPage.connectBtn.addEventListener(
      "click",
      constPage.connectBtnClickFunc
    );
    navigator.usb.addEventListener("disconnect", constPage.usbDisconnectFunc);
    constPage.closeBtn.addEventListener("click", constPage.closeBtnClickFunc);
    window.addEventListener("popstate", constPage.URLChangeFunc);
    constPage.URLChangeFunc();
    state = "";
    serial.getPorts().then((ports) => {
      if (ports.length == 0) {
        console.log("No devices found.");
      } else {
        console.log("Found devices:");
        port = ports[0];
        connect();
        constPage.connectBtnText.innerHTML = port.name;
      }
    });
    verifyPage.init();
  },
  destroy: () => {
    constPage.connectBtn.removeEventListener(
      "mouseenter",
      constPage.connectBtnMouseEnterFunc
    );
    constPage.connectBtn.removeEventListener(
      "mouseleave",
      constPage.connectBtnMouseLeaveFunc
    );
    constPage.connectBtn.removeEventListener(
      "click",
      constPage.connectBtnClickFunc
    );
    navigator.usb.removeEventListener(
      "disconnect",
      constPage.usbDisconnectFunc
    );
    constPage.closeBtn.removeEventListener(
      "click",
      constPage.closeBtnClickFunc
    );
    constPage.shrinkBtn.removeEventListener(
      "click",
      constPage.shrinkBtnClickFunc
    );
    window.removeEventListener("popstate", constPage.URLChangeFunc);
    // remove the container form the DOM
    constPage.container.remove();
  },
};
/* pages */

/* global variables */
let userData = {
  url: "www.google.com",
  username: "",
  password: "",
  type: "verify",
  id: "1234567890",
};
let receivedData = "";
let html = "";
let state = "";
var serial = {};
var port;
/* global variables */

/* connect area */
serial.getPorts = function () {
  return navigator.usb.getDevices().then((devices) => {
    return devices.map((device) => new serial.Port(device));
  });
};
serial.requestPort = function () {
  const filters = [
    { vendorId: 0x2341, productId: 0x8036 }, // Arduino Leonardo
    { vendorId: 0x2341, productId: 0x8037 }, // Arduino Micro
    { vendorId: 0x2341, productId: 0x804d }, // Arduino/Genuino Zero
    { vendorId: 0x2341, productId: 0x804e }, // Arduino/Genuino MKR1000
    { vendorId: 0x2341, productId: 0x804f }, // Arduino MKRZERO
    { vendorId: 0x2341, productId: 0x8050 }, // Arduino MKR FOX 1200
    { vendorId: 0x2341, productId: 0x8052 }, // Arduino MKR GSM 1400
    { vendorId: 0x2341, productId: 0x8053 }, // Arduino MKR WAN 1300
    { vendorId: 0x2341, productId: 0x8054 }, // Arduino MKR WiFi 1010
    { vendorId: 0x2341, productId: 0x8055 }, // Arduino MKR NB 1500
    { vendorId: 0x2341, productId: 0x8056 }, // Arduino MKR Vidor 4000
    { vendorId: 0x2341, productId: 0x8057 }, // Arduino NANO 33 IoT
    { vendorId: 0x239a }, // Adafruit Boards!
  ];
  return navigator.usb
    .requestDevice({ filters: filters })
    .then((device) => new serial.Port(device));
};
serial.Port = function (device) {
  this.name = device.productName;
  this.device_ = device;
  this.interfaceNumber_ = 2; // original interface number of WebUSB Arduino demo
  this.endpointIn_ = 5; // original in endpoint ID of WebUSB Arduino demo
  this.endpointOut_ = 4; // original out endpoint ID of WebUSB Arduino demo
};
serial.Port.prototype.connect = function () {
  let readLoop = () => {
    this.device_.transferIn(this.endpointIn_, 64).then(
      (result) => {
        this.onReceive(result.data);
        readLoop();
      },
      (error) => {
        this.onReceiveError(error);
      }
    );
  };

  return (
    this.device_
      .open()
      .then(() => {
        if (this.device_.configuration === null) {
          return this.device_.selectConfiguration(1);
        }
      })
      .then(() => {
        var configurationInterfaces = this.device_.configuration.interfaces;
        configurationInterfaces.forEach((element) => {
          element.alternates.forEach((elementalt) => {
            if (elementalt.interfaceClass == 0xff) {
              this.interfaceNumber_ = element.interfaceNumber;
              elementalt.endpoints.forEach((elementendpoint) => {
                if (elementendpoint.direction == "out") {
                  this.endpointOut_ = elementendpoint.endpointNumber;
                }
                if (elementendpoint.direction == "in") {
                  this.endpointIn_ = elementendpoint.endpointNumber;
                }
              });
            }
          });
        });
      })
      .then(() => this.device_.claimInterface(this.interfaceNumber_))
      .then(() =>
        this.device_.selectAlternateInterface(this.interfaceNumber_, 0)
      )
      // The vendor-specific interface provided by a device using this
      // Arduino library is a copy of the normal Arduino USB CDC-ACM
      // interface implementation and so reuses some requests defined by
      // that specification. This request sets the DTR (data terminal
      // ready) signal high to indicate to the device that the host is
      // ready to send and receive data.
      .then(() =>
        this.device_.controlTransferOut({
          requestType: "class",
          recipient: "interface",
          request: 0x22,
          value: 0x01,
          index: this.interfaceNumber_,
        })
      )
      .then(() => {
        readLoop();
      })
  );
};
serial.Port.prototype.disconnect = function () {
  // This request sets the DTR (data terminal ready) signal low to
  // indicate to the device that the host has disconnected.
  return this.device_
    .controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x00,
      index: this.interfaceNumber_,
    })
    .then(() => this.device_.close());
};

serial.Port.prototype.send = function (data) {
  receivedData = "";
  return this.device_.transferOut(this.endpointOut_, data);
};

function connect() {
  port.connect().then(
    () => {
      constPage.connectBtnText.innerHTML = port.name;

      port.onReceive = (data) => {
        let textDecoder = new TextDecoder();
        receivedData += textDecoder.decode(data);
        console.log(receivedData);
      };
      port.onReceiveError = (error) => {
        console.error(error);
      };
    },
    (error) => {
      console.error(error);
    }
  );
}
/* connect area */
function checkPasswordInput() {
  const inputs = document.querySelectorAll("input");
  //check each of them if its type is passsword
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "password") {
      return true;
    }
  }
  return false;
}

window.onload = function () {
  // collect all inputs

  if (checkPasswordInput()) {
    constPage.init();
  }
  // if url changes, update the text
  window.addEventListener("popstate", function (e) {
    if (checkPasswordInput()) {
      constPage.init();
    }
  });

  // receive message from popup.js
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === "show") {
      if (state === "verifyPage") {
        verifyPage.destroy();
      } else if (state === "signUpPage") {
        signUpPage.destroy();
      } else if (state === "loadingPage") {
        loadingPage.destroy();
      } else if (state === "successPage") {
        successPage.destroy();
      }
      constPage.destroy();
      constPage.init();
    }
  });
};
