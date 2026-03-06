import { Routes, Route } from 'react-router-dom';

import './App.css'
import { CreateProject } from './pages/CreateProject.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<CreateProject />}></Route>
    </Routes>
  );
}

export default App;
