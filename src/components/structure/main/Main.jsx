import {Outlet} from "react-router-dom";

export function Main() {
    return (
        <main className="flex-1 h-full w-full flex">
            <Outlet />
        </main>
    );
}