import React, { Fragment, useState } from "react";
import {
  Layout,
  Image,
  Form,
  Select,
  Divider,
  Input,
  Button,
  Row,
  Col,
  Dropdown,
  Modal,
  Card,
  Menu,
} from "antd";
import MenuApp from "../../components/Menu";
import {
  EditOutlined,
  SaveOutlined,
  BuildOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import Uploader from "../../components/Uploader";

const { Header, Sider, Content } = Layout;

const Modelagem: React.FC = () => {
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);
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
                <BuildOutlined /> MODELAGEM DOS PRODUTOS
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
            <Form size="large">
              <Row gutter={10}>
                <Col span={8}>
                  <Form.Item label="Categoria" required>
                    <Select
                      showSearch
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Selecione uma opção"
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
                          value: "1",
                          label: "Not Identified",
                        },
                        {
                          value: "2",
                          label: "Closed",
                        },
                        {
                          value: "3",
                          label: "Communicated",
                        },
                        {
                          value: "4",
                          label: "Identified",
                        },
                        {
                          value: "5",
                          label: "Resolved",
                        },
                        {
                          value: "6",
                          label: "Cancelled",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Produto" required>
                    <Select
                      showSearch
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Selecione uma opção"
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
                          value: "1",
                          label: "Not Identified",
                        },
                        {
                          value: "2",
                          label: "Closed",
                        },
                        {
                          value: "3",
                          label: "Communicated",
                        },
                        {
                          value: "4",
                          label: "Identified",
                        },
                        {
                          value: "5",
                          label: "Resolved",
                        },
                        {
                          value: "6",
                          label: "Cancelled",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Título" required>
                    <Input width={"100%"} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Descrição">
                <TextArea style={{ resize: "none" }} />
              </Form.Item>
              <Form.Item>
                <Button icon={<SaveOutlined />} type="primary" size="large">
                  Salvar
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ marginTop: -5 }} />
            <div style={{ maxWidth: "800px", margin: "auto" }}>
              <Row gutter={10}>
                <Col span={8}>
                  <Card
                    bordered
                    size="small"
                    cover={
                      <img
                        alt="example"
                        src="https://www.vestireuniformes.com.br/files/large/camiseta-infantil.png"
                        style={{ padding: 1 }}
                      />
                    }
                    actions={[
                      <Dropdown
                        overlay={() => (
                          <Menu>
                            <Menu.Item onClick={() => setModalImage(true)}>
                              Alterar Imagem
                            </Menu.Item>
                            <Menu.Item onClick={() => setModalInfo(true)}>
                              Alterar Informações
                            </Menu.Item>
                          </Menu>
                        )}
                      >
                        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                          <Button icon={<EditOutlined />} block type="primary">
                            Editar
                          </Button>
                        </div>
                      </Dropdown>,
                    ]}
                  >
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "16px" }}>Título</strong>
                      <p>Descrição</p>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    bordered
                    size="small"
                    cover={
                      <img
                        alt="example"
                        src="https://www.vestireuniformes.com.br/files/large/camiseta-infantil.png"
                        style={{ padding: 1 }}
                      />
                    }
                    actions={[
                      <Dropdown
                        overlay={() => (
                          <Menu>
                            <Menu.Item onClick={() => setModalImage(true)}>
                              Alterar Imagem
                            </Menu.Item>
                            <Menu.Item onClick={() => setModalInfo(true)}>
                              Alterar Informações
                            </Menu.Item>
                          </Menu>
                        )}
                      >
                        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                          <Button icon={<EditOutlined />} block type="primary">
                            Editar
                          </Button>
                        </div>
                      </Dropdown>,
                    ]}
                  >
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "16px" }}>Título</strong>
                      <p>Descrição</p>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    bordered
                    size="small"
                    cover={
                      <img
                        alt="example"
                        src="https://www.vestireuniformes.com.br/files/large/camiseta-infantil.png"
                        style={{ padding: 1 }}
                      />
                    }
                    actions={[
                      <Dropdown
                        overlay={() => (
                          <Menu>
                            <Menu.Item onClick={() => setModalImage(true)}>
                              Alterar Imagem
                            </Menu.Item>
                            <Menu.Item onClick={() => setModalInfo(true)}>
                              Alterar Informações
                            </Menu.Item>
                          </Menu>
                        )}
                      >
                        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                          <Button icon={<EditOutlined />} block type="primary">
                            Editar
                          </Button>
                        </div>
                      </Dropdown>,
                    ]}
                  >
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "16px" }}>Título</strong>
                      <p>Descrição</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
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

export default Modelagem;
