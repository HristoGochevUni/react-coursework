import {Navigate} from "react-router-dom";
import {useContext} from "react";
import {loggedUserContext} from "../../App";

export function LoggedInGuard({children}) {
    const [loggedUser] = useContext(loggedUserContext);

    if (!loggedUser) {
        return <Navigate to="/login"/>;
    }

    return children
}