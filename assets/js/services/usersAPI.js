import axios from "axios";



function register() {
    return axios.post(
        "http://127.0.0.1:8000/api/users",
        user
    );
}

export default {
    register
};