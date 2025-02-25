import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "../components/ProgresBar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Chart.js komponentlarini ro'yxatdan o'tkazish
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface GoogleSheetRow {
  c: Array<{ v?: string; f?: string } | null>;
}

// ✅ Ma'lumotlar uchun TypeScript interfeyslari
interface ProjectData {
  project: string;
  timeTakeGues: number;
  rowIndex: number;
}

interface TaskData {
  complete: string;
  rowIndex: number;
}

const Dashboard = () => {
  const [data, setData] = useState<ProjectData[]>([]);
  const [dataTask, setDataTask] = useState<TaskData[]>([]);
  const [loader, setLoader] = useState<boolean>(true);

  // ✅ Google Sheet sozlamalari
  const SHEET_ID = "1xKUnBw9UVUTrRVb7nPShOq4mF-lIVCWyWExEN9Z-mRg";
  const SHEET_TITLE = "Ketgan vaqt ummumiy";
  const SHEET_TITLE_TASK = "Rejalar";
  const SHEET_RANGE = "B1:I1000";

  const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;
  const FULL_URL_TASK = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE_TASK}&range=${SHEET_RANGE}`;

  // ✅ Loyihalar ma'lumotlarini olish
  const fetchData = async (): Promise<void> => {
    setLoader(true);
    try {
      const response = await axios.get(FULL_URL);
      const rawData = JSON.parse(response.data.substring(47).slice(0, -2));

      const fetchedData: ProjectData[] = (rawData.table.rows as GoogleSheetRow[]).map(
        (row, index) => ({
          project: row.c[0]?.v || "Unknown Project",
          timeTakeGues: parseInt(row.c[1]?.v || "0", 10),
          rowIndex: index + 2,
        })
      );


      setData(fetchedData.reverse());
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Data fetching error:", error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        toast.error("An unknown error occurred.");
      }
    } finally {
      setLoader(false);
    }
  };

  // ✅ Vazifalar ma'lumotlarini olish
  const fetchDataTask = async (): Promise<void> => {
    setLoader(true);
    try {
      const response = await axios.get(FULL_URL_TASK);
      const rawData = JSON.parse(response.data.substring(47).slice(0, -2));

      const fetchedData: TaskData[] = rawData.table.rows.map(
        (row: GoogleSheetRow, index: number) => ({
          complete: row.c[7]?.f || "FALSE",
          rowIndex: index + 2,
        })
      );

      setDataTask(fetchedData.reverse());
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Data fetching error:", error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        toast.error("An unknown error occurred.");
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchDataTask();
    fetchData();
  }, []);

  const trueCount = dataTask.filter((item) => item.complete === "TRUE").length;
  const falseCount = dataTask.filter((item) => item.complete === "FALSE").length;

  const chartData = {
    labels: ["Completed", "Not Completed"],
    datasets: [
      {
        label: "Tasks Status",
        data: [trueCount, falseCount],
        backgroundColor: ["#2ED480", "#FE6D8E"],
        borderColor: ["#2ED480", "#FE6D8E"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Aspekt nisbati saqlanmasin
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Tasks Completion Status" },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuad" as const,
    },
  };

  return (
    <div className="py-[25px] pl-[25px]">
      <h1 className="capitalize font-bold text-[25px] text-[#11142D] mb-5 leading-[34px]">
        Dashboard
      </h1>

      {loader ? (
        <div className="flex w-full items-center justify-center pt-10 bg-gray">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
          <div className="h-full" style={{ minHeight: "280px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div>
            {data.map((item, index) => (
              <ProgressBar
                key={item.rowIndex}
                title={item.project}
                percentage={item.timeTakeGues}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
