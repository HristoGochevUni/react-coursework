import {Header} from "../header/Header";
import {Footer} from "../footer/Footer";
import {Main} from "../main/Main";

export function Layout() {
    return <div
        className="flex  flex-col  min-h-screen bg-cover bg-[url('https://images.unsplash.com/photo-1490902931801-d6f80ca94fe4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')]">
        <Header />
        <Main/>
        <Footer/>
    </div>
}