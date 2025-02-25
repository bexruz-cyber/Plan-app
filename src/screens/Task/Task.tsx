import { useEffect, useState } from "react";
import axios from "axios";
import plan from "../../images/plan.svg";
import timeIcon from "../../images/time.svg";
import timeSucces from "../../images/timwSucces.svg";
import toast from "react-hot-toast";

interface Task {
  project: string;
  employee: string;
  task: string;
  date: string;
  time: string;
  timeTake: string;
  timeTakeGues: string;
  complete: string;
  rowIndex: number;
}

interface Props {
  refresh: boolean;
}

const Task = ({ refresh }: Props) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [data, setData] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loader, setLoader] = useState(true);
  const [isTodayFilter, setIsTodayFilter] = useState(false);

  const SHEET_ID = "1xKUnBw9UVUTrRVb7nPShOq4mF-lIVCWyWExEN9Z-mRg";
  const SHEET_TITLE = "Rejalar";
  const SHEET_RANGE = "B1:I1000";

  const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

  const fetchData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(FULL_URL);
      const rawData = JSON.parse(response.data.substring(47).slice(0, -2));

      const projectNames = new Set<string>(["All"]);
      const employeeNames = new Set<string>(["All"]);
      const fetchedData: Task[] = [];

      rawData.table.rows.forEach((row: { c: (null | { v?: string; f?: string })[] }, index: number) => {
        const project = row.c[0]?.v || "Unknown Project";
        const employee = row.c[1]?.v || "Unknown Employee";
        const task = row.c[2]?.v || "Unknown Task";
        const date = row.c[3]?.f || "Unknown Date";
        const time = row.c[4]?.f || "Unknown";
        const timeTake = row.c[5]?.v || "Unknown TakeTime";
        const timeTakeGues = row.c[6]?.v || "Uncomplete";
        const complete = row.c[7]?.f || "FALSE";

        projectNames.add(project);
        employeeNames.add(employee);
        fetchedData.push({
          project,
          employee,
          task,
          date,
          time,
          timeTake,
          timeTakeGues,
          complete,
          rowIndex: index + 2,
        });
      });

      fetchedData.reverse();

      setProjects(Array.from(projectNames));
      setEmployees(Array.from(employeeNames));
      setData(fetchedData);
    } catch (error) {
      console.error("Data fetching error:", error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Removed FULL_URL as it's a constant and won't change

  useEffect(() => {
    fetchData();
  }, [refresh]); // Added fetchData to dependencies

  // Bugungi kunni olish (format: "DD/MM/YYYY")
  const today = new Date().toLocaleDateString("en-US"); // "25/02/2025" kabi

  console.log(today);

  const filteredData = data.filter((item) => {
    const matchesProject = selectedProject === "All" || item.project === selectedProject;
    const matchesEmployee = selectedEmployee === "All" || item.employee === selectedEmployee;
    const matchesSearch =
      item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesToday = isTodayFilter ? item.date === today : true;

    return matchesProject && matchesEmployee && matchesSearch && matchesToday;
  });

  return (
    <div className="flex flex-col gap-[25px]">
      <div className="flex items-center flex-wrap gap-5">
        {/* Today Button */}


        {/* Search */}
        <div className="flex items-center gap-[5px] bg-[#F3F3F3] p-2.5 max-w-[229px] rounded-lg">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.4697 15.5303C14.7626 15.8232 15.2374 15.8232 15.5303 15.5303C15.8232 15.2374 15.8232 14.7626 15.5303 14.4697L14.4697 15.5303ZM12.75 7.875C12.75 10.5674 10.5674 12.75 7.875 12.75V14.25C11.3958 14.25 14.25 11.3958 14.25 7.875H12.75ZM7.875 12.75C5.18261 12.75 3 10.5674 3 7.875H1.5C1.5 11.3958 4.35418 14.25 7.875 14.25V12.75ZM3 7.875C3 5.18261 5.18261 3 7.875 3V1.5C4.35418 1.5 1.5 4.35418 1.5 7.875H3ZM7.875 3C10.5674 3 12.75 5.18261 12.75 7.875H14.25C14.25 4.35418 11.3958 1.5 7.875 1.5V3ZM15.5303 14.4697L12.3896 11.329L11.329 12.3896L14.4697 15.5303L15.5303 14.4697Z"
              fill="#808191"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="font-medium text-[#11142D] text-xs w-full outline-none"
          />
        </div>

        {/* Project Dropdown */}
        <div className="relative max-w-[160px] w-full">
          <div
            className="flex items-center bg-[#F3F3F3] rounded-lg p-2.5 cursor-pointer justify-between"
            onClick={() => setIsStatusOpen((prev) => !prev)}
          >
            <h3 className="font-medium text-[#11142D] text-xs">{selectedProject}</h3>
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.175736 0.681116C0.41005 0.439628 0.789949 0.439628 1.02426 0.681116L4.5 4.26326L7.97574 0.681115C8.21005 0.439627 8.58995 0.439626 8.82426 0.681115C9.05858 0.922603 9.05858 1.31413 8.82426 1.55562L5.34853 5.13777C4.8799 5.62074 4.1201 5.62074 3.65147 5.13777L0.175736 1.55562C-0.0585785 1.31413 -0.0585786 0.922604 0.175736 0.681116Z"
                fill="#808191"
              />
            </svg>
          </div>
          {isStatusOpen && (
            <div className="box-shadow-drop rounded-lg bg-[#FCFCFC] absolute top-[38px] left-0 w-full z-10">
              {projects.map((project) => (
                <p
                  key={project}
                  className={`py-2 px-2.5 ${selectedProject === project
                      ? "bg-[#475BE8] text-[#FCFCFC]"
                      : "bg-[#FCFCFC] text-[#808191]"
                    } font-medium rounded-lg leading-[18px] text-xs`}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsStatusOpen(false);
                  }}
                >
                  {project}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Employee Dropdown */}
        <div className="relative max-w-[160px] w-full">
          <div
            className="flex items-center bg-[#F3F3F3] rounded-lg p-2.5 cursor-pointer justify-between"
            onClick={() => setIsTypeOpen((prev) => !prev)}
          >
            <h3 className="font-medium text-[#11142D] text-xs">{selectedEmployee}</h3>
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.175736 0.681116C0.41005 0.439628 0.789949 0.439628 1.02426 0.681116L4.5 4.26326L7.97574 0.681115C8.21005 0.439627 8.58995 0.439626 8.82426 0.681115C9.05858 0.922603 9.05858 1.31413 8.82426 1.55562L5.34853 5.13777C4.8799 5.62074 4.1201 5.62074 3.65147 5.13777L0.175736 1.55562C-0.0585785 1.31413 -0.0585786 0.922604 0.175736 0.681116Z"
                fill="#808191"
              />
            </svg>
          </div>
          {isTypeOpen && (
            <div className="box-shadow-drop rounded-lg bg-[#FCFCFC] absolute top-[38px] left-0 w-full z-10">
              {employees.map((employee) => (
                <p
                  key={employee}
                  className={`py-2 px-2.5 ${selectedEmployee === employee
                      ? "bg-[#475BE8] text-[#FCFCFC]"
                      : "bg-[#FCFCFC] text-[#808191]"
                    } font-medium rounded-lg leading-[18px] text-xs`}
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setIsTypeOpen(false);
                  }}
                >
                  {employee}
                </p>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsTodayFilter((prev) => !prev)}
          className={`py-2 px-4 rounded-lg font-medium text-sm ${isTodayFilter ? "bg-[#475BE8] text-[#FCFCFC]" : "bg-[#F3F3F3] text-[#11142D]"
            }`}
        >
          Today
        </button>
      </div>

      {loader ? (
        <div className="flex items-center justify-center pt-10 bg-gray">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item, index) => (
            <div key={index} className="p-4 bg-[#FCFCFC] rounded-lg shadow-sm flex flex-col">
              <h4 className="text-base font-semibold text-[#11142D] mb-1.5">{item.project}</h4>
              <p className="text-sm font-normal flex items-center gap-[5px] text-[#808191] mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                {item.employee}
              </p>
              <p className="text-xs text-[#808191] mb-3 flex items-center gap-[5px]">
                <img src={plan} alt="plan" />
                {item.task}
              </p>
              <div className="flex items-center gap-[5px]">
                <p className="text-xs text-[#808191] mb-3 flex items-center gap-[5px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                  {item.date} -
                  <img src={timeIcon} className="w-[18px] h-[18px]" alt="" />
                  {item.time}
                </p>
              </div>
              <div className="flex items-center gap-[5px]">
                {item.timeTake && (
                  <p className="text-xs text-[#808191] mb-3 flex items-center gap-[5px]">
                    <img src={timeIcon} className="w-[18px] h-[18px]" alt="" />
                    {item.timeTake}
                  </p>
                )}
                {item.timeTakeGues && (
                  <p className="text-xs text-[#808191] mb-3 flex items-center gap-[5px]">
                    <img src={timeSucces} className="w-[18px] h-[18px]" alt="" />
                    {item.timeTakeGues}
                  </p>
                )}
              </div>
              <button className="btnCopmleteTogle py-1 px-3 rounded-md text-[#FCFCFC] text-sm text-normal bg-[#475BE8] ml-auto">
                {item.complete === "TRUE" ? "Done" : "Not Done"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;