import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <main className="size-full text-center grid place-content-center gap-10">
            <Outlet />
        </main>
    );
}
export default AppLayout;