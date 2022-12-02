import axios from 'axios';
import {readFuelType} from "./fuel-types-requests";
import {readVehicleType} from "./vehicle-types-requests";

const apiUrl = 'http://localhost:3005/vehicles';

export function getAllVehicles() {
    return axios.get(apiUrl)
}

export async function getAllVehiclesWithData() {
    const vehicleDTOs = (await getAllVehicles()).data;
    const vehiclePromises = vehicleDTOs.map(async dto => {
        const fuelType = (await readFuelType(dto.fuelTypeId)).data
        const vehicleType = (await readVehicleType(dto.vehicleTypeId)).data
        return {
            id: dto.id,
            brand: dto.brand,
            model: dto.model,
            constructionYear: dto.constructionYear,
            numberOfSeats: dto.numberOfSeats,
            picture: dto.picture,
            availableVehicles: dto.availableVehicles,
            pricePerDay: dto.pricePerDay,
            fuelType: fuelType,
            vehicleType: vehicleType
        }
    })
    return Promise.all(vehiclePromises)
}

export function createOrUpdateVehicle(vehicle) {
    if (vehicle.id) {
        return axios.put(`${apiUrl}/${vehicle.id}`, vehicle)
    } else {
        return axios.post(`${apiUrl}`, vehicle);
    }
}

export function readVehicle(id) {
    return axios.get(`${apiUrl}/${id}`);
}

export function deleteVehicle(id) {
    return axios.delete(`${apiUrl}/${id}`);
}




