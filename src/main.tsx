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
import Modelagem from "./pages/produtos/modelagem";
import Tabelas from "./pages/produtos/tabelas";
import Catalogos from "./pages/produtos/catalogo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Banners from "./pages/banners";
import Vendas from "./pages/vendas";
import "react-quill/dist/quill.snow.css";

const queryClient = new QueryClient();

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
  {
    path: "/produtos/modelagem",
    element: <Modelagem />,
  },
  {
    path: "/produtos/tabelas",
    element: <Tabelas />,
  },
  {
    path: "/produtos/catalogo",
    element: <Catalogos />,
  },
  {
    path: "/banners",
    element: <Banners />,
  },
  {
    path: "/vendas",
    element: <Vendas />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
