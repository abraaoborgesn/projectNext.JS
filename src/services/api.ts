import axios from "axios";

export const api = axios.create({
    baseURL: '/api' //otimitindo a url que sempre será a mesma (localhost:3000)
})