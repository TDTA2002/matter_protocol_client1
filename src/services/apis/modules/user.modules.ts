import axios from "axios";

export default {
    register: async function (newUser: any) {
        return await axios.post(import.meta.env.VITE_SV_HOST + "users", newUser)
    },
    login: async function (data: any) {
        return await axios.post(import.meta.env.VITE_SV_HOST + "users/login", data)
    },
    resetPassword: async function (data: any) {
        return await axios.post(import.meta.env.VITE_SV_HOST + "users/reset-password", data)
    }
}