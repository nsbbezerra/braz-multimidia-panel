import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages";
import Clientes from "./pages/clientes";
import CadastroCategorias from "./pages/categorias/cadastro";
import ListarCategorias from "./pages/categorias/listar";
import CadastrarProduto from "./pages/produtos/cadastro";
import ListarProdutos from "./pages/produtos/listagem";
import Tamanhos from "./pages/produtos/tamanhos";

const router = createBrowserRouter([
  { path: "*", element: <IndexPage /> },
  { path: "/", element: <IndexPage /> },
  {
    path: "/clientes",
    element: <Clientes />,
  },
  {
    path: "/categorias/cadastrar",
    element: <CadastroCategorias />,
  },
  {
    path: "/categorias/listagem",
    element: <ListarCategorias />,
  },
  {
    path: "/produtos/cadastrar",
    element: <CadastrarProduto />,
  },
  {
    path: "/produtos/listagem",
    element: <ListarProdutos />,
  },
  {
    path: "/produtos/tamanhos",
    element: <Tamanhos />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
