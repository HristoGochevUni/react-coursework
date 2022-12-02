import {useContext} from "react";
import {loggedUserContext} from "../../App";
import {Navigate, useParams} from "react-router-dom";

export function LoggedInCorrectUserOrAdminGuard({children}) {
    const [loggedUser] = useContext(loggedUserContext);

    const params = useParams();

    if (!loggedUser) return <Navigate to="/login"/>;

    if (parseInt(loggedUser.id) !== parseInt(params.id) && !loggedUser.isAdmin) {
        return <Navigate to="/"/>
    }

    return children
}