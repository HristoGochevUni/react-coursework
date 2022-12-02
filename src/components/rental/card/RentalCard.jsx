import {useContext, useState} from "react";
import {RentalModal} from "../modal/RentalModal";
import {deleteRentalEvent} from "../../../utils/http-utils/rental-events-requests";
import {calcVip} from "../../../utils/http-utils/users-requests";
import {loggedUserContext} from "../../../App";
import {loginUser} from "../../../utils/storage/user-storage";

export function RentalCard({rental, onDeleted}) {
    const [modalHidden, setModalHidden] = useState(true)

    const onEditRentalEvent = () => {
        setModalHidden(false)
    }
    const [currentUser,setCurrentUser]= useContext(loggedUserContext)

    const onDeleteRentalEvent = () => {
        deleteRentalEvent(rental.id).then(() => {
            calcVip(rental.user.id,(user)=>{
                if (rental.userId === currentUser.id) {
                    loginUser(user)
                    setCurrentUser(user)
                }
            })
            onDeleted(rental.id)
        });
    }

    const onUpdate=(newRentalDetails)=>{
        rental.startDateTime=newRentalDetails.startDateTime
        rental.endDateTime=newRentalDetails.endDateTime
    }

    const formatDate = (string) => {
        const options = {year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric"};
        return new Date(string).toLocaleDateString("en-US", options);
    }

    return <div
        className="rounded-md overflow-hidden shadow bg-gray-300 flex flex-col border border-gray-800 border-opacity-90">
        <img className="w-full h-44" src={rental.vehicle.picture} alt="Rental"/>
        <div className="px-6 py-5 flex flex-col justify-start border-t border-t-gray-800 border-t-opacity-90">
            <h1 className="font-bold text-lg">{`${rental.vehicle.brand} ${rental.vehicle.model} - ${rental.vehicle.constructionYear}`}</h1>
            <div className="flex flex-col mt-2.5 mb-5 gap-1.5">
                <h2 className="font-medium text-md">Start date and
                    time:<br/><span className="font-bold">{formatDate(rental.startDateTime)}</span></h2>
                <h2 className="font-medium text-md">End date and
                    time:<br/><span className="font-bold">{formatDate(rental.endDateTime)}</span></h2>
            </div>
            <div className="flex  gap-3.5 justify-start">
                <button
                    className="bg-yellow-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                    onClick={onEditRentalEvent}>Edit
                </button>
                <button
                    className="bg-red-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                    onClick={onDeleteRentalEvent}>Delete
                </button>
            </div>
        </div>
        <RentalModal rentalId={rental.id} hidden={modalHidden} setHidden={setModalHidden}
                     vehicle={rental.vehicle} onUpdate={onUpdate}/>
    </div>
}
