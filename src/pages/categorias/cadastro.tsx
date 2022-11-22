import React, { Fragment, useState } from "react";
import { Layout, Image, Form, Input, Button, Modal } from "antd";
import MenuApp from "../../components/Menu";
import { SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import Uploader from "../../components/Uploader";

const { Header, Sider, Content } = Layout;

const CadastroCategorias: React.FC = () => {
  const [modalImage, setModalImage] = useState<boolean>(false);

  return (
    <Fragment>
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
                <SaveOutlined /> CADASTRO DE CATEGORIAS
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
            <Form layout="horizontal" size="large" labelCol={{ span: 2 }}>
              <Form.Item label="Nome" required>
                <Input />
              </Form.Item>
              <Form.Item label="Descrição">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button icon={<SaveOutlined />} type="primary" size="large">
                  Salvar
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Thumbnail"
        open={modalImage}
        closable={false}
        footer={false}
        width={"350px"}
      >
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Uploader width={"300px"} height="300px" to="/" />
        </div>
      </Modal>
    </Fragment>
  );
};

export default CadastroCategorias;
