import { useState } from "react";
import axios from "axios";
import Task from "./Task/Task";
import CompleteTasks from "./Task/CompleteTasks";
import UnCompleteTasks from "./Task/UnCompleteTasks";
import toast from "react-hot-toast";
import { PlusCircle, X } from "lucide-react";
import { SHEET_POST_URL } from "../constants";

type TabType = "tasks" | "complete" | "uncomplete" | "Addtasks";

const Tasks = () => {
  const [activetab, setAtivetab] = useState<TabType>("tasks");
  const [formData, setFormData] = useState({
    "Loyiha nomi": "",
    "Ism familya": "",
    Reja: "",
    Sana: "",
    Soat: "",
    "Qancha vaqt ketishi": "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    "Loyiha nomi": "",
    "Ism familya": "",
    Reja: "",
    Sana: "",
    "Qancha vaqt ketishi": "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      "Loyiha nomi": formData["Loyiha nomi"] ? "" : "Loyiha nomi majburiy",
      "Ism familya": formData["Ism familya"] ? "" : "Ism familya majburiy",
      Reja: formData["Reja"] ? "" : "Reja majburiy",
      Sana: formData["Sana"] ? "" : "Sana majburiy",
      "Qancha vaqt ketishi": formData["Qancha vaqt ketishi"] ? "" : "Qancha vaqt ketishi majburiy",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const now = new Date();
    const currentTime = now.toLocaleTimeString();

    try {
      await axios.post(
        SHEET_POST_URL,
        new URLSearchParams({
          ...formData,
          Soat: currentTime,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      toast.success("Task added successfully");
      closeModal();
    } catch (error) {
      setRefresh(false)
      toast.error("Tarmoqqa ulanishda xatolik.");
      console.error("Axios error:", error);
    } finally {
      setRefresh(true)
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      "Loyiha nomi": "",
      "Ism familya": "",
      Reja: "",
      Sana: "",
      Soat: "",
      "Qancha vaqt ketishi": "",
    });
    setErrors({
      "Loyiha nomi": "",
      "Ism familya": "",
      Reja: "",
      Sana: "",
      "Qancha vaqt ketishi": "",
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="pl-5 pt-7">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <h1 className="capitalize font-bold text-[25px] text-[#11142D] mb-5 leading-[34px]">Tasks list</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="sm:ml-auto px-5 py-3 bg-[#475BE8] rounded-[10px] text-sm font-bold text-[#FCFCFC] leading-[25px] hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          + Add Task
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 px-4 sm:px-5 overflow-auto bg-black/30 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-4 sm:p-6 md:p-8 relative rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-lg md:max-w-md">
            <button onClick={closeModal} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700">
              <X size={20} className="sm:size-8" />
            </button>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-800">
              Yangi ma'lumot qo'shish
            </h2>
            <form className="space-y-3 sm:space-y-4">
              <input
                type="text"
                name="Loyiha nomi"
                value={formData["Loyiha nomi"]}
                onChange={handleChange}
                placeholder="Loyiha nomi"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors["Loyiha nomi"] && <p className="text-red-500 text-xs sm:text-sm">{errors["Loyiha nomi"]}</p>}

              <input
                type="text"
                name="Ism familya"
                value={formData["Ism familya"]}
                onChange={handleChange}
                placeholder="Ism Familya"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors["Ism familya"] && <p className="text-red-500 text-xs sm:text-sm">{errors["Ism familya"]}</p>}

              <textarea
                name="Reja"
                value={formData["Reja"]}
                onChange={handleChange}
                placeholder="Reja"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                rows={4}
              />
              {errors["Reja"] && <p className="text-red-500 text-xs sm:text-sm">{errors["Reja"]}</p>}

              <input
                type="date"
                name="Sana"
                value={formData["Sana"]}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors["Sana"] && <p className="text-red-500 text-xs sm:text-sm">{errors["Sana"]}</p>}

              <input
                type="number"
                name="Qancha vaqt ketishi"
                value={formData["Qancha vaqt ketishi"]}
                onChange={handleChange}
                placeholder="Qancha vaqt ketishi (soat)"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors["Qancha vaqt ketishi"] && (
                <p className="text-red-500 text-xs sm:text-sm">{errors["Qancha vaqt ketishi"]}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white p-2 sm:p-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Yuborilmoqda..." : (
                  <>
                    <PlusCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Qo'shish
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#FCFCFC] rounded-[15px] flex gap-2.5 max-w-[398px] px-[15px] mb-5">
        <button
          className={`py-[15px] px-3 text-base ${
            activetab === "tasks" ? "text-[#475BE8] border-b-[3px] border-[#475BE8]" : "text-[#808191]"
          }`}
          onClick={() => setAtivetab("tasks")}
        >
          Tasks
        </button>
        <button
          className={`py-[15px] px-3 text-base ${
            activetab === "complete" ? "text-[#475BE8] border-b-[3px] border-[#475BE8]" : "text-[#808191]"
          }`}
          onClick={() => setAtivetab("complete")}
        >
          Complete Tasks
        </button>
        <button
          className={`py-[15px] px-3 text-base ${
            activetab === "uncomplete" ? "text-[#475BE8] border-b-[3px] border-[#475BE8]" : "text-[#808191]"
          }`}
          onClick={() => setAtivetab("uncomplete")}
        >
          Uncomplete Tasks
        </button>
      </div>

      <div className="w-full bg-[#FCFCFC] rounded-[15px] p-5">
        {activetab === "tasks" && <Task refresh={refresh} />}
        {activetab === "complete" && <CompleteTasks refresh={refresh} />}
        {activetab === "uncomplete" && <UnCompleteTasks refresh={refresh} />}
      </div>
    </div>
  );
};

export default Tasks;