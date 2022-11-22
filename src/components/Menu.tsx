import React from "react";
import {
  UserOutlined,
  TagsOutlined,
  ShoppingOutlined,
  ToolOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const MenuApp: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Menu theme="dark">
      <Menu.Item icon={<UserOutlined />} onClick={() => navigate("/clientes")}>
        Clientes
      </Menu.Item>
      <Menu.SubMenu title="Categorias" icon={<MenuUnfoldOutlined />}>
        <Menu.Item onClick={() => navigate("/categorias/cadastrar")}>
          Cadastrar
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/categorias/listagem")}>
          Listar
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu title="Produtos" icon={<TagsOutlined />}>
        <Menu.Item>Cadastrar</Menu.Item>
        <Menu.Item>Listar</Menu.Item>
        <Menu.Item>Tamanhos</Menu.Item>
        <Menu.Item>Modelagem</Menu.Item>
        <Menu.Item>Tabela de Tamanhos</Menu.Item>
        <Menu.Item>Catálogos</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item icon={<ShoppingOutlined />}>Vendas</Menu.Item>
      <Menu.Item icon={<ToolOutlined />}>Opções do Site</Menu.Item>
    </Menu>
  );
};

export default MenuApp;
