export function loginUser(user) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
}

export function getLoggedUser() {
    return JSON.parse(localStorage.getItem('loggedUser'));
}

export function logoutUser() {
    localStorage.removeItem('loggedUser');
}