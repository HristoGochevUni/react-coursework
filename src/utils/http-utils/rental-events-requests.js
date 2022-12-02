import axios from 'axios';
import {readUser} from "./users-requests";
import {readVehicle} from "./vehicles-requests";

const apiUrl = 'http://localhost:3005/rental_events';

export async function getAllRentalEvents(userId = "", vehicleId = "") {
    let url = apiUrl;
    if (userId && vehicleId) {
        url = `${apiUrl}?userId=${userId}&vehicleId=${vehicleId}`
    } else if (userId) {
        url = `${apiUrl}?userId=${userId}`
    } else if (vehicleId) {
        url = `${apiUrl}?vehicleId=${vehicleId}`
    }
    return axios.get(url)
}

export async function getAllRentalEventsWithData(userId = "", vehicleId = "") {
    const rentalEventDTOs = (await getAllRentalEvents(userId, vehicleId)).data;
    const rentalEventPromises = rentalEventDTOs.map(async dto => {
        const user = (await readUser(dto.userId)).data
        const vehicle = (await readVehicle(dto.vehicleId)).data

        return {
            id: dto.id,
            startDateTime: dto.startDateTime,
            endDateTime: dto.endDateTime,
            user: user,
            vehicle: vehicle
        }
    })
    return Promise.all(rentalEventPromises)
}

export function createOrUpdateRentalEvent(rentalEvent) {
    if (rentalEvent.id) {
        return axios.put(`${apiUrl}/${rentalEvent.id}`, rentalEvent)
    } else {
        return axios.post(`${apiUrl}`, rentalEvent);
    }
}


export function readRentalEvent(id) {
    return axios.get(`${apiUrl}/${id}`);
}


export function deleteRentalEvent(id) {
    return axios.delete(`${apiUrl}/${id}`);
}




