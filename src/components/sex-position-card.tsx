import { useActions } from "@/hooks";
import { LikeButton } from "./like-button";
import { Level } from "./level";
import { updateCustomTags } from "@/utils";

const DEFAULT_POSITION = {
  id: 0,
  title: "",
  level: "",
  fileName: "0-preview.png",
  imageAlt: "Random Sex Position",
  anal: false,
  vaginal: false,
  oral: false,
  already_done: false,
};

export function SexPositionCard() {
  const { activePosition, positionId } = useActions();
  const position = positionId === 0 || !activePosition ? DEFAULT_POSITION : activePosition;
  const { id, level, title, imageAlt, fileName } = position;
  
  // #17: derive tags directly from props, no shadow state
  const tags = {
    anal: position.anal ?? false,
    vaginal: position.vaginal ?? false,
    oral: position.oral ?? false,
    already_done: position.already_done ?? false,
  };

  const handleTagChange = (tag: string, value: boolean) => {
    updateCustomTags(id, { [tag]: value });
  };

  return (
    <div
      title={title}
      className="w-full relative bg-white overflow-hidden border-dashed border dark:border-none rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-slate-500 animate__animated animate__fadeIn shadow-sm"
    >
      {level && <Level level={level} />}

      {!!id && (
        <div className="left-5 top-5 absolute">
          <LikeButton id={id} />
        </div>
      )}

      <img loading="lazy" alt={imageAlt} src={`${import.meta.env.BASE_URL}images/positions/${fileName}`} />

      <h3 className="mt-4">
        {id ? `Position No: ${id}` : "More Than 500 Sex Positions"}
      </h3>
      <p>
        {title
          ? `Position Name: ${title}`
          : "Get Your Random Position And Try It Tonight!"}
      </p>

      {!!id && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs justify-center w-full bg-slate-100 p-2 rounded">
          {["anal", "vaginal", "oral", "already_done"].map(tag => (
            <label key={tag} className="flex items-center gap-1 cursor-pointer text-slate-800">
              <input 
                type="checkbox" 
                checked={tags[tag as keyof typeof tags]} 
                onChange={(e) => handleTagChange(tag, e.target.checked)}
              />
              {tag.replace("_", " ").toUpperCase()}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
