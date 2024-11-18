import CompLabelRecognizer from './CompLabelRecognizer';
// import { useState, useEffect } from 'react';


function App() {

  // // test remove component
  // const [isShow, setShow] = useState(true);
  // useEffect(()=>{
  //   setTimeout(()=>{setShow(false)},10000);
  // },[])
  // return (
  //   <div>
  //     {isShow&&<CompLabelRecognizer></CompLabelRecognizer>}
  //   </div>
  // );

  return (
    <div>
      <CompLabelRecognizer></CompLabelRecognizer>
    </div>
  );
}

export default App;
