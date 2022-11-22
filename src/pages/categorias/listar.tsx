import React, { Fragment, useState } from "react";
import {
  Layout,
  Image,
  Row,
  Col,
  Card,
  Button,
  Switch,
  Menu,
  Dropdown,
  Modal,
  Form,
  Input,
} from "antd";
import MenuApp from "../../components/Menu";
import {
  EditOutlined,
  OrderedListOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import Uploader from "../../components/Uploader";
import TextArea from "antd/es/input/TextArea";

const { Header, Sider, Content } = Layout;

const ListarCategorias: React.FC = () => {
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Alterar Imagem",
          onClick: () => setModalImage(true),
        },
        {
          key: "2",
          label: "Alterar Informações",
          onClick: () => setModalInfo(true),
        },
      ]}
    />
  );

  const MyCard = () => (
    <Card
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
      actions={[
        <Switch defaultChecked />,
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button icon={<EditOutlined />}>Editar</Button>
        </Dropdown>,
      ]}
      size="small"
    >
      <Meta title="Europe Street beat" description="www.instagram.com" />
    </Card>
  );

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
                <OrderedListOutlined /> LISTAGEM DE CATEGORIAS
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
            <Row gutter={10}>
              <Col span={6} style={{ marginBottom: 10 }}>
                <MyCard />
              </Col>
              <Col span={6}>
                <MyCard />
              </Col>
              <Col span={6}>
                <MyCard />
              </Col>
              <Col span={6}>
                <MyCard />
              </Col>
              <Col span={6}>
                <MyCard />
              </Col>
              <Col span={6}>
                <MyCard />
              </Col>
              <Col span={6}>
                <MyCard />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Thumbnail"
        open={modalImage}
        footer={false}
        width={"350px"}
        onCancel={() => setModalImage(false)}
      >
        {true ? (
          <div>
            <div
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <Image
                width={"300px"}
                height="300px"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                style={{ objectFit: "cover" }}
              />
            </div>
            <Button block icon={<DeleteOutlined />} danger>
              Excluir Imagem
            </Button>
          </div>
        ) : (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Uploader width={"300px"} height="300px" to="/" />
          </div>
        )}
      </Modal>

      <Modal
        open={modalInfo}
        onOk={() => {}}
        onCancel={() => setModalInfo(false)}
        title="Alterar Informações"
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form labelCol={{ span: 4 }} size="large">
          <Form.Item label="Titulo" required>
            <Input autoFocus />
          </Form.Item>
          <Form.Item label="Descrição">
            <TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ListarCategorias;
