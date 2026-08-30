import { useCallback, useState } from "react";
import { Link } from "react-router";
import { useActions } from "@/hooks";
import { getRandomNumber } from "@/utils";

export function Actions() {
  const { filteredData, positionId, setPositionId } = useActions();
  const [emptyMsg, setEmptyMsg] = useState("");

  // #18: exclude current position, no alert()
  const handleRandomButton = useCallback(() => {
    const pool = filteredData.filter(p => p.id !== positionId);
    const source = pool.length > 0 ? pool : filteredData;
    if (source.length === 0) {
      setEmptyMsg("No positions found with current filters!");
      return;
    }
    setEmptyMsg("");
    setPositionId(source[getRandomNumber(0, source.length - 1)].id);
  }, [filteredData, positionId]);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/position-list"
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
      {emptyMsg && (
        <p className="text-sm text-pink-400 animate-pulse">{emptyMsg}</p>
      )}
    </div>
  );
}
