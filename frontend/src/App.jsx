import { useEffect, useState } from 'react'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider , Navigate} from 'react-router-dom'
import Signup from './Components/Signup'
import axios from "axios"
import { useAuth } from './Context/AuthProvider'
import Logout from './Home/left1/Logout'
import Left from './Home/Leftpart/Left'
import Right from './Home/Rightpart/Right'
import Login from './Components/Login'
import { Toaster } from "react-hot-toast";

function App() {
  const [authUser , setAuthUser] = useAuth();
  console.log(authUser);
 const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/' >
      <Route path = "" element={authUser?(
         <div className='flex h-screen'>
            <Logout/>
            <Left/>
            <Right/>
         </div>
      ) : (
        <Navigate to = "/login"/>
      )}/>
      <Route path = "/login" element = {authUser? <Navigate to = "/"/> : <Login/>}/>
      <Route path = "/signup" element = {authUser? <Navigate to = "/"/> : <Signup/>}/>
    </Route>
  )
 )
// const data =  await axios.get("/api/chats")
// console.log(data.data);
// console.log("hi")

 

  return (
    <>
     <RouterProvider router = {router}/>
     <Toaster/>
    </>
  );
}

export default App
