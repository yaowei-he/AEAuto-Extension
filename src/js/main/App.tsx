import { Routes, Route,HashRouter } from "react-router-dom";
import Main from "./main";
import Wel from "./pages/Wel";
import Log from "./pages/Log";
import Chat from "./pages/Chat";
import Auto from "./pages/Auto";
import PrivateRoutes from "./utils/ProvateRoute";
import Expressions from "./pages/Expressions";

const App = () => {
        
  return (
    <HashRouter>
    <Routes>
      <Route path="/" element={<Wel />} />
      <Route path="/log" element={<Log />}/>
        <Route path="/main" element={<Main />} />

      <Route element={<PrivateRoutes />}>

        <Route path="/chat" element={<Chat />}/>
        <Route path="/auto" element={<Auto />}/>
        <Route path="/expressions" element={<Expressions />}/>
          </Route>
    </Routes>
  </HashRouter>
  )
}

export default App;


