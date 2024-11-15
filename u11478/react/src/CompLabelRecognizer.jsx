import { useEffect, useRef } from "react";
import { LicenseManager, CoreModule, CaptureVisionRouter, CameraView, CameraEnhancer, Feedback, EnumImagePixelFormat
} from 'dynamsoft-capture-vision-bundle';

const componentDestroyedErrorMsg = "LabelRecognizer Component Destroyed";

// Expired:	12/7/2024
LicenseManager.initLicense("t0068MgAAAI//CICvupAwTBwv1spfqZQUQPmRSddpuYnJBQxKM+LkvVkU+s//+3hX/IXx3gxRGRYrQqv+08I1l2D7WVyZhNE=");
CoreModule.engineResourcePaths.rootDirectory = 'https://cdn.jsdelivr.net/npm/';

// reference: https://github.com/Dynamsoft/barcode-reader-javascript-samples/blob/v10.4.20/hello-world/react-hooks/src/components/VideoCapture/VideoCapture.tsx
function CompLabelRecognizer(){
  const cameraViewContainer = useRef(null);
  const resultsContainer = useRef(null);
  
  useEffect(()=>{
    
    let resolveInit;
    const pInit = new Promise((r) => { resolveInit = r; });
    let isDestroyed = false;

    let cvRouter;
    let cameraEnhancer;

    (async () => {
      try {
        // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
        const cameraView = await CameraView.createInstance('@engineResourcePath/dce.mobile-native.ui.html');
        // Check if component is destroyed after every async
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }
        cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }

        // Get UI and append it to DOM.
        let uiElement = cameraView.getUIElement();
        uiElement.shadowRoot.querySelector('.dce-mn-resolution-box').remove();
        uiElement.shadowRoot.querySelector('.dce-mn-camera-switch').remove();
        cameraViewContainer.current.append(uiElement);

        // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
        cvRouter = await CaptureVisionRouter.createInstanceForU11478();
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }
        cvRouter.setInput(cameraEnhancer);

        // Define a callback for results.
        cvRouter.addResultReceiver({ onRecognizedTextLinesReceived: (result) => {
          //console.log(result);//debug
          if (result.textLineResultItems.length > 0) {
            Feedback.beep();
            resultsContainer.current.textContent = "";
            for (let item of result.textLineResultItems) {
              resultsContainer.current.textContent += `${item.text}\n`;
            }
          }
        }});

        // Open camera and start scanning single barcode.
        await cameraEnhancer.setResolution({width:480,height:360});
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }
        await cameraEnhancer.open();
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }

        const dims=[1,3,32,256];
        let rsl = cameraEnhancer.getResolution();
        await cameraEnhancer.setScanRegion({x:rsl.width/2-dims[3]/2+25,y:rsl.height/2-dims[2]/2,width:dims[3]-50,height:dims[2],isMeasuredInPercentage:false});
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }

        cvRouter.startCapturing("u11478");
        cameraEnhancer.setPixelFormat(EnumImagePixelFormat.IPF_ABGR_8888);
      } catch (ex) {
        if (ex?.message === componentDestroyedErrorMsg) {
          console.log(componentDestroyedErrorMsg);
        } else {
          let errMsg = ex?.message || ex;
          console.error(errMsg);
          alert(errMsg);
        }
      }
    })();

    // Resolve pInit promise once initialization is complete.
    resolveInit();

    // componentWillUnmount. dispose cvRouter when it's no longer needed
    return async () => {
      isDestroyed = true;
      try {
        // Wait for the pInit to complete before disposing resources.
        await pInit;
        cvRouter?.dispose();
        cameraEnhancer?.dispose();
      } catch (_) {}
    };
  },[]);  

  return (
    <div>
      <div ref={cameraViewContainer} style={{  width: "100%", height: "70vh" }}></div>
      <br />
      Results:
      <div ref={resultsContainer} className="results"></div>
    </div>
  );
}

export default CompLabelRecognizer;
