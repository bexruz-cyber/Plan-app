import { Link } from "react-router-dom"
import profileImg from "../images/profile_image.png"

const Header = () => {
    return (
        <div className="fixed top-0 left-0 w-full py-[15px] z-20 px-5 bg-[#FCFCFC]">
            <div className="flex items-center justify-between">
                <Link className="text-[25px] text-[#11142D] font-bold  flex" to={"/"}>
                    Taskify
                </Link>
                <Link to={"/profile"} className="flex items-center gap-2.5">
                    <img src={profileImg} alt="profile img" className="w-10 h-10" />
                    <div className="">
                        <h2 className="font-semibold text-sm text-[#11142D] leading-[19px]">Hawkins Maru</h2>
                        <p className="font-normal text-sm text-[#11142D] leading-[19px]">Company Manager</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Header