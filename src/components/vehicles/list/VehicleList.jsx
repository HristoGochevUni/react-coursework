import {useContext, useEffect, useState} from "react";
import {VehicleCard} from "../card/VehicleCard";
import {getAllVehiclesWithData} from "../../../utils/http-utils/vehicles-requests";
import {vehicleSearchTermContext} from "../../../App";

export function VehicleList() {
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm] = useContext(vehicleSearchTermContext)

    useEffect(() => {
        getAllVehiclesWithData().then(vehicles => {
            setVehicles(vehicles)
        })
    }, [])

    const onDeleted = (id) => {
        setVehicles(prevState => {
            return prevState.filter(vehicle => vehicle.id !== id);
        });
    }

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  px-40 py-10   w-full h-full  gap-10">
        {vehicles.filter(vehicle => {
            const lowerCasedSearchTerm = searchTerm.toLowerCase()
            const inName = `${vehicle.brand} ${vehicle.model} - ${vehicle.constructionYear}`.toLowerCase().includes(lowerCasedSearchTerm)
            const inFuel = vehicle.fuelType.name.toLowerCase().includes(lowerCasedSearchTerm)
            const inType = vehicle.vehicleType.name.toLowerCase().includes(lowerCasedSearchTerm)
            const inPrice = vehicle.pricePerDay.includes(lowerCasedSearchTerm)
            const inSeats = vehicle.numberOfSeats.includes(lowerCasedSearchTerm)
            return inName || inFuel || inType || inPrice || inSeats
        }).map(vehicle => <VehicleCard vehicle={vehicle} key={vehicle.id} onDeleted={onDeleted}/>)}
    </div>;
}