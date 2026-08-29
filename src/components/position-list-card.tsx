import { useState, useEffect } from "react";
import { Level } from "@/components/level";
import { LikeButton } from "@/components/like-button";
import { updateCustomTags } from "@/utils";
import type { DataItem } from "../../data";

export function PositionListCard({
  position,
  order,
}: {
  position: DataItem;
  order: number;
}) {
  const { id, title, imageAlt, level, fileName } = position;

  const [tags, setTags] = useState({
    anal: position.anal || false,
    vaginal: position.vaginal || false,
    oral: position.oral || false,
    already_done: position.already_done || false,
  });

  useEffect(() => {
    setTags({
      anal: position.anal || false,
      vaginal: position.vaginal || false,
      oral: position.oral || false,
      already_done: position.already_done || false,
    });
  }, [position]);

  const handleTagChange = (tag: string, value: boolean) => {
    setTags(prev => ({ ...prev, [tag]: value }));
    updateCustomTags(id, { [tag]: value });
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <li
      key={`position-${id}`}
      className="bg-white rounded-md p-4 flex flex-col gap-4 relative"
    >
      <div className="flex items-center justify-between gap-2">
        <LikeButton id={id} />
        <Level level={level} isAbsolute={false} />
      </div>
      
      {/* BUG FIX: Original code was fetching images from raminr77 website breaking the 100% offline requirement */}
      <img
        alt={imageAlt}
        loading="lazy"
        className="rounded-md w-full"
        src={`${import.meta.env.BASE_URL}images/positions/${fileName}`}
      />
      <h3 className="flex items-center gap-2 text-slate-950">
        <span>{order}</span>
        <span>{"-"}</span>
        <span>{title}</span>
      </h3>
      
      <div className="flex flex-wrap gap-3 text-xs justify-center w-full bg-slate-100 p-2 rounded border border-slate-200 text-slate-800">
        {["anal", "vaginal", "oral", "already_done"].map(tag => (
          <label key={tag} className="flex items-center gap-1 cursor-pointer">
            <input 
              type="checkbox" 
              checked={tags[tag as keyof typeof tags]} 
              onChange={(e) => handleTagChange(tag, e.target.checked)}
            />
            {tag.replace("_", " ").toUpperCase()}
          </label>
        ))}
      </div>
    </li>
  );
}
