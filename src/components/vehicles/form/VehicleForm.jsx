import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllVehicleTypes} from "../../../utils/http-utils/vehicle-types-requests";
import {getAllFuelTypes} from "../../../utils/http-utils/fuel-types-requests";
import {createOrUpdateVehicle, readVehicle} from "../../../utils/http-utils/vehicles-requests";
import {Input} from "../../util/input/Input";
import {DropdownInput} from "../../util/input/DropdownInput";

export function VehicleForm({headerText, primaryButtonText, secondaryButtonText}) {

    const emptyVehicle = {
        id: "",
        brand: "",
        model: "",
        constructionYear: "",
        numberOfSeats: "",
        picture: "",
        availableVehicles: "",
        pricePerDay: "",
        fuelTypeId: "1",
        vehicleTypeId: "1"
    };

    const [vehicle, setVehicle] = useState(emptyVehicle);

    const params = useParams();

    useEffect(() => {
        if (params.id) {
            readVehicle(params.id).then(response => {
                setVehicle(response.data);
            })
        }
    }, [params.id]);

    const onControlValueChange = (name, newValue) => {
        setVehicle((prevState) => {
            return {
                ...prevState,
                [name]: newValue
            }
        });
    }

    const navigate = useNavigate()

    const [vehicleTypes, setVehicleTypes] = useState([])
    const [fuelTypes, setFuelTypes] = useState([])

    const [brandError, setBrandError] = useState("");
    const [modelError, setModelError] = useState("");
    const [yearError, setYearError] = useState("");
    const [typeIdError, setTypeIdError] = useState("");
    const [fuelIdError, setFuelIdError] = useState("");
    const [numberOfSeatsError, setNumberOfSeatsError] = useState("");
    const [pictureError, setPictureError] = useState("");
    const [pricePerDayError, setPricePerDayError] = useState("");
    const [availableVehiclesError, setAvailableVehiclesError] = useState("");
    const [generalError, setGeneralError] = useState("")

    useEffect(() => {
        getAllVehicleTypes().then(response => {
            setVehicleTypes(response.data)
        })
    }, [])

    useEffect(() => {
        getAllFuelTypes().then(response => {
            setFuelTypes(response.data)
        })
    }, [])



    const onFormSubmit = (event) => {
        event.preventDefault();

        let errors = false

        if (!vehicle.brand) {
            setBrandError("Brand cannot be empty")
            errors = true
        }
        if (!vehicle.model) {
            setModelError("Model cannot be empty")
            errors = true
        }
        if (!vehicle.constructionYear || vehicle.constructionYear < 1) {
            setYearError("Invalid construction year")
            errors = true
        }
        if (!vehicle.numberOfSeats || vehicle.numberOfSeats < 1) {
            setNumberOfSeatsError("Invalid number of seats")
            errors = true
        }
        if (!vehicle.pricePerDay || vehicle.pricePerDay < 1) {
            setPricePerDayError("Invalid price per day")
            errors = true
        }
        if (!vehicle.availableVehicles || vehicle.availableVehicles < 0) {
            setAvailableVehiclesError("Invalid number of vehicles")
            errors = true
        }

        if (!vehicle.picture) {
            vehicle.picture = `https://picsum.photos/200/300?random=${Math.random()}`
        }

        if (errors) return;


        createOrUpdateVehicle(vehicle).then(() => {
            navigate('/vehicle/list')
        }).catch(error => setGeneralError(error.message));
    };

    return <div className="w-full  flex-1  flex justify-center items-center">
        <div className="w-full max-w-xl">
            <form onSubmit={onFormSubmit}
                  className="bg-gray-300  shadow-md rounded px-10 pt-6 pb-8 flex flex-col">
                <h1 className="text-3xl text-gray-800 font-semibold w-full text-center mb-5">{headerText}</h1>
                <div className="flex gap-8">
                    <div className="w-1/2">
                        <Input id="brand" label="Brand *" type="text" placeHolder="Brand" name="brand"
                               error={brandError} setError={setBrandError} value={vehicle.brand}
                               onValueChange={onControlValueChange}/>
                    </div>
                    <div className="w-1/2">
                        <Input id="model" label="Model *" type="text" placeHolder="Model" value={vehicle.model}
                               error={modelError} setError={setModelError} name="model"
                               onValueChange={onControlValueChange}/>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="w-1/2">
                        <DropdownInput label="Vehicle type *" value={vehicle.vehicleTypeId} error={typeIdError}
                                       setError={setTypeIdError} id="vehicleType" options={vehicleTypes}
                                       name="vehicleTypeId" onValueChange={onControlValueChange}/>
                    </div>
                    <div className="w-1/2">
                        <DropdownInput label="Fuel type *" value={vehicle.fuelTypeId} error={fuelIdError}
                                       setError={setFuelIdError} id="fuelType" options={fuelTypes} name="fuelTypeId"
                                       onValueChange={onControlValueChange}/>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="w-1/2">
                        <Input id="year" label="Construction year *" type="number" placeHolder="Construction year"
                               value={vehicle.constructionYear}
                               name="constructionYear"
                               onValueChange={onControlValueChange}
                               setError={setYearError}
                               error={yearError}/>
                    </div>
                    <div className="w-1/2">
                        <Input id="seats" label="Number of seats *" type="number" placeHolder="Number of seats"
                               value={vehicle.numberOfSeats}
                               onValueChange={onControlValueChange}
                               name="numberOfSeats"
                               setError={setNumberOfSeatsError}
                               error={numberOfSeatsError}/>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="w-full">
                        <Input id="picture" label="Picture url" type="text" placeHolder="Picture url"
                               value={vehicle.picture}
                               name="picture"
                               onValueChange={onControlValueChange}
                               setError={setPictureError} error={pictureError}/>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="w-1/2">
                        <Input id="price" label="Price per day *" type="number" placeHolder="Price per day"
                               value={vehicle.pricePerDay} name="pricePerDay" onValueChange={onControlValueChange}
                               setError={setPricePerDayError} error={pricePerDayError}/>
                    </div>
                    <div className="w-1/2">
                        <Input id="vehicles" label="Available vehicles *" type="number" placeHolder="Available vehicles"
                               value={vehicle.availableVehicles}
                               name="availableVehicles"
                               onValueChange={onControlValueChange}
                               setError={setAvailableVehiclesError} error={availableVehiclesError}/>
                    </div>
                </div>
                {generalError && <p className="text-red-500 text-xs italic my-3">{generalError}</p>}
                <div className="flex items-center justify-between pt-1">
                    <button
                        className="shadow bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        type="submit">
                        {primaryButtonText}
                    </button>
                    <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                          to="/vehicle/list">{secondaryButtonText}
                    </Link>
                </div>
            </form>
        </div>
    </div>
}