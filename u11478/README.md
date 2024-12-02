# U11478

## Introduction

This is a customized version developed based on [Dynamsoft Capture Vision JavaScript Edition](https://www.dynamsoft.com/capture-vision/docs/web/programming/javascript/index.html?ver=latest&cVer=true) v2.4.2200, primarily enhancing the neural network for text recognition and some supporting APIs.

## Install

### CDN for purejs:
```html
<script src="https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-bundle@2.4.2200-beta-202411180113/dist/dcv.bundle.js"></script>
```

### For framework:
Add these lines in `package.json`.

```json
"dependencies": {
  ...
  "dynamsoft-core": "3.4.21-beta-202411172033",
  "dynamsoft-capture-vision-bundle": "2.4.2200-beta-202411180113"
},
"overrides": {
  "dynamsoft-core": "$dynamsoft-core"
},
```

Install it.
```
npm i
```
### Code compatibility

If you get `no license module` error, remove `node_modules` and `package-lock.json` and reinstall.

If you want to use it with other versions of Dynamsoft products (namespace/package conflicts), please contact us.

## Process

Below we mainly introduce the usage in react. Please open `react/src/CompLabelRecognizer.jsx` when reading.

### initLicense

`initLicense` usually requires a connection to **Dynamsoft License Server** \(https://\*.dynamsoft.com, https://\*.dynamsoftonline.com\).

It is a lazy function. If there is any error\(expiration, network problem\), it will be thrown at `await CaptureVisionRouter.createInstance()`, which will be mentioned later.

### engineResourcePaths

Some resources will be loaded in the web worker and will not be packaged by webpack. Here it is specified to find these resources from jsdeliver CDN.
```
CoreModule.engineResourcePaths.rootDirectory = 'https://cdn.jsdelivr.net/npm/';
```

<br><br><br>

We need three instances.

### Camera View
```js
// Video UI
cameraView = await CameraView.createInstance('@engineResourcePath/dce.mobile-native.ui.html');
let uiElement = cameraView.getUIElement();
// Remove anything you don't need
uiElement.shadowRoot.querySelector('.dce-mn-resolution-box').remove();
uiElement.shadowRoot.querySelector('.dce-mn-camera-switch').remove();
// customize the scanRegionMaskStyle
// default: { fillStyle: "rgba(0,0,0,0.5)", strokeStyle: "rgb(254,142,20)", lineWidth: 6 }
let scanRegionMaskStyle = cameraView.getScanRegionMaskStyle();
scanRegionMaskStyle.lineWidth = 1;
cameraView.setScanRegionMaskStyle(scanRegionMaskStyle); 
// Append the ui element to a good place
cameraViewContainer.current.append(uiElement);
```

### Camera Enhancer
```js
// Control the camera
cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
// Since the neural network model only recognizes areas of size 256*32, we don't need a high resolution.
await cameraEnhancer.setResolution({width:480,height:360});
// Open
await cameraEnhancer.open();
// Set region after open.
// Get new resolution, in case the actual resolution is different from what you expected.
// `dims` matches the input required by the model.
// Just use it.
const dims=[1,3,32,256];
let rsl = cameraEnhancer.getResolution();
await cameraEnhancer.setScanRegion({x:rsl.width/2-dims[3]/2+25,y:rsl.height/2-dims[2]/2,width:dims[3]-50,height:dims[2],isMeasuredInPercentage:false});
// Close
// You can close it after getting the result.
// Of course I have taken care of that, you just need to remove the component and it will close automatically.
// `{isShowCamera && <CompLabelRecognizer></CompLabelRecognizer>}`
await cameraEnhancer.close();
```

### Capture Vision Router
```js
// Control recognition algorithm
cvRouter = await CaptureVisionRouter.createInstance();
// Set camera as input
cvRouter.setInput(cameraEnhancer);
// Result callback
cvRouter.addResultReceiver({ onRecognizedTextLinesReceived: (result) => {
  if (result.textLineResultItems.length > 0) {
    Feedback.beep(); // Prompt sound
    // Tell parent component I got the results.
    // So parent component can remove `CompLabelRecognizer` now.
    setTextState(result.textLineResultItems[0].text);
    // Or use a `OK` button to confirm final result and remove `CompLabelRecognizer`.
  }
}});
// Start recognition algorithm with custom logic.
cvRouter.startCapturing("u11478");
// You don't need to call it, I took care of it.
cvRouter.stopCapturing();
```


