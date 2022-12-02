import {useNavigate} from "react-router-dom";
import {UserForm} from "../../users/form/UserForm";


export function Register() {
    const navigate = useNavigate()

    const onSecondaryButtonClicked = () => {
        navigate("/login")
    }

    return <UserForm headerText="Register" primaryButtonText="Sign up" secondaryButtonText="Already signed up?"
                     onSecondaryButtonClicked={onSecondaryButtonClicked}/>
}