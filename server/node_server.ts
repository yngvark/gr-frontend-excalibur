import { config } from 'dotenv'
config()

import {getApp} from "./app"
import express from "express"
import http from "http"
import https from "https"

run()

function run() {
    let port:string
    let backendUrl:string

    try {
        port = getEnv("PORT")
        backendUrl = getEnv("GAME_BACKEND_URL")
    } catch (e:any) {
        console.log("Error: " + e.message)
        return
    }

    let app:express.Application = getApp(backendUrl)
    let server : http.Server | https.Server = http.createServer(app)

    server.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    })
}

function getEnv(name:string) {
    let e = process.env[name]
    if (!e) throw new Error(`Missing environment variable: ${name}`)

    return e
}
