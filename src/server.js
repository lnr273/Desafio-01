import http, { request } from "node:http"
import { routes } from "./routes.js"

const server = http.createServer(async (request, response) => {
    const { method, url } = request
    
    response.setHeader('Content-type', 'application/json')

    const route = routes.find(route => {
        route.method === method && route.path === url
    })
})

server.listen({
    port: 3333
})