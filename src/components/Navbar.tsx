import { NavLink } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="fixed left-0 top-[73px] h-screen w-[250px] z-20 bg-[#FCFCFC] py-[25px] px-4">
            <ul className="grid grid-cols-1">
                <li className="w-full">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex text-lg font-normal py-4 px-6 rounded-[12px] transition-colors ${
                                isActive
                                    ? "bg-[#475BE8] text-[#FCFCFC]"
                                    : "bg-[#FCFCFC] text-[#808191]"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li className="w-full">
                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            `flex text-lg font-normal py-4 px-6 rounded-[12px] transition-colors ${
                                isActive
                                    ? "bg-[#475BE8] text-[#FCFCFC]"
                                    : "bg-[#FCFCFC] text-[#808191]"
                            }`
                        }
                    >
                        Tasks
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
