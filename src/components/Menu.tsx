import React from "react";
import {
  UserOutlined,
  TagsOutlined,
  ShoppingOutlined,
  MenuUnfoldOutlined,
  FileImageOutlined,
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
        <Menu.Item onClick={() => navigate("/produtos/cadastrar")}>
          Cadastrar
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/produtos/listagem")}>
          Listar
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/produtos/tamanhos")}>
          Tamanhos
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/produtos/modelagem")}>
          Modelagem
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/produtos/tabelas")}>
          Tabela de Tamanhos
        </Menu.Item>
        <Menu.Item onClick={() => navigate("/produtos/catalogo")}>
          Catálogos
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item icon={<ShoppingOutlined />}>Vendas</Menu.Item>
      <Menu.Item
        icon={<FileImageOutlined />}
        onClick={() => navigate("/banners")}
      >
        Banners
      </Menu.Item>
    </Menu>
  );
};

export default MenuApp;
