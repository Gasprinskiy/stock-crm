import moment from "moment"

export const timezone_date_string = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })
export const date_time_format = "YYYY-MM-DD HH:mm:ss"

export const getDurationInMilliseconds = (start: [number, number]) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}