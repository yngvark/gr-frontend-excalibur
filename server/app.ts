import express from 'express'
import cors from './cors'
import path from "path";

const favicon = require('serve-favicon')

export function getApp(backendUrl: string): express.Application {
    const DIST_DIR = "/app/dist"

    const app : express.Application = express()

    app.use('/', express.static(DIST_DIR))
    app.use(cors.middleware)

    app.use(favicon(path.join(DIST_DIR, 'favicon.ico')))

    app.get('/config', (req, res) => {
        let config = {
            backendUrl
        }
        res.send(config)
    })

    return app
}
