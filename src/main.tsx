import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages";
import Clientes from "./pages/clientes";
import CadastroCategorias from "./pages/categorias/cadastro";
import ListarCategorias from "./pages/categorias/listar";

const router = createBrowserRouter([
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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
