import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import moment from "moment"
import { buildRoutePath } from "./utils/build-route-path.js"
import { title } from "node:process"

const database = new Database

let myDate = new Date()
let dateFormated = moment(myDate).format("LLL")

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (request, response) => {
            const { search } = request.query

            const tasks = database.select("tasks", search ? {
                title: search,
                description: search
            } : null)
            
            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (request, response) => {
            const { title, description } = request.body

            if (!title) {
                return response.writeHead(400).end(
                    JSON.stringify({message: "title is required."})
                )
            }

            if(!description) {
                return response.writeHead(400).end(
                    JSON.stringify({message: "description is required."})
                )
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: dateFormated,
                update_at: dateFormated,
            }

            database.insert("tasks", task)

            return response.writeHead(201).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params
            const { title, description } = request.body

            if(!title && !description) {
                return response.writeHead(400).end(
                    JSON.stringify({message: "title or description are required."})
                )
            }

            const indexOfDatabase = database.select("tasks").findIndex(row => row.id === id)
                        
            if(indexOfDatabase > -1) {
                const { completed_at, created_at } = database.select("tasks")[indexOfDatabase]
                database.update("tasks", id, {
                    title,
                    description,
                    completed_at,
                    created_at,
                    update_at: dateFormated
                    
                })
                return response.writeHead(204).end()
            }
            return response.writeHead(400).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params

            const indexOfDatabase = database.select("tasks").findIndex(row => row.id === id)

            if(indexOfDatabase > -1) {                   
                database.delete("tasks", id)

                return response.writeHead(204).end()
            }
            return response.writeHead(404).end()
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (request, response) => {
            const { id } = request.params
            const indexOfDatabase = database.select("tasks").findIndex(row => row.id === id)

            if(indexOfDatabase > -1) {
                const data = database.select("tasks")[indexOfDatabase]
                database.update("tasks", id, {...data, completed_at: dateFormated})
                return response.writeHead(204).end()
            }
            return response.writeHead(404).end()
        }
    },
]