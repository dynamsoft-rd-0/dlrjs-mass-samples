// Define some global variables that need to be used
let view;
let cvRouter = null;
let cameraEnhancer = null;
let cameraList = [];
let promiseCVRReady = null;
let isPlaySound = true;

// Get the ui element
const homePage = document.querySelector(".home-page");
const scannerContainer = document.querySelector(".scanner-container");
const startScaningBtn = document.querySelector(".start-btn");
const passportFrame = document.querySelector(".passport-frame");
const originalImageArea = document.querySelector(".original-image-area");
const restartVideoBtn = document.querySelector(".btn-restart-video");
const resultContainer = document.querySelector(".result-container");
const cameraViewContainer = document.querySelector(".div-ui-container");
const parsedResultArea = document.querySelector(".parsed-result-area");
const cameraListDiv = document.querySelector(".camera-list")
const cameraSelector = document.querySelector(".camera-selector");
const playSoundBtn = document.querySelector(".music");
const closeSoundBtn = document.querySelector(".no-music");
const down = document.querySelector(".down");
const up = document.querySelector(".up");