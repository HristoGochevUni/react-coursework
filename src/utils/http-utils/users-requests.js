import axios from 'axios';
import {getAllRentalEvents} from "./rental-events-requests";

const apiUrl = 'http://localhost:3005/users';

export function getAllUsers() {
    return axios.get(apiUrl);
}

export function readUser(id) {
    return axios.get(`${apiUrl}/${id}`);
}

export async function createOrUpdateUser(user) {
    if (user.id) {
        const oldEmail = (await readUser(user.id)).data.email

        if (oldEmail !== user.email) {
            const usersWithSameEmail = (await axios.get(`${apiUrl}?email=${user.email}`)).data;
            if (usersWithSameEmail.length > 0) {
                throw new Error('Another user with the same email already exists!');
            }
        }

        return axios.put(`${apiUrl}/${user.id}`, user)
    } else {
        const usersWithSameEmail = (await axios.get(`${apiUrl}?email=${user.email}`)).data;

        if (usersWithSameEmail.length > 0) {
            throw new Error('User with the same email already exists!');
        }

        return axios.post(`${apiUrl}`, user);
    }
}

export function deleteUser(id) {
    return axios.delete(`${apiUrl}/${id}`);
}

export async function findUser(email, password) {
    const allUsers = (await getAllUsers()).data;

    const foundUser = allUsers.find(c => (c.email === email) && (c.password === password));

    if (!foundUser) {
        throw new Error('Invalid email or password.');
    }

    return foundUser;
}

export function calcVip(userId, onVipUpdated) {
    const timeNow = Date.now();
    getAllRentalEvents(userId).then(response => {
        const rentalsInTheLast60Days = response.data.map(rental => {
            const startDate = new Date(rental.startDateTime)
            const differenceInTime = startDate.getTime() - timeNow;
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            return differenceInDays < 60
        }).filter(result => result === true)
        const vip = rentalsInTheLast60Days.length > 3
        readUser(userId).then(response => {
            const user = response.data
            user.isVIP = vip
            createOrUpdateUser(user).then(user => onVipUpdated(user.data))
        })
    })
}