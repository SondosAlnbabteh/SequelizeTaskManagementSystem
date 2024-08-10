import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Home from "./pages";
import Header from "./pages/Header";
import Login from "./pages/Login";
import AddTasks from "./pages/AddTask";
import Tasks from "./pages/Tasks";

function App() {

  return (
    <>
       <BrowserRouter>
       <Header/>
       <Routes>
       
       <Route path="/" element={<Home />}/>
       <Route path="/Register" element={<Register />} />
       <Route path="/Login" element={<Login />} />
       <Route path="/AddTasks" element={<AddTasks />} />
       <Route path="/Tasks" element={<Tasks />} />




      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
