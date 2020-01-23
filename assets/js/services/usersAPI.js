import axios from "axios";
import { USERS_API } from "./config";



function register() {
    return axios.post(
        USERS_API,
        user
    );
}

export default {
    register
};