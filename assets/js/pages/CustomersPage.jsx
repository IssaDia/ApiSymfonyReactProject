import React, { useEffect, useState } from "react";
import CustomersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = props => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Permet de récupérer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      console.log(data);
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients");
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Gestion de la suppression d'un customer
  const handleDelete = async id => {
    const originalCustomers = [...customers];

    setCustomers(customers.filter(customer => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
      toast.success("Le client a bien été supprimé");
    } catch (error) {
      setCustomers(originalCustomers);
      toast.error("La suppression du client n'a pas pu fonctionner");
    }
  };

  //Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  //Gestion de la recherche
  const handleSearch = currentTarget => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Filtrage des customers en fonction de la recherche

  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  //Pagination des données(toDo: la rendre accessible depuis le composant Pagination)
  const itemsPerPage = 8;
  const pagesCount = Math.ceil(filteredCustomers.length / itemsPerPage);
  const pages = [];

  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }
  const start = currentPage * itemsPerPage - itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    start,
    start + itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher"
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-light">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()}$
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 3}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader></TableLoader>}

      {itemsPerPage < filteredCustomers.length && (
        <div>
          <ul className="pagination pagination-sm">
            <li className={"page-item" + (currentPage === 1 && "disabled")}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo;
              </button>
            </li>
            {pages.map(page => (
              <li
                key={page}
                className={"page-item" + (currentPage === page && "active")}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={
                "page-item" + (currentPage === pagesCount && "disabled")
              }
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default CustomersPage;
