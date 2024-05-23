export const useDelay = (seconds: number, shouldReject: boolean = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(shouldReject) reject(Error("Failed to fetch (delay.ts)"));
            resolve("Fetch OK (delay.ts)")
        }, seconds * 1000)
    })
}