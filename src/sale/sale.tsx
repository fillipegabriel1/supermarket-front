import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/navbar";

const API_URL = import.meta.env.VITE_API_URL;

const categorias = {
  ALIMENTO: "🍔 Alimentos",
  BEBIDA: "🥤 Bebidas",
  DOCE: "🍫 Doces",
  ARTIGO_RELIGIOSO: "🙇🏻‍♂️ Artigos Religiosos"
};

export default function Sale() {

  const token = Cookies.get("token");

  const [codigo, setCodigo] = useState("");

  const [cliente, setCliente] = useState<any>(null);

  const [produtos, setProdutos] = useState<any[]>([]);

  const [carrinho, setCarrinho] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  /* =========================
     BUSCAR CLIENTE
  ========================= */
  const buscarCliente = async () => {

    if (!codigo) return;

    try {

      const res = await fetch(
        `${API_URL}/api/client/${codigo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (res.ok) {

        setCliente(data);

        buscarProdutos();

      } else {

        alert("Cliente não encontrado");

        setCliente(null);

      }

    } catch {

      alert("Erro ao buscar cliente");

    }
  };

  /* =========================
     BUSCAR PRODUTOS
  ========================= */
  const buscarProdutos = async () => {

    try {

      const res = await fetch(
        `${API_URL}/api/product`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setProdutos(data);

    } catch {

      alert("Erro ao buscar produtos");

    }
  };

  useEffect(() => {

    const interval = setInterval(() => {

      if (cliente) {
        buscarProdutos();
      }

    }, 3000);

    return () => clearInterval(interval);

  }, [cliente]);

  /* =========================
     ADICIONAR CARRINHO
  ========================= */
  const adicionar = (p: any) => {

    const item = carrinho.find(
      (i) => i._id === p._id
    );

    if (
      item &&
      item.quantidade >= p.quantidade
    ) {
      return;
    }

    if (item) {

      setCarrinho(
        carrinho.map((i) =>
          i._id === p._id
            ? {
                ...i,
                quantidade: i.quantidade + 1
              }
            : i
        )
      );

    } else {

      setCarrinho([
        ...carrinho,
        {
          _id: p._id,
          nome: p.nome,
          preco: p.preco,
          quantidade: 1
        }
      ]);

    }
  };

  /* =========================
     DIMINUIR
  ========================= */
  const diminuir = (p: any) => {

    setCarrinho(

      carrinho
        .map((i) =>
          i._id === p._id
            ? {
                ...i,
                quantidade: i.quantidade - 1
              }
            : i
        )
        .filter((i) => i.quantidade > 0)

    );
  };

  /* =========================
     TOTAL
  ========================= */
  const total = carrinho.reduce(
    (acc, item) =>
      acc + item.preco * item.quantidade,
    0
  );

  /* =========================
     FINALIZAR VENDA
  ========================= */
  const finalizar = async () => {

    if (!carrinho.length) {

      alert("Carrinho vazio");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/api/sale`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            codigo: Number(codigo),
            itens: carrinho
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Venda realizada com sucesso!");

        setCarrinho([]);

        buscarCliente();

        buscarProdutos();

      } else {

        alert(data.message);

      }

    } catch {

      alert("Erro ao finalizar venda");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="home-page">

      <Navbar />

      <div className="home-content">

        <h2>Venda</h2>

        {/* =========================
            BUSCA CLIENTE
        ========================= */}
        <div className="box">

          <input
            placeholder="Código do cliente"
            value={codigo}
            onChange={(e) =>
              setCodigo(e.target.value)
            }
          />

          <button onClick={buscarCliente}>
            Buscar
          </button>

        </div>

        {/* =========================
            CLIENTE
        ========================= */}
        {cliente && (

          <div className="cliente-card">

            <h3>
              {cliente.nome}
            </h3>

            <p className="saldo">
              Saldo: R$ {cliente.saldo.toFixed(2)}
            </p>

          </div>

        )}

        {/* =========================
            PRODUTOS
        ========================= */}
        {Object.entries(categorias).map(
          ([key, label]) => {

            const lista = produtos.filter(
              (p) =>
                p.categoria === key &&
                p.quantidade > 0
            );

            if (!lista.length) return null;

            return (

              <div
                key={key}
                className="categoria"
              >

                <h3>{label}</h3>

                {lista.map((p) => {

                  const item = carrinho.find(
                    (i) => i._id === p._id
                  );

                  return (

                    <div
                      key={p._id}
                      className="produto-linha"
                    >

                      <div className="produto-nome">
                        {p.nome}
                      </div>

                      <div className="produto-estoque">
                        {p.quantidade} disp
                      </div>

                      <div className="produto-preco">
                        R$ {p.preco.toFixed(2)}
                      </div>

                      <div className="controle">

                        <button
                          onClick={() => diminuir(p)}
                        >
                          -
                        </button>

                        <span className="qtd">
                          {item?.quantidade || 0}
                        </span>

                        <button
                          onClick={() => adicionar(p)}
                          disabled={
                            item?.quantidade >=
                            p.quantidade
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                  );
                })}

              </div>

            );
          }
        )}

        {/* =========================
            CARRINHO
        ========================= */}
        {carrinho.length > 0 && (

          <div className="carrinho-fixo">

            <h3>
              Carrinho
            </h3>

            {carrinho.map((item) => (

              <div
                key={item._id}
                className="carrinho-item"
              >

                <span>
                  {item.nome}
                </span>

                <span>
                  {item.quantidade}x
                </span>

                <span>
                  R$ {
                    (
                      item.preco *
                      item.quantidade
                    ).toFixed(2)
                  }
                </span>

              </div>

            ))}

            <div className="total">

              Total: R$ {total.toFixed(2)}

            </div>

            <button
              className="btn-finalizar"
              onClick={finalizar}
              disabled={loading}
            >
              {
                loading
                  ? "Finalizando..."
                  : "Finalizar Venda"
              }
            </button>

          </div>

        )}

      </div>

    </div>
  );
}