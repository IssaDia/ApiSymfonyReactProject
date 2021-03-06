/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

 import React, {useState} from 'react';
 import ReactDOM from 'react-dom';
 import { HashRouter, Switch, Route, withRouter} from 'react-router-dom';

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import InvoicePage from './pages/InvoicePage';
import InvoicesPage from './pages/InvoicesPage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

AuthAPI.setUp();


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    return (
    <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }
}>
    <HashRouter>
    <NavbarWithRouter />
    <main className="container pt-5">
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/>
            <PrivateRoute path="/invoices/:id" component={InvoicePage} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers/:id" component={CustomerPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage}/>   
        </Switch>
    </main>
    </HashRouter>
    <ToastContainer position={toast.POSITION.BOTTOM}></ToastContainer>
    </AuthContext.Provider> );
    
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);