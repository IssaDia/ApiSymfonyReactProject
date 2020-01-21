import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import UsersAPI from "../services/usersAPI";
import { toast } from "react-toastify";


const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  //Gestion des changements des input dans le formulaire

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault;
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "Votre confirmation n'est pas conforme";
      setErrors(apiErrors);
      toast.error("Des erreurs dans votre formulaire");

      return;
    }

    try {
      await UsersAPI.register();
      setErrors({});
      toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter");
      history.replaceState("/login");
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      toast.error("Des erreurs dans votre formulaire");
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onClick={handleSubmit}>
        <Field
          name="firstName"
          placeholder="Votre joli prénom"
          label="Prénom"
          onChange={handleChange}
          value={user.firstName}
          error={errors.firstName}
        ></Field>
        <Field
          name="lastName"
          placeholder="Votre nom de famille"
          label="Nom de famille"
          onChange={handleChange}
          value={user.lastName}
          error={errors.lasttName}
        ></Field>
        <Field
          label="Adresse email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Votre Adresse email"
          type="email"
          error={errors.email}
        ></Field>
        <Field
          label="Mot de passe"
          name="password"
          value={user.password}
          placeholder="Votre mot de passe"
          onChange={handleChange}
          type="password"
          error={errors.password}
        ></Field>
        <Field
          label="confirmation de Mot de passe"
          name="passwordConfirm"
          placeholder="Confirmez votre mot de passe"
          value={user.passwordConfirm}
          onChange={handleChange}
          type="password"
          error={errors.passwordConfirm}
        ></Field>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-primary">
            J'ai déja un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
