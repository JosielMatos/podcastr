export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / 3600) // round down how many hours
    const minutes = Math.floor((duration % 3600) / 60) // how many seconds left to convert to minutes
    const seconds = duration % 60 // how many seconds left to complete another minute

    const timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0')) // if there is 1 unit, add a 0
        .join(':')

    return timeString
}