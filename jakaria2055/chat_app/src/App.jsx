import {Routes, Route, Navigate} from "react-router-dom";
import HomePages from './pages/HomePages';
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {Toaster} from "react-hot-toast"
import { useContext } from "react";
import { AuthContext } from "../store/AuthStore";

const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('/bgImage1.jpg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePages /> : <Navigate to={"/login"} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
      </Routes>
    </div>
  )
}

export default App
