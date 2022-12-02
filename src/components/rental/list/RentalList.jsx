import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RentalCard} from "../card/RentalCard";
import {getAllRentalEventsWithData} from "../../../utils/http-utils/rental-events-requests";
import {rentalSearchTermContext} from "../../../App";

export function RentalList() {
    const [rentals, setRentals] = useState([]);
    const [rentalSearchTerm] = useContext(rentalSearchTermContext)
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            getAllRentalEventsWithData(params.id).then(response => {
                setRentals(response);
            });
        }
    }, [params.id]);


    const onDeleted = (id) => {
        setRentals(prevState => {
            return prevState.filter(rental => rental.id !== id);
        });
    }

    return <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  px-28 xl:px-32 2xl:px-40 py-10 w-full h-full   gap-10">
        {rentals.filter(rental => {
            const lowerCasedSearchTerm = rentalSearchTerm.toLowerCase()
            const inDescription = `${rental.vehicle.brand} ${rental.vehicle.model} - ${rental.vehicle.constructionYear}`.toLowerCase().includes(lowerCasedSearchTerm)
            const inStartDate = rental.startDateTime.includes(lowerCasedSearchTerm)
            const inEndDate = rental.endDateTime.includes(lowerCasedSearchTerm)
            return inDescription || inStartDate || inEndDate
        }).map(rental => <RentalCard rental={rental} key={rental.id} onDeleted={onDeleted}/>)}
    </div>
}