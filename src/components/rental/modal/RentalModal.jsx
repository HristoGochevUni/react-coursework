import {useContext, useEffect, useState} from "react";
import {Input} from "../../util/input/Input";
import {
    createOrUpdateRentalEvent,
    readRentalEvent
} from "../../../utils/http-utils/rental-events-requests";
import {loggedUserContext} from "../../../App";
import {calcVip, readUser} from "../../../utils/http-utils/users-requests";
import {loginUser} from "../../../utils/storage/user-storage";

export function RentalModal({rentalId, hidden, setHidden, vehicle, onUpdate}) {

    useEffect(() => {
        const onEscapePressed = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                setHidden(true)
            }
        }
        window.addEventListener('keydown', onEscapePressed)
        return () => window.removeEventListener('keydown', onEscapePressed)
    }, [setHidden])

    const [currentUser, setCurrentUser] = useContext(loggedUserContext)

    const emptyRental = {
        id: "",
        startDateTime: "",
        endDateTime: "",
        userId: "",
        vehicleId: ""
    };

    const [rental, setRental] = useState(emptyRental)

    useEffect(() => {
        if (rentalId) {
            readRentalEvent(rentalId).then(response => {
                setRental(response.data);
            });
        }
    }, [rentalId]);


    const [userVIP, setUserVIP] = useState(false)
    const [totalDays, setTotalDays] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    const [startDateTimeError, setStartDateTimeError] = useState("")
    const [endDateTimeError, setEndDateTimeError] = useState("")
    const [generalError, setGeneralError] = useState("");

    const onControlValueChange = (name, newValue) => {
        setRental((prevState) => {
            return {
                ...prevState,
                [name]: newValue
            }
        });
    }

    const hideModal = () => {
        setHidden(true)
    }

    const formatTo2Decimal = (decimal) => {
        return decimal.toFixed(2)
    }


    useEffect(() => {
        setGeneralError("")
    }, [rental])

    useEffect(() => {
        setStartDateTimeError("")
        setEndDateTimeError("")
        setGeneralError("")
    }, [hidden])

    // Gets if the owner is VIP
    useEffect(() => {
        if (rental.id) {
            readUser(rental.userId).then(response => {
                setUserVIP(response.data.isVIP)
            })
        } else {
            setUserVIP(currentUser.isVIP)
        }
    }, [rental.userId, rental.id, currentUser.isVIP])

    // Calculates the days difference between start and end date
    useEffect(() => {
        const startDate = new Date(rental.startDateTime)
        const endDate = new Date(rental.endDateTime)
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        setTotalDays(differenceInDays)
    }, [rental])


    // Gets the discount
    useEffect(() => {
        if (userVIP) {
            setDiscount(15)
            return
        }
        if (totalDays > 10) {
            setDiscount(10)
            return
        }
        if (totalDays > 5) {
            setDiscount(7)
            return
        }
        if (totalDays > 3) {
            setDiscount(5)
            return
        }

        setDiscount(0)
    }, [userVIP, totalDays])

    useEffect(() => {
        const totalCost = totalDays * vehicle.pricePerDay
        const discountCost = (discount * totalCost) / 100
        setTotalPrice(totalCost - discountCost)
    }, [vehicle, totalDays, discount])

    const onFormSubmit = (event) => {
        event.preventDefault();

        let errors = false

        if (!rental.startDateTime) {
            setStartDateTimeError("Please specify start date and time")
            errors = true
        }

        if (!rental.endDateTime) {
            setEndDateTimeError("Please specify end date and time")
            errors = true
        }

        if (totalDays <= 0) {
            setEndDateTimeError("End date and time must be higher")
            errors = true
        }

        if (errors) return;

        if (!rental.id) {
            rental.userId = currentUser.id
            rental.vehicleId = vehicle.id
        }

        createOrUpdateRentalEvent(rental).then(() => {
            setHidden(true)
            if (rental.id) {
                calcVip(rental.userId, (user) => {
                    if (rental.userId === currentUser.id) {
                        loginUser(user)
                        setCurrentUser(user)
                    }
                })
                onUpdate(rental)
            } else {
                calcVip(currentUser.id, (user) => {
                    loginUser(user)
                    setCurrentUser(user)
                })
            }
        }).catch(error => setGeneralError(error.message));
    }

    return <div className="relative z-10" hidden={hidden} aria-labelledby="modal-title"
                role="dialog" aria-modal="true">

        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto flex justify-center items-center">
            <form onSubmit={onFormSubmit} className="bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
                <h1 className="text-2xl text-gray-800 font-semibold w-full text-center mb-5">Rent {`${vehicle.brand} ${vehicle.model}`}</h1>
                <Input id="startDateTime" name="startDateTime" label="Start date and time" type="datetime-local"
                       placeHolder=""
                       value={rental.startDateTime}
                       error={startDateTimeError} setError={setStartDateTimeError}
                       onValueChange={onControlValueChange}/>
                <Input id="endDateTime" name="endDateTime" label="End date and time" type="datetime-local"
                       placeHolder=""
                       value={rental.endDateTime}
                       error={endDateTimeError} setError={setEndDateTimeError}
                       onValueChange={onControlValueChange}/>
                {totalDays > 0 && <div className="flex flex-col gap-1 my-1">
                    <h1 className="text-gray-800 font-medium text-md">Discount: <span
                        className="font-bold">{discount}%</span>{userVIP &&
                        <span className="font-medium text-blue-600"> (VIP discount)</span>}</h1>
                    <h1 className="text-gray-800 font-medium text-md">Total price: <span
                        className="font-bold">{formatTo2Decimal(totalPrice)}$</span></h1>
                </div>}
                {generalError && <p className="text-red-500 text-xs italic my-3">{generalError}</p>}
                <div className="flex items-center justify-between pt-2">
                    <button
                        className="shadow bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        type="submit">
                        Confirm
                    </button>
                    <div
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
                        onClick={hideModal}>Cancel
                    </div>
                </div>
            </form>
        </div>
    </div>

}