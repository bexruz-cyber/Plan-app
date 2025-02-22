"use client"

import type React from "react"

import { useState, useEffect, type MouseEvent } from "react"
import { PlusCircle, Trash2, Send, Edit3, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

const App = () => {
  const [formData, setFormData] = useState({
    "Ism familya": "",
    Reja: "",
    Sana: "",
    Soat: "",
  })
  const [dataList, setDataList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    "Ism familya": "",
    Reja: "",
    Sana: "",
  })
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {
      "Ism familya": formData["Ism familya"] ? "" : "Ism familya majburiy",
      Reja: formData["Reja"] ? "" : "Reja majburiy",
      Sana: formData["Sana"] ? "" : "Sana majburiy",
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleAdd = () => {
    if (!validateForm()) return
    if (isEditing !== null) {
      const updatedList = [...dataList]
      updatedList[isEditing] = formData
      setDataList(updatedList)
      setIsEditing(null)
      toast.success("Ma'lumot muvaffaqiyatli yangilandi!")
    } else {
      setDataList((prev) => [...prev, formData])
      toast.success("Yangi ma'lumot qo'shildi!")
    }
    setFormData({ "Ism familya": "", Reja: "", Sana: "", Soat: "" })
    setIsModalOpen(false)
  }

  const handleEdit = (index: number) => {
    setIsEditing(index)
    setFormData(dataList[index])
    setIsModalOpen(true)
  }

  const handleDelete = (index: number) => {
    setDataList((prev) => prev.filter((_, i) => i !== index))
    toast.success("Ma'lumot o'chirildi!")
  }

  const handleSubmit = async () => {
    setLoading(true)
    const now = new Date()
    const currentTime = now.toLocaleTimeString()

    try {
      for (const data of dataList) {
        await fetch(
          "https://script.google.com/macros/s/AKfycbxxYiJ6oUKTCzPz7RwDRMi6CqQjAX_yVdVhtuP2kjmG1ZS0TSiNI4ZMKpU3-qQXmT_b/exec",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              ...data,
              Soat: currentTime,
            }).toString(),
          },
        )
      }
      toast.success("Barcha ma'lumotlar muvaffaqiyatli yuborildi!")
      setDataList([])
    } catch (error) {
      toast.error("Tarmoqqa ulanishda xatolik.")
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditing(null)
    setFormData({ "Ism familya": "", Reja: "", Sana: "", Soat: "" })
    setErrors({ "Ism familya": "", Reja: "", Sana: "" })
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4 space-y-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 text-center max-md:text-2xl">Ma'lumotlar Boshqaruvi</h1>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 max-md:text-sm rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center"
        >
          <PlusCircle className="mr-2" />
          Ma'lumot qo'shish
        </button>

        {dataList.length > 0 && (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center "
            disabled={loading}
          >
            <Send className="mr-2" /> {loading ? "Yuklanmoqda..." : "Barchasini yuborish"}
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 px-5 overflow-auto bg-black/30 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-6 max-md:mb-4 text-blue-800 max-md:text-xl">
              {isEditing !== null ? "Ma'lumotni tahrirlash" : "Yangi ma'lumot qo'shish"}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="Ism familya"
                value={formData["Ism familya"]}
                onChange={handleChange}
                placeholder="Ism Familya"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors["Ism familya"] && <p className="text-red-500 text-sm">{errors["Ism familya"]}</p>}

              <textarea
                name="Reja"
                value={formData["Reja"]}
                onChange={handleChange}
                placeholder="Reja"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
              />
              {errors["Reja"] && <p className="text-red-500 text-sm">{errors["Reja"]}</p>}

              <input
                type="date"
                name="Sana"
                value={formData["Sana"]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors["Sana"] && <p className="text-red-500 text-sm">{errors["Sana"]}</p>}

              <button
                type="button"
                onClick={handleAdd}
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
              >
                <PlusCircle className="mr-2" /> {isEditing !== null ? "Yangilash" : "Qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {dataList.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{item["Ism familya"]}</h3>
              <p className="text-gray-600 mb-2">
                <strong>Reja:</strong> {item["Reja"]}
              </p>
              <p className="text-gray-600">
                <strong>Sana:</strong> {item["Sana"]}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App

