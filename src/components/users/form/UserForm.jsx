import {useNavigate, useParams} from "react-router-dom";
import {readUser, createOrUpdateUser, findUser} from "../../../utils/http-utils/users-requests";
import {useContext, useEffect, useState} from "react";
import {Input} from "../../util/input/Input";
import {loggedUserContext} from "../../../App";
import {CheckBoxInput} from "../../util/input/CheckBoxInput";
import {loginUser} from "../../../utils/storage/user-storage";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function UserForm({
                             headerText,
                             primaryButtonText,
                             secondaryButtonText,
                             onSecondaryButtonClicked,
                         }) {

    const emptyUser = {
        id: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        isAdmin: false,
        isVIP: false
    };

    const [user, setUser] = useState(emptyUser);

    const params = useParams();

    useEffect(() => {
        if (params.id) {
            readUser(params.id).then(response => {
                setUser(response.data);
            });
        }
    }, [params.id]);

    const onControlValueChange = (name, newValue) => {
        setUser((prevState) => {
            return {
                ...prevState,
                [name]: newValue
            }
        });
    }

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onPasswordChange = (name, newValue) => {
        setPassword(newValue)
    }
    const onConfirmPasswordChange = (name, newValue) => {
        setConfirmPassword(newValue)
    }

    const navigate = useNavigate()

    const [fullNameError, setFullNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");

    let [currentUser, setCurrentUser] = useContext(loggedUserContext)

    useEffect(() => {
        setGeneralError("")
    }, [user, password, confirmPassword])

    const onFormSubmit = (event) => {
        event.preventDefault();

        let errors = false

        if (!user.fullName) {
            setFullNameError("Name cannot be empty")
            errors = true
        }

        if (!emailRegex.test(user.email.toLowerCase())) {
            setEmailError("Invalid email")
            errors = true
        }

        if (!user.phoneNumber) {
            setPhoneNumberError("Phone number cannot be empty")
            errors = true
        }

        if (!user.id) {
            if (!password || (password.length < 8 || password.length > 20)) {
                setPasswordError("Password must be between 8 and 20 characters")
                errors = true
            }
        } else {
            if (password && (password.length < 8 || password.length > 20)) {
                setPasswordError("Password must be between 8 and 20 characters")
                errors = true
            }
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match")
            errors = true
        }

        if (errors) return;

        if (password) user.password = password

        createOrUpdateUser(user).then(() => {
            if (!user.id) {
                findUser(user.email, password).then(user => {
                    loginUser(user)
                    setCurrentUser(user)
                    navigate('/')
                });
            } else {
                if (user.id === currentUser.id) {
                    loginUser(user)
                    setCurrentUser(user)
                }
                if (currentUser.isAdmin) navigate("/user/list");
                else navigate('/');
            }
        }).catch(error => setGeneralError(error.message));
    };


    return <div className="w-full  flex-1  flex justify-center items-center">
        <div className="w-full max-w-xl">
            <form onSubmit={onFormSubmit} className="bg-gray-300 shadow-md rounded px-8 pt-6 pb-8">
                <h1 className="text-3xl text-gray-800 font-semibold w-full text-center mb-5">{headerText}</h1>
                <Input id="fullName" name="fullName" label="Full name" type="text" placeHolder="Full name"
                       value={user.fullName}
                       error={fullNameError} setError={setFullNameError}
                       onValueChange={onControlValueChange}/>
                <Input id="email" name="email" label="Email" type="email" placeHolder="Email" value={user.email}
                       error={emailError} setError={setEmailError}
                       onValueChange={onControlValueChange}/>
                <Input id="phoneNumber" name="phoneNumber" label="Phone number" type="text" placeHolder="Phone number"
                       value={user.phoneNumber}
                       error={phoneNumberError} setError={setPhoneNumberError}
                       onValueChange={onControlValueChange}/>
                <Input id="password" name="password" label="Password" type="password" placeHolder="******************"
                       value={password} autocomplete={"on"}
                       error={passwordError} setError={setPasswordError}
                       onValueChange={onPasswordChange}/>
                <Input id="confirmPassword" name="confirmPassword" label="Confirm password" type="password"
                       placeHolder="******************"
                       value={confirmPassword}
                       autocomplete={"on"}
                       error={confirmPasswordError} setError={setConfirmPasswordError}
                       onValueChange={onConfirmPasswordChange}/>
                {(!user.id||(currentUser.isAdmin && user.id !== currentUser.id)  ) &&
                    <CheckBoxInput name="isAdmin" label="Administrator" checked={user.isAdmin}
                                   onCheckedChange={onControlValueChange}/>}
                {generalError && <p className="text-red-500 text-xs italic my-3">{generalError}</p>}
                <div className="flex items-center justify-between pt-1">
                    <button
                        className="shadow bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        type="submit">
                        {primaryButtonText}
                    </button>
                    <div
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
                        onClick={onSecondaryButtonClicked}>{secondaryButtonText}
                    </div>
                </div>
            </form>
        </div>
    </div>
}