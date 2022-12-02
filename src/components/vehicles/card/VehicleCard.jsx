import {useContext, useEffect, useState} from "react";
import {loggedUserContext} from "../../../App";
import {deleteVehicle} from "../../../utils/http-utils/vehicles-requests";
import {useNavigate} from "react-router-dom";
import {RentalModal} from "../../rental/modal/RentalModal";
import {getAllRentalEvents} from "../../../utils/http-utils/rental-events-requests";

export function VehicleCard({vehicle, onDeleted}) {

    const [currentUser] = useContext(loggedUserContext)
    const navigate = useNavigate()
    const [modalHidden, setModalHidden] = useState(true)
    const [rentals, setRentals] = useState([])
    const [generalError, setGeneralError] = useState("")

    const onRentVehicle = () => {
        setModalHidden(false)
    }

    const onEditVehicle = () => {
        navigate(`/vehicle/edit/${vehicle.id}`)
    }

    const onDeleteVehicle = () => {
        if (rentals.length > 0) {
            setGeneralError("Vehicle is rented. Cannot delete.")
        } else {
            deleteVehicle(vehicle.id).then(() => {
                onDeleted(vehicle.id)
            });
        }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            if (generalError) {
                setGeneralError("")
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [generalError]);


    useEffect(() => {
        getAllRentalEvents("", vehicle.id).then(response => {
            setRentals(response.data)
        })
    }, [vehicle.id])

    return <div
        className="rounded-md overflow-hidden shadow bg-gray-300 flex flex-col border border-gray-800 border-opacity-90">
        <img className="w-full h-44" src={vehicle.picture} alt="Random"/>
        <div className="px-6 py-5 flex flex-col justify-start border-t border-t-gray-800 border-t-opacity-90">
            <h1 className="font-bold text-lg">{vehicle.brand} {vehicle.model} - {vehicle.constructionYear}</h1>
            <div className="flex flex-col mt-2.5 mb-5 gap-1.5">
                <h2 className="font-medium text-md">Type: {vehicle.vehicleType.name}</h2>
                <h2 className="font-medium text-md">Fuel: {vehicle.fuelType.name}</h2>
                <h2 className="font-medium text-md">Seats: {vehicle.numberOfSeats}</h2>
                <h2 className="font-medium text-md">Price: {vehicle.pricePerDay}$ per day</h2>
                <h2 className="font-medium text-md">Available
                    vehicles: {vehicle.availableVehicles - rentals.length}</h2>
                {generalError && <p className="text-red-500 text-sm font-medium ">{generalError}</p>}
            </div>
            <div className="flex  gap-3.5 justify-start">
                {(vehicle.availableVehicles - rentals.length > 0) &&
                    <button className="bg-blue-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                            onClick={onRentVehicle}>Rent
                    </button>}
                {currentUser.isAdmin && <button
                    className="bg-yellow-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                    onClick={onEditVehicle}>Edit</button>}
                {currentUser.isAdmin && <button
                    className="bg-red-700 rounded-lg px-4 py-1.5 text-sm font-semibold text-white"
                    onClick={onDeleteVehicle}>Delete</button>}
            </div>
        </div>
        <RentalModal hidden={modalHidden} setHidden={setModalHidden} vehicle={vehicle}/>
    </div>
}