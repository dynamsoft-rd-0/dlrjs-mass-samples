import { useEffect, useRef } from "react";
import { LicenseManager, CoreModule, CaptureVisionRouter, CameraView, CameraEnhancer, Feedback, MultiFrameResultCrossFilter, type TextLineResultItem
} from 'dynamsoft-capture-vision-bundle';

const componentDestroyedErrorMsg = "LabelRecognizer Component Destroyed";

//Expired:	1/14/2026
LicenseManager.initLicense("t0068MgAAAJp1+nCz7SC90dKBCfllG8YGHjKqcUj+88bNr+FcbzDcUDEil3dxZmPLe5l03oR88WKid2LiswuxuAyuWAL4gdQ=");
CoreModule.engineResourcePaths.rootDirectory = 'https://cdn.jsdelivr.net/npm/';

function qualifyURL(relativeUrl: string) {
  const a = document.createElement('a');
  a.href = relativeUrl; // Browser resolves the path relative to the current page
  return a.href;       // Returns the absolute URL
}

// reference: https://github.com/Dynamsoft/barcode-reader-javascript-samples/blob/v10.4.20/hello-world/react-hooks/src/components/VideoCapture/VideoCapture.tsx
function CompLabelRecognizer(){
  const cameraViewContainer = useRef<HTMLDivElement>(null);
  const resultsContainer = useRef<HTMLDivElement>(null);
  
  useEffect(()=>{
    
    let resolveInit:Function;
    const pInit = new Promise((r) => { resolveInit = r; });
    let isDestroyed = false;

    let cvRouter:CaptureVisionRouter;
    let cameraEnhancer:CameraEnhancer;

    (async () => {
      try {
        await CaptureVisionRouter.appendDLModelBuffer('pmi-len8', qualifyURL('./'));
        await CaptureVisionRouter.appendDLModelBuffer('pmi-len10', qualifyURL('./'));

        // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
        const cameraView = await CameraView.createInstance('@engineResourcePath/dce.mobile-native.ui.xml');
        // Check if component is destroyed after every async
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }
        cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }

        // Get UI and append it to DOM.
        let uiElement = cameraView.getUIElement();
        uiElement.shadowRoot!.querySelector('.dce-mn-resolution-box')!.remove();
        uiElement.shadowRoot!.querySelector('.dce-mn-camera-switch')!.remove();
        cameraViewContainer.current!.append(uiElement);

        // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
        cvRouter = await CaptureVisionRouter.createInstance();
        await cvRouter.initSettings('./read-pmi-text.json');
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }
        cvRouter.setInput(cameraEnhancer);

        // Filter out unchecked text_line results.
        const filter = new MultiFrameResultCrossFilter();
        filter.enableResultCrossVerification("text_line", true);
        await cvRouter.addResultFilter(filter);

        // let count = 0;//debug
        let lastResultTime = 0;
        let lastResult: TextLineResultItem;
        // Define a callback for results.
        cvRouter.addResultReceiver({ onRecognizedTextLinesReceived: async(result) => {
          
          // if(++count < 10){
          //   console.log(result);//debug
          // }

          if (result.textLineResultItems.length > 0) {
            
            // len-10 text prior to len-8 text
            let bestResult;
            for (let item of result.textLineResultItems) {
              if(!bestResult || item.text.length > bestResult.text.length){
                (item as any).minConfidence = item.characterResults.reduce((minConfidence, r)=>{
                  if(r.characterHConfidence < minConfidence){
                    minConfidence = r.characterHConfidence;
                  }
                  return minConfidence;
                }, 100);
                // minConfidence < 70 will be ignored
                if((item as any).minConfidence < 70){ continue; }
                bestResult = item;
              }
            }

            if(!bestResult){return;}

            let dateNow = Date.now();
            // if recently detected len-10 text, ignore len-8 text
            if(lastResult?.text.length > bestResult.text.length && dateNow - lastResultTime < 2000){
              return;
            }

            resultsContainer.current!.textContent = [
              `${bestResult.text} minConfidence: ${(bestResult as any).minConfidence}`,
              `${bestResult.characterResults.map(r=>r.characterH + '-' + r.characterHConfidence).join(',')}`
            ].join('\n');
            lastResult = bestResult;
            lastResultTime = dateNow;
            Feedback.beep();
          }
          // await cvRouter.stopCapturing();
          // await cameraEnhancer.close();
        }});

        // Open camera and start scanning single barcode.
        await cameraEnhancer.setResolution({width:480,height:360});
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }
        await cameraEnhancer.open();
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }

        const dims=[1,3,64,256];
        let rsl = cameraEnhancer.getResolution();
        await cameraEnhancer.setScanRegion({x:rsl.width/2-dims[3]/2,y:rsl.height/2-dims[2]/2,width:dims[3],height:dims[2],isMeasuredInPercentage:false});
        if (isDestroyed) { throw Error(componentDestroyedErrorMsg); }

        cvRouter.startCapturing("read-pmi-text");
      } catch (ex:any) {
        if (ex?.message === componentDestroyedErrorMsg) {
          console.log(componentDestroyedErrorMsg);
        } else {
          let errMsg = ex?.message || ex;
          console.error(errMsg);
          alert(errMsg);
        }
      }

      // Resolve pInit promise once initialization is complete.
      resolveInit!();
    })();


    // componentWillUnmount. dispose cvRouter when it's no longer needed
    return ()=>{(async () => {
      isDestroyed = true;
      try {
        // Wait for the pInit to complete before disposing resources.
        await pInit;
        cvRouter?.dispose();
        cameraEnhancer?.dispose();
      } catch (_) {

        console.log("I got the exception",_)
      }
    })()};
  },[]);  

  return (
    <div>
      <div ref={cameraViewContainer} style={{  width: "100%", height: "70vh" }}></div>
      <br />
      Results:
      <pre ref={resultsContainer} className="results"></pre>
    </div>
  );
}

export default CompLabelRecognizer;
