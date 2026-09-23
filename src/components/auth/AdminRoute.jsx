import {Navigate,Outlet} from "react-router-dom";import {useContext} from "react";import {AppContext} from "../../context/AppContext";
export default function AdminRoute(){const{user}=useContext(AppContext);return user?.role==="admin"?<Outlet/>:<Navigate to="/dashboard" replace/>}
