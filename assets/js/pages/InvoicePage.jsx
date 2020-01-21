import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  //Récupération des clients

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      toast.error("Impossible de charger les clients");
      history.replace("/invoices");
    }
  };

  //Récupération d'une facture

  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await invoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
      console.log(data);
    } catch (error) {
      toast.error("Impossible de charger la facture demandée");
      history.replace("/invoices");
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Récupération de la bonne facture quand l'id de l'Url change

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  //Gestion des changements des input dans le formulaire

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  //Gestion de la soumission du formulaire

  const handleSubmit = async event => {
    event.preventDefault;
    try {
      if (editing) {
        await InvoicesAPI.update(id, invoice);
        toast.success("La facture a bien été modifiée");
      } else {
        await InvoicesAPI.create(invoice);
        toast.success("La facture a bien été enregistrée");
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Des erreurs dans votre formulaire");

      }
    }
  };

  return (
    <>
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        ></Field>
        <Select
          name="customer"
          label="client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}

          <option value="2">Oumou</option>
        </Select>
        <Select
          name="status"
          label="status"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">envoyée</option>
          <option value="CANCELLED">annulée</option>
          <option value="PAID">payée</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
        </div>
        <Link to="/invoices">retour aux factures</Link>
      </form>
    </>
  );
};

export default InvoicePage;
