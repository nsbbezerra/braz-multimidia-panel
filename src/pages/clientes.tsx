import React from "react";
import { Layout, Image, Table } from "antd";
import MenuApp from "../components/Menu";
import { UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  comp?: string;
  district: string;
  cep: string;
  city: string;
  state: string;
}

const { Header, Sider, Content } = Layout;

const Clientes: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    { title: "Nome", dataIndex: "name", key: "name", width: "30%" },
    { title: "Documento", dataIndex: "document", key: "document" },
    { title: "Telefone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    Table.EXPAND_COLUMN,
    {
      title: "Endereço",
      dataIndex: "street",
      key: "street",
      ellipsis: true,
      width: "10%",
    },
  ];

  const data: DataType[] = [
    {
      key: 1,
      name: "John Brown",
      document: "017.378.378-28",
      phone: "(63) 99999-8888",
      email: "email@email.com",
      street: "Rua 34",
      number: "173",
      cep: "77.710-000",
      city: "Pedro Afonso",
      district: "Canavieiras",
      state: "TO",
      id: Math.random().toString(),
    },
  ];

  type DataIndex = keyof DataType;

  return (
    <Layout style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Sider
        collapsible={false}
        style={{ boxShadow: "0px 0px 5px rgba(0,0,0,.1)" }}
      >
        <div className="logo">
          <Image src="/vite.svg" />
        </div>
        <MenuApp />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: "white",
            boxShadow: "0px 0px 5px rgba(0,0,0,.1)",
          }}
        >
          <div className="header-app">
            <h1 className="heading">
              <UserOutlined /> CLIENTES
            </h1>
          </div>
        </Header>
        <Content
          style={{
            margin: "20px 16px",
            padding: 24,
            minHeight: 280,
            maxHeight: "100%",
            overflow: "auto",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0px 0px 5px rgba(0,0,0,.1)",
          }}
        >
          <Table
            size="middle"
            columns={columns}
            pagination={{ pageSize: 20 }}
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{ margin: 0 }}
                >{`${record.street}, Nº: ${record.number}, setor: ${record.district}, CEP: ${record.cep}, ${record.city}-${record.state}`}</p>
              ),
            }}
            dataSource={data}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Clientes;
