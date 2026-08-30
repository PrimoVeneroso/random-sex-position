import { clsx } from "clsx";
import { Activity, useState, useMemo } from "react";
import { useActions, useAppContext } from "@/hooks";
import { toggleFavoritesSection, getFavoritesSectionState } from "@/utils";

import { data, type DataItem } from "../../data";

export function FavoriteList() {
  const [hideFavoritesSection, setHideFavoritesSection] = useState<boolean>(
    () => getFavoritesSectionState()
  );

  const { favoritePositions, setFavoritePositions } = useAppContext();
  const { setPositionId, positionId } = useActions();

  // #12: build lookup map once, filter orphans
  const byId = useMemo(() => new Map(data.map(d => [d.id, d])), []);
  const validFavorites = useMemo(
    () => favoritePositions.filter(id => byId.has(id)),
    [favoritePositions, byId]
  );

  const handleUnlikePosition = (id: number) => {
    setFavoritePositions([...favoritePositions.filter((item) => item !== id)]);
  };

  const handleToggleFavoritesSection = () => {
    const currentState = hideFavoritesSection;
    setHideFavoritesSection(!currentState);
    toggleFavoritesSection(!currentState);
  };

  return (
    <Activity mode={validFavorites.length === 0 ? "hidden" : "visible"}>
      <div className="animate__animated animate__fadeInUp border-b w-full py-2 border-slate-500/50 flex items-center justify-between">
        <h3>Favorites [ {validFavorites.length} ]:</h3>
        <button
          onClick={handleToggleFavoritesSection}
          className="cursor-pointer border flex items-center justify-center rounded px-2 py-1 border-slate-500 text-xs"
        >
          {hideFavoritesSection ? "Show" : "Hide"}
        </button>
      </div>

      <div
        className={clsx(
          "animate__animated animate__fadeIn animate__delay-1s flex items-center gap-2 flex-wrap w-full",
          {
            "overflow-y-hidden h-0": hideFavoritesSection,
          }
        )}
      >
        {validFavorites.map((itemId) => {
          const position = byId.get(itemId) as DataItem;

          return (
            <div
              key={`fav-list-${itemId}`}
              className={clsx(
                "relative transform duration-300 animate__animated animate__bounceIn group",
                { "scale-95 opacity-40": positionId !== itemId }
              )}
            >
              <button
                title={`Delete ${position.title}`}
                onClick={() => handleUnlikePosition(itemId)}
                className="w-full cursor-pointer bg-red-500 rounded-b-md p-2 hidden items-center justify-center group-hover:flex absolute duration-300 -bottom-1 z-10"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>

              <button
                title={position.title}
                onClick={() => setPositionId(position.id)}
                className="cursor-pointer"
              >
                <img
                  width={72}
                  height={72}
                  loading="lazy"
                  alt={position.imageAlt}
                  className="w-18 h-18 rounded-md transform duration-300 group-hover:-translate-y-4"
                  src={`${import.meta.env.BASE_URL}images/positions/${
                    position.fileName ?? "0-preview.png"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </Activity>
  );
}
