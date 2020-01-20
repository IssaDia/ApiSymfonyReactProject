import React, { useEffect, useState } from "react";
import moment from "moment";
import InvoicesAPI from "../services/invoicesAPI";
import invoicesAPI from "../services/invoicesAPI";
import { Link } from "react-router-dom";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "info",
  CANCELLED: "danger"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async id => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoice=>invoice.id !== id));

    try {
      await InvoicesAPI.delete(id)
    } catch (error) {
      console.log(error.response);
      setInvoices(originalInvoices);
    }
  };

  //TO DO: gestion de la pagination et de la recherche de factures

  const formatDate = str => moment(str).format("DD/MM/YYYY");

  return (
    <>
    <div className="d-flex justify-content-between align-items-center">
    <h1>Liste des factures</h1>
    <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
    </div>
      
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="text-center">{invoice.amount.toLocaleString()}</td>
              <td>
                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(invoice.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default InvoicesPage;
