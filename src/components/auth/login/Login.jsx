import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {Input} from "../../util/input/Input";
import {loggedUserContext} from "../../../App";
import {findUser} from "../../../utils/http-utils/users-requests";
import {loginUser} from "../../../utils/storage/user-storage";


export function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginError, setLoginError] = useState("");

    const [, setLoggedUser] = useContext(loggedUserContext);

    const onEmailChange = (name, newValue) => {
        setEmail(newValue)
        setLoginError("")
    }

    const onPasswordChange = (name, newValue) => {
        setPassword(newValue)
        setLoginError("")
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        findUser(email, password).then(user => {
            loginUser(user)
            setLoggedUser(user)
            navigate('/')
        }).catch(error => {
            setEmail("")
            setPassword("")
            setLoginError(error.message)
        })
    };

    return <div className="w-full flex-1 flex justify-center items-center">
        <div className="w-full max-w-xs">
            <form onSubmit={onFormSubmit} className="bg-gray-300 shadow-md rounded-lg px-8 pt-6 pb-8">
                <div className="mb-5 text-center">
                    <h1 className="text-3xl text-gray-800 font-semibold">Login</h1>
                </div>
                <Input id="email" name="email" label="Email" type="email" placeHolder="Email" value={email}
                       onValueChange={onEmailChange}
                       error={loginError}
                       showErrorText={false}
                       setError={setLoginError}/>
                <Input id="password" name="password" label="Password" type="password" placeHolder="******************"
                       value={password} onValueChange={onPasswordChange}
                       error={loginError}
                       showErrorText={false}
                       setError={setLoginError}/>
                {loginError && <p className="text-red-500 text-xs italic mb-4 mt-3">{loginError}</p>}
                <div className="flex items-center justify-between pt-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 shadow text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Sign in
                    </button>
                    <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                          to="/register">Need an account?</Link>
                </div>
            </form>
        </div>
    </div>
}