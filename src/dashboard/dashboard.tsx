import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface DashboardData {
  totalProdutos: number;
  estoqueTotal: number;
  valorEstoque: number;
  estoqueBaixo: number;
  categorias: number;
}

const Dashboard = () => {

  const navigate = useNavigate();

  const token = Cookies.get("token");

  const [dados, setDados] = useState<DashboardData | null>(null);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {

    Cookies.remove("token");

    navigate("/login");

  };

  /* =========================
     BUSCAR DASHBOARD
  ========================= */
  const buscarDashboard = async () => {

    try {

      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {

        setDados(data);

      } else {

        console.log(data.message);

      }

    } catch (error) {

      console.log("Erro ao carregar dashboard");

    }

  };

  useEffect(() => {

    buscarDashboard();

  }, []);

  /* =========================
     LOADING
  ========================= */
  if (!dados) {

    return (
      <p style={{ padding: 40 }}>
        Carregando dashboard...
      </p>
    );

  }

  return (

    <div className="dashboard-page">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav id="home-bar">

        <div id="brand">
          SUPERMARKET
        </div>

        <div id="options">

          <button onClick={() => navigate("/home")}>
            Home
          </button>

          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/product")}>
            Produtos
          </button>

          <button onClick={handleLogout}>
            Sair
          </button>

        </div>

      </nav>

      {/* =========================
          DASHBOARD
      ========================= */}
      <div className="dashboard-content">

        <h2>
          Dashboard do Supermarket
        </h2>

        <div className="cards">

          {/* TOTAL PRODUTOS */}
          <div className="card">

            <h3>
              Total Produtos
            </h3>

            <p className="valor verde">
              {dados.totalProdutos}
            </p>

          </div>

          {/* ESTOQUE TOTAL */}
          <div className="card">

            <h3>
              Itens em Estoque
            </h3>

            <p className="valor azul">
              {dados.estoqueTotal}
            </p>

          </div>

          {/* VALOR ESTOQUE */}
          <div className="card">

            <h3>
              Valor em Estoque
            </h3>

            <p className="valor verde">
              R$ {dados.valorEstoque.toFixed(2)}
            </p>

          </div>

          {/* ESTOQUE BAIXO */}
          <div className="card">

            <h3>
              Estoque Baixo
            </h3>

            <p className="valor vermelho">
              {dados.estoqueBaixo}
            </p>

          </div>

          {/* CATEGORIAS */}
          <div className="card">

            <h3>
              Categorias
            </h3>

            <p className="valor">
              {dados.categorias}
            </p>

          </div>

        </div>

      </div>

    </div>

  );
};
export default Dashboard;