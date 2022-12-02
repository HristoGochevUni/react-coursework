import {useNavigate} from "react-router-dom";
import {UserForm} from "../form/UserForm";

export function UserEdit() {

    const navigate = useNavigate()

    const onSecondaryButtonClicked = () => {
        navigate("/user/list")
    }

    return <UserForm headerText="Edit profile" primaryButtonText="Apply" secondaryButtonText="Discard changes"
                     onSecondaryButtonClicked={onSecondaryButtonClicked}/>
}