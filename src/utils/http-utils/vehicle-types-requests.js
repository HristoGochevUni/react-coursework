import axios from "axios";

const apiUrl = 'http://localhost:3005/vehicle_types';

export function getAllVehicleTypes() {
    return axios.get(apiUrl);
}
export function readVehicleType(id){
    return axios.get(`${apiUrl}/${id}`);
}

