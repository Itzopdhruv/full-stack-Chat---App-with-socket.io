import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from './App.jsx'
import {Provider} from "react-redux"
import store from "./app/store.js"
import { AuthProvider } from './Context/AuthProvider.jsx';
import { SocketProvider } from './Context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketProvider>
    <Provider store = {store}>
        <App/>
    </Provider>
    </SocketProvider>
   
  </AuthProvider>
   
   
 
)
