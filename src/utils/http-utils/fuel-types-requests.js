import axios from "axios";

const apiUrl = 'http://localhost:3005/fuel_types';

export function getAllFuelTypes() {
    return axios.get(apiUrl);
}

export function readFuelType(id){
    return axios.get(`${apiUrl}/${id}`);
}
