import {ReactNode} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Home, Calendar, Plus} from "lucide-react";

interface Props {
    title?: string;
    showBack?: boolean;
    children: ReactNode;
}

export function MobileLayout({title, showBack = false, children}: Props) {
    const navigate = useNavigate();
    const {pathname} = useLocation();

    return (
        <div className="flex flex-col h-screen max-w-[430px] mx-auto bg-white">

            {/* HEADER */}
            <header className="h-14 border-b flex items-center px-4 gap-3 text-black bg-white">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-700 text-lg leading-none"
                    >
                        ←
                    </button>
                )}
                <h1 className="text-base font-semibold">{title}</h1>
            </header>

            {/* CONTENT (scrollable) */}
            <main className="flex-1 overflow-y-auto px-4 py-3">
                {children}
            </main>

            {/* FOOTER NAV */}
            <footer className="h-16 border-t bg-black flex items-center justify-around text-xs text-white">

                {/* HOME */}
                <button
                    onClick={() => navigate("/")}
                    className={`flex flex-col items-center justify-center ${
                        pathname === "/" ? "opacity-100" : "opacity-60"
                    }`}
                >
                    <Home size={20}/>
                    <span>Home</span>
                </button>

                {/* DIAGNOSTIC */}
                <button
                    onClick={() => navigate("/diagnostic")}
                    className={`flex flex-col items-center justify-center ${
                        pathname === "/diagnostic" ? "opacity-100" : "opacity-60"
                    }`}
                >
                    <Plus size={20}/>
                    <span>Diagnostic</span>
                </button>

                {/* APPOINTMENTS */}
                <button
                    onClick={() => navigate("/appointments")}
                    className={`flex flex-col items-center justify-center ${
                        pathname === "/appointments" ? "opacity-100" : "opacity-60"
                    }`}
                >
                    <Calendar size={20}/>
                    <span>Appointments</span>
                </button>

            </footer>
        </div>
    );
}