import http, { request } from "node:http"
import { routes } from "./routes.js"
import { json } from "./middleware/json.js"

const server = http.createServer(async (request, response) => {
    const { method, url } = request
    
    await json(request, response)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if(route) {
        const routeParams = request.url.match(route.path)

        const { ...params } = routeParams.groups

        request.params = params

        return route.handler(request, response)
    }

    return response.writeHead(404).end()
})

server.listen({
    port: 4444
})