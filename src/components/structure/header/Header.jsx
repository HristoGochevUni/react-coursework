import {Logo} from "../../util/logo/Logo";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {logoutUser} from "../../../utils/storage/user-storage";
import {loggedUserContext, rentalSearchTermContext, vehicleSearchTermContext} from "../../../App";
import {ProfileDropdown} from "../../util/dropdown/ProfileDropdown";
import {SearchBar} from "../../util/search/SearchBar";
import {PlusButton} from "../../util/button/PlusButton";

export function Header() {

    const navigate = useNavigate();
    const location = useLocation();

    const [currentUser, setLoggedUser] = useContext(loggedUserContext);
    const [vehicleSearchTerm, setVehicleSearchTerm] = useContext(vehicleSearchTermContext)
    const [rentalSearchTerm, setRentalSearchTerm] = useContext(rentalSearchTermContext)

    const logout = () => {
        logoutUser();
        setLoggedUser(null)
        navigate("/login");
    }

    const onVehiclesButtonClicked = () => {
        navigate("/vehicle/list")
    }
    const onUsersButtonClicked = () => {
        navigate("/user/list")
    }

    const renderLoggedOutComponents = () => {
        return <div className="flex gap-2">
            <Link to="/login"
                  className="text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-700">Sign
                in</Link>
            <Link to="/register"
                  className="text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-blue-700 bg-blue-600">Sign
                up</Link>
        </div>
    }


    const renderLoggedInComponents = () => {
        const onSearchVehicle = (event) => {
            setVehicleSearchTerm(event.target.value)
        }
        const onSearchRental = (event) => {
            setRentalSearchTerm(event.target.value)
        }
        const onAddButtonClicked = () => {
            navigate("/vehicle/create")
        }
        const onEditProfilePressed = () => {
            navigate(`/user/edit/${currentUser.id}`)
        }
        const onMyRentals = () => {
            navigate(`/user/rentals/${currentUser.id}`)
        }

        return <div className="flex items-center gap-5">
            {location.pathname.startsWith("/vehicle/list") &&
                <SearchBar onSearch={onSearchVehicle} value={vehicleSearchTerm}/>}
            {location.pathname.startsWith("/user/rentals") &&
                <SearchBar onSearch={onSearchRental} value={rentalSearchTerm}/>}
            {currentUser.isAdmin && location.pathname.startsWith("/vehicle") &&
                <PlusButton text="Vehicle" onClick={onAddButtonClicked}/>}
            <ProfileDropdown user={currentUser} onSignOutPressed={logout} onMyRentals={onMyRentals}
                             onEditProfile={onEditProfilePressed}/>
        </div>
    }


    return <header>
        <nav
            className="border-gray-200 px-52  bg-gray-800  bg-opacity-90  ">
            <div className="flex justify-between items-center  h-14 ">
                <div className="flex items-center gap-4">
                    <Link to="/vehicle/list" className="flex items-center gap-1  order-1">
                        <Logo/>
                        <span
                            className="text-lg font-semibold whitespace-nowrap text-white">Rent a ride</span>

                    </Link>
                    <div className="flex order-2">
                        {currentUser && <button onClick={onVehiclesButtonClicked}
                                                className={(location.pathname.startsWith("/vehicle/list") ? 'text-white ' : 'text-gray-400 ') + "py-2 px-3 font-medium rounded text-md"}>Vehicles</button>}
                        {currentUser && currentUser.isAdmin &&
                            <button onClick={onUsersButtonClicked}
                                    className={(location.pathname.startsWith("/user/list") ? 'text-white ' : 'text-gray-400 ') + "py-2 px-3 font-medium rounded  text-md"}>Users</button>}
                    </div>
                </div>


                <div className="flex items-center order-3 flex-grow-0">
                    {!currentUser && renderLoggedOutComponents()}
                    {currentUser && renderLoggedInComponents()}
                </div>
            </div>
        </nav>
    </header>
}