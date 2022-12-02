import {useContext} from "react";
import {loggedUserContext} from "../../App";
import {Navigate} from "react-router-dom";

export function LoggedInAdminGuard({children}) {
    const [loggedUser] = useContext(loggedUserContext);

    if (!loggedUser) return <Navigate to="/login"/>

    if (!loggedUser.isAdmin) {
        return <Navigate to="/"/>;
    }

    return children
}