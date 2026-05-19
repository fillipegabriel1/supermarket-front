import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/navbar";

const API_URL = import.meta.env.VITE_API_URL;

// 🚨 TESTE IMPORTANTE
console.log("🔥 API_URL:", API_URL);

export default function Product() {

  const token = Cookies.get("token");

  const [produtos, setProdutos] = useState<any[]>([]);

  const [novo, setNovo] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    categoria: "ALIMENTO"
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     BUSCAR PRODUTOS
  ========================= */
  const buscar = async () => {

    try {

      console.log("🔥 BUSCANDO PRODUTOS EM:");
      console.log(`${API_URL}/api/product`);

      const res = await fetch(
        `${API_URL}/api/product`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      console.log("🔥 RESPOSTA API:");
      console.log(data);

      setProdutos(data);

    } catch (error) {

      console.log(error);

      alert("Erro ao buscar produtos");

    }
  };

  useEffect(() => {

    buscar();

  }, []);

  /* =========================
     CRIAR PRODUTO
  ========================= */
  const criarProduto = async () => {

    if (
      !novo.nome ||
      !novo.preco ||
      !novo.quantidade
    ) {

      alert("Preencha todos os campos");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/api/product`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            nome: novo.nome,
            preco: Number(novo.preco),
            quantidade: Number(novo.quantidade),
            categoria: novo.categoria
          })
        }
      );

      if (!response.ok) {

        throw new Error();

      }

      setNovo({
        nome: "",
        preco: "",
        quantidade: "",
        categoria: "ALIMENTO"
      });

      buscar();

    } catch {

      alert("Erro ao criar produto");

    } finally {

      setLoading(false);

    }
  };

  /* =========================
     ATUALIZAR PRODUTO
  ========================= */
  const atualizar = async (
    id: string,
    campo: string,
    valor: any
  ) => {

    try {

      await fetch(
        `${API_URL}/api/product/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            [campo]: valor
          })
        }
      );

      buscar();

    } catch {

      alert("Erro ao atualizar produto");

    }
  };

  /* =========================
     DELETAR PRODUTO
  ========================= */
  const deletar = async (id: string) => {

    const confirmar = confirm(
      "Deseja excluir este produto?"
    );

    if (!confirmar) return;

    try {

      await fetch(
        `${API_URL}/api/product/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      buscar();

    } catch {

      alert("Erro ao deletar produto");

    }
  };

  return (

    <div className="home-page">

      <Navbar />

      <div className="home-content">

        <h2>Produtos</h2>

        {/* =========================
            CRIAR PRODUTO
        ========================= */}
        <div className="produto-edit-card">

          <input
            placeholder="Nome"
            value={novo.nome}
            onChange={(e) =>
              setNovo({
                ...novo,
                nome: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Preço"
            value={novo.preco}
            onChange={(e) =>
              setNovo({
                ...novo,
                preco: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Quantidade"
            value={novo.quantidade}
            onChange={(e) =>
              setNovo({
                ...novo,
                quantidade: e.target.value
              })
            }
          />

          <select
            value={novo.categoria}
            onChange={(e) =>
              setNovo({
                ...novo,
                categoria: e.target.value
              })
            }
          >

            <option value="ALIMENTO">
              🍔 Alimento
            </option>

            <option value="BEBIDA">
              🥤 Bebida
            </option>

            <option value="DOCE">
              🍫 Doce
            </option>

            <option value="ARTIGO_RELIGIOSO">
              🙇🏻‍♂️ Artigo Religioso
            </option>

          </select>

          <button
            className="btn-green"
            onClick={criarProduto}
            disabled={loading}
          >

            {
              loading
                ? "Adicionando..."
                : "Adicionar"
            }

          </button>

        </div>

        {/* =========================
            BOTÃO ATUALIZAR
        ========================= */}
        <button onClick={buscar}>
          🔄 Atualizar lista
        </button>

        {/* =========================
            LISTA PRODUTOS
        ========================= */}
        {produtos.map((p: any) => (

          <div
            key={p._id}
            className="produto-edit-card"
          >

            <input
              defaultValue={p.nome}
              onBlur={(e) =>
                atualizar(
                  p._id,
                  "nome",
                  e.target.value
                )
              }
            />

            <input
              type="number"
              defaultValue={p.preco}
              onBlur={(e) =>
                atualizar(
                  p._id,
                  "preco",
                  Number(e.target.value)
                )
              }
            />

            <input
              type="number"
              defaultValue={p.quantidade}
              onBlur={(e) =>
                atualizar(
                  p._id,
                  "quantidade",
                  Number(e.target.value)
                )
              }
            />

            <select
              defaultValue={
                p.categoria || "ALIMENTO"
              }
              onChange={(e) =>
                atualizar(
                  p._id,
                  "categoria",
                  e.target.value
                )
              }
            >

              <option value="ALIMENTO">
                🍔 Alimento
              </option>

              <option value="BEBIDA">
                🥤 Bebida
              </option>

              <option value="DOCE">
                🍫 Doce
              </option>

              <option value="ARTIGO_RELIGIOSO">
                🙇🏻‍♂️ Artigo Religioso
              </option>

            </select>

            <button
              className="btn-red"
              onClick={() => deletar(p._id)}
            >
              Excluir
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}