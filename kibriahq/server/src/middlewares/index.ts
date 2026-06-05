import cors from "cors";
import { json, urlencoded, type RequestHandler } from "express";
import morgan from "morgan";

const middlewares: RequestHandler[] = [
    cors(),
    json(),
    urlencoded({extended: true}),
    morgan('dev'),
]

export default middlewares;