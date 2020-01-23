import axios from "axios";
import jwtDecode from 'jwt-decode';
import { LOGIN_API } from "./config";

/**
 * Déconnexion (suppression du token du localstorage et sur Axios)
 */
function logout() {

    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
};

/**
 * Requête HTTP d'authentification et stockage du token et sur axios
 * @param {object} credentials
 */

function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // stockage du token dans localStorage
            window.localStorage.setItem("authToken", token);
            //On prévient axios qu'on a maintenant un header par défaut pour toutes les requêtes

            setAxiosToken(token)
            return true;
        })

}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token le token JWT
 */

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer" + token;
};

/**
 * Mise en place lors du chargement de l'application
 */
function setUp() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {
            exp: expiration
        } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
            console.log("Connexion!");
        }

    }

};

/**
 * Permet de savoir si on est authentifié ou non
 * @returns boolean
 */

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {
            exp: expiration
        } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true
        }
        return false
    }
    return false;
};
export default {
    authenticate,
    logout,
    setUp,
    isAuthenticated
};