import { useCallback } from "react";
import { Link } from "react-router";
import { useActions } from "@/hooks";
import { getRandomNumber } from "@/utils";

export function Actions() {
  const { filteredData, setPositionId } = useActions();

  const handleRandomButton = useCallback(() => {
    if (filteredData.length === 0) {
      alert("No positions found with current filters!");
      return;
    }
    const nextIndex = getRandomNumber(0, filteredData.length - 1);
    setPositionId(filteredData[nextIndex].id);
  }, [filteredData]);

  return (
    <div className="w-full flex items-center justify-center gap-3 flex-wrap">
      <Link
        to="position-list/"
        className="cursor-pointer text-white text-center leading-8 px-6 py-2 border rounded-md border-slate-800/50 bg-slate-100/10 hover:bg-slate-800 duration-300 font-bold"
      >
        All Positions
      </Link>
      <button
        onClick={handleRandomButton}
        className="bg-pink-600 cursor-pointer hover:bg-pink-800 duration-300 text-white rounded-md shadow-md hover:shadow-lg leading-8 px-6 py-2 font-bold"
      >
        New Position
      </button>
    </div>
  );
}
