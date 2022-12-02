import {useContext, useEffect, useState} from "react";
import {getAllUsers} from "../../../utils/http-utils/users-requests";
import {UserCard} from "../card/UserCard";
import {loggedUserContext} from "../../../App";

export function UserList() {
    const [users, setUsers] = useState([]);
    const [currentUser] = useContext(loggedUserContext)

    useEffect(() => {
        getAllUsers().then(response => {
            const users = response.data
            const currentUserId = users.findIndex(value => value.id === currentUser.id)
            const temp = users[currentUserId]
            users[currentUserId] = users[0]
            users[0] = temp
            setUsers(users);
        });
    }, [currentUser.id]);

    const onDeleted = (id) => {
        setUsers(prevState => {
            return prevState.filter(user => user.id !== id);
        });
    }

    return <div className="px-40 py-10  flex flex-row w-full h-full flex-wrap gap-10">
        {users.map(user => <UserCard user={user} key={user.id}
                                     onDeleted={onDeleted}/>)}
    </div>;
}