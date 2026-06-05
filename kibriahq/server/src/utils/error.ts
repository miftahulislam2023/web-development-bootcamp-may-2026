interface ErrorWithStatus extends Error {
    status: number
}

function error(msg = "Something went wrong", status = 500) {
    const e = new Error(msg) as ErrorWithStatus;
    e.status = status;
    return e;
}

export default error