import { useState } from 'react';
import './App.css'
import { PingComponent } from './components/atoms/pingComponent.jsx';

// import { pingApi } from './apis/ping.js';
// import usePing from './hooks/apis/queries/usePing.jd';

function App() {

  // useEffect(()=> {
  //   pingApi();
  // }, []);

  // const { isLoading, data } = usePing();

  // if(isLoading) {
  //   return( 
  //     <>
  //     Loading.......</>

  //   )
  // }

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)}> Toggle </button>
      {isVisible && <PingComponent />}

    </>
  );
}

export default App;
