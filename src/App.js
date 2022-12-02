import react, {useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {Layout} from "./components/structure/layout/Layout";
import {LoggedInGuard} from "./utils/guards/LoggedInGuard";
import {LoggedOutGuard} from "./utils/guards/LoggedOutGuard";
import {Register} from "./components/auth/register/Register";
import {Login} from "./components/auth/login/Login";
import {VehicleList} from "./components/vehicles/list/VehicleList";
import {getLoggedUser} from "./utils/storage/user-storage";
import {UserEdit} from "./components/users/edit/UserEdit";
import {UserList} from "./components/users/list/UserList";
import {VehicleCreate} from "./components/vehicles/create/VehicleCreate";
import {VehicleEdit} from "./components/vehicles/edit/VehicleEdit";
import {LoggedInAdminGuard} from "./utils/guards/LoggedInAdminGuard";
import {LoggedInCorrectUserOrAdminGuard} from "./utils/guards/LoggedInCorrectUserOrAdminGuard";
import {RentalList} from "./components/rental/list/RentalList";

export const loggedUserContext = react.createContext(null);
export const vehicleSearchTermContext = react.createContext(null);
export const rentalSearchTermContext = react.createContext(null);

export function App() {
    const [loggedUser, setLoggedUser] = useState(getLoggedUser());
    const [vehicleSearchTerm, setVehicleSearchTerm] = useState("");
    const [rentalSearchTerm, setRentalSearchTerm] = useState("")

    return <loggedUserContext.Provider value={[loggedUser, setLoggedUser]}>
        <vehicleSearchTermContext.Provider value={[vehicleSearchTerm, setVehicleSearchTerm]}>
            <rentalSearchTermContext.Provider value={[rentalSearchTerm, setRentalSearchTerm]}>
                <Routes>
                    <Route exact path="/" element={<Layout/>}>
                        {/*Default route*/}
                        <Route exact path="/"
                               element={<LoggedInGuard> <Navigate to="/vehicle/list"/> </LoggedInGuard>}/>

                        {/* Auth routes*/}
                        <Route exact path="/register" element={<LoggedOutGuard> <Register/> </LoggedOutGuard>}/>
                        <Route exact path="/login" element={<LoggedOutGuard> <Login/> </LoggedOutGuard>}/>

                        {/*Customer routes*/}
                        <Route exact path="/vehicle/list" element={<LoggedInGuard> <VehicleList/></LoggedInGuard>}/>

                        {/*Correct customer and admin routes*/}
                        <Route exact path="/user/edit/:id"
                               element={
                                   <LoggedInCorrectUserOrAdminGuard><UserEdit/></LoggedInCorrectUserOrAdminGuard>}/>
                        <Route exact path="/user/rentals/:id"
                               element={
                                   <LoggedInCorrectUserOrAdminGuard><RentalList/></LoggedInCorrectUserOrAdminGuard>}/>

                        {/*Admin routes*/}
                        <Route exact path="/user/list" element={<LoggedInAdminGuard><UserList/></LoggedInAdminGuard>}/>
                        <Route exact path="/vehicle/create"
                               element={<LoggedInAdminGuard><VehicleCreate/></LoggedInAdminGuard>}/>
                        <Route exact path="/vehicle/edit/:id"
                               element={<LoggedInAdminGuard><VehicleEdit/></LoggedInAdminGuard>}/>

                    </Route>
                </Routes>
            </rentalSearchTermContext.Provider>
        </vehicleSearchTermContext.Provider>
    </loggedUserContext.Provider>;
}
