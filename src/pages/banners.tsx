import React, { useState } from "react";
import { Layout, Image, Form, Select, Divider, Card, Badge } from "antd";
import MenuApp from "../components/Menu";
import { FileImageOutlined } from "@ant-design/icons";
import Uploader from "../components/Uploader";

const { Header, Sider, Content } = Layout;

interface BannerProps {
  id: string;
  desktop: string;
  desktopId: string;
  mobile: string;
  mobileId: string;
  redirect?: string;
  origin: "index" | "products" | "catalog" | "cart" | "product" | "other";
}

const Banners: React.FC = () => {
  const [form] = Form.useForm();
  const [page, setPage] = useState<string>("index");

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
              <FileImageOutlined /> BANNERS DO SITE
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
          <Form size="large" initialValues={{ page: "index" }} form={form}>
            <Form.Item label="Selecione uma página:" name={"page"}>
              <Select
                showSearch
                placeholder="Selecione um opção"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
                  {
                    value: "index",
                    label: "Página Principal",
                  },
                  {
                    value: "products",
                    label: "Página de Listagem de Produtos",
                  },
                  {
                    value: "product",
                    label: "Página de Informação de um Produto",
                  },
                  {
                    value: "catalog",
                    label: "Página de Catálogo",
                  },
                  {
                    value: "cart",
                    label: "Página do Carrinho",
                  },
                  {
                    value: "other",
                    label: "Páginas Gerais",
                  },
                ]}
                value={page}
                onChange={(e) => setPage(e)}
              />
            </Form.Item>
          </Form>

          <Divider />

          <Badge.Ribbon text="Múltiplos Banners">
            <Card title="Banner da Página Principal" size="small">
              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(1, 1fr)",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                <label style={{ fontWeight: "bold" }}>
                  Banner para computador (Desktop):
                </label>
                <Uploader
                  to="/"
                  onFinish={() => {}}
                  width="1000px"
                  height={"250px"}
                />

                <Divider />

                <label style={{ fontWeight: "bold" }}>
                  Banner para telefones (Mobile):
                </label>
                <Uploader
                  to="/"
                  onFinish={() => {}}
                  width="250px"
                  height={"360px"}
                />
              </div>
            </Card>
          </Badge.Ribbon>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Banners;
