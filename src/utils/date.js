import dayjs from "dayjs";

export function formatDate(value) {
  if (!value) return "—";
  try {
    return dayjs(value).format("DD/MM/YYYY");
  } catch (e) {
    return value;
  }
}
