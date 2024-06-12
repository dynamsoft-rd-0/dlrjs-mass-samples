import { pDataLoad, cvrReady } from "./init.js";

async function startCapturing() {
  try {
    await (promiseCVRReady = promiseCVRReady || (async () => {
      homePage.style.display = "none";
      scannerContainer.style.display = "block";

      // After the model and wasm are loaded, turn on the camera
      await cvrReady;
      await pDataLoad.promise;

      // Starts streaming the video
      await cameraEnhancer.open();
      const currentCamera = cameraEnhancer.getSelectedCamera();
      for (let child of cameraListDiv.childNodes) {
        if (currentCamera.deviceId === child.deviceId) {
          child.className = "camera-item camera-selected";
        }
      }
      passportFrame.style.display = "inline-block";
      cameraEnhancer.setScanRegion(region());
      view.setScanRegionMaskVisible(false);
      await cvRouter.startCapturing("ReadPassport");
    })());
  } catch (ex) {
    let errMsg = ex.message || ex;
    console.error(errMsg);
    alert(errMsg);
  }
}

// -----------Logic code for calculating scan region ↓------------
const regionEdgeLength = () => {
  if (!cameraEnhancer || !cameraEnhancer.isOpen()) return 0;
  const visibleRegionInPixels = view.getVisibleRegionOfVideo({ inPixels: true });
  const visibleRegionWidth = visibleRegionInPixels.width;
  const visibleRegionHeight = visibleRegionInPixels.height;
  const regionEdgeLength = 0.4 * Math.min(visibleRegionWidth, visibleRegionHeight);
  console.log(Math.round(regionEdgeLength));
  return Math.round(regionEdgeLength);
};

const regionLeft = () => {
  if (!cameraEnhancer || !cameraEnhancer.isOpen()) return 0;
  const visibleRegionInPixels = view.getVisibleRegionOfVideo({ inPixels: true });
  const currentResolution = cameraEnhancer.getResolution();
  const vw = currentResolution.width;
  const visibleRegionWidth = visibleRegionInPixels.width;
  let left = 0.5 - regionEdgeLength() / vw / 2;
  let regionCssW;
  if (document.body.clientWidth > document.body.clientHeight * 6.73) {
    let regionCssH = document.body.clientHeight * 0.75;
    regionCssW = regionCssH * 6.73;
  } else {
    regionCssW = document.body.clientWidth * 0.8;
  }
  regionCssW = Math.min(regionCssW, 800);
  const regionWidthInPixel = (visibleRegionWidth / document.body.clientWidth) * regionCssW;
  left = ((vw - regionWidthInPixel) / 2 / vw) * 100;
  left = Math.round(left);
  return left;
};

const regionTop = () => {
  if (!cameraEnhancer || !cameraEnhancer.isOpen()) return 0;
  const currentResolution = cameraEnhancer.getResolution();
  const vh = currentResolution.height;
  let top = 0.5 - regionEdgeLength() / vh / 2;
  const vw = currentResolution.width;
  const regionWidthInPixel = vw - (regionLeft() * 2 * vw) / 100;
  const regionHeightInPixel = regionWidthInPixel / 6.73; // 6.73 is the aspect ratio of 'passportf frame.svg'
  top = ((vh - regionHeightInPixel) / 2 / vh) * 100;
  top = Math.round(top);
  return top;
};

const region = () => {
  let region = {
    left: regionLeft(),
    right: 100 - regionLeft(),
    top: regionTop(),
    bottom: 100 - regionTop(),
    isMeasuredInPercentage: true,
  };
  return region;
}
// -----------Logic code for calculating scan region ↑------------


window.addEventListener("click", () => {
  cameraListDiv.style.display = "none";
  up.style.display = "none";
  down.style.display = "inline-block";
})

// Recalculate the scan region when the window size changes
window.addEventListener("resize", () => {
  cameraEnhancer.setScanRegion(region());
  view.setScanRegionMaskVisible(false);
})

// Add click events to some buttons
startScaningBtn.addEventListener("click", startCapturing);

restartVideoBtn.addEventListener("click", async () => {
  resultContainer.style.display = "none";
  await cvRouter.startCapturing("ReadPassport");
})

cameraSelector.addEventListener("click", (e) => {
  e.stopPropagation();
  const isShow = cameraListDiv.style.display === "block";
  cameraListDiv.style.display = isShow ? "none" : "block";
  up.style.display = !isShow ? "inline-block" : "none";
  down.style.display = isShow ? "inline-block" : "none";
})

playSoundBtn.addEventListener("click", () => {
  playSoundBtn.style.display = "none";
  closeSoundBtn.style.display = "block";
  isPlaySound = false;
})

closeSoundBtn.addEventListener("click", () => {
  playSoundBtn.style.display = "block";
  closeSoundBtn.style.display = "none";
  isPlaySound = true;
})