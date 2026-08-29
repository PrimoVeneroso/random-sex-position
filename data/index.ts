import APP_DATA from "./data.json";

export interface DataItem {
  id: number;
  title: string;
  level: string;
  fileName: string;
  imageAlt: string;
  anal: boolean;
  vaginal: boolean;
  oral: boolean;
  already_done: boolean;
}

export const { data } = APP_DATA;
