import { useEffect, useState } from "react";

interface ProgressBarProps {
  title: string;
  percentage: number;
  index: number;
}

// Ranglarni dinamik yaratish funksiyasi
const generateColor = (index: number) => {
  // HSL ranglar palitrasi (0-360 orasidagi hue qiymati)
  const hue = (index * 137) % 360; 
  return `hsl(${hue}, 70%, 60%)`;
};

const ProgressBar = ({ title, percentage, index }: ProgressBarProps) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setCurrentPercentage(progress);

      if (progress >= percentage) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div className="w-full transition-all duration-300">
      <div className="flex items-center justify-between mb-2.5 text-gray-700">
        <span className="font-medium text-base text-gray-700">{title}</span>
        <span className="font-medium text-base text-gray-900">
          {currentPercentage}H
        </span>
      </div>
      <div
        className={`relative transition-all ease-linear duration-500 ${
          animation ? "w-full" : "w-0"
        } h-2 rounded bg-gray-200 mb-[15px]`}
      >
        <div
          style={{
            width: `${currentPercentage}%`,
            backgroundColor: generateColor(index), // Har doim yangi rang
          }}
          className="absolute h-full rounded transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
