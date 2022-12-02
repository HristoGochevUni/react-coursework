import {deleteUser} from "../../../utils/http-utils/users-requests";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {loggedUserContext} from "../../../App";
import {getAllRentalEvents} from "../../../utils/http-utils/rental-events-requests";

export function UserCard({user, onDeleted}) {

    const navigate = useNavigate()
    const [currentUser] = useContext(loggedUserContext)

    const [generalError,setGeneralError]= useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            if (generalError){
                setGeneralError("")
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [generalError]);

    const onDeleteUser = () => {
       getAllRentalEvents(user.id).then(response=>{
           if (response.data.length===0){
               deleteUser(user.id).then(() => {
                   onDeleted(user.id)
               });
           }else{
                setGeneralError("User has rentals. Cannot delete.")
           }
       })
    }

    const onEditUser = () => {
        navigate(`/user/edit/${user.id}`)
    }

    const onViewRentals=()=>{
        navigate(`/user/rentals/${user.id}`)
    }

    return <div
        className="rounded-md overflow-hidden shadow bg-gray-300 flex flex-col border border-gray-800 border-opacity-90">
        <div className="px-6 py-5 flex flex-col justify-between h-full">
            <div className="flex flex-col justify-start mb-5">
                <h1 className="font-bold text-lg">{user.fullName}</h1>
                {user.id === currentUser.id && <h1 className="font-medium text-sm text-blue-500">Current user</h1>}
                <div className="flex flex-col mt-2.5 gap-1.5">
                    <h2 className="font-medium text-md">Email: {user.email}</h2>
                    <h2 className="font-medium text-md">Phone number: {user.phoneNumber}</h2>
                </div>
                {generalError && <p className="text-red-500 text-sm font-medium mt-2">{generalError}</p>}
            </div>
            <div className="flex  gap-3.5 justify-start ">
                <button className="bg-blue-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                        onClick={onViewRentals}>Rentals
                </button>
                <button
                    className="bg-yellow-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                    onClick={onEditUser}>Edit
                </button>
                {user.id !== currentUser.id && <button
                    className="bg-red-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                    onClick={onDeleteUser}>Delete
                </button>}
            </div>
        </div>
    </div>
}