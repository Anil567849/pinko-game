import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Simulation} from './pages/Simulation';
import Game from './pages/Game';

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="simulation" element={<Simulation />} />
        <Route path="game" element={<Game />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App