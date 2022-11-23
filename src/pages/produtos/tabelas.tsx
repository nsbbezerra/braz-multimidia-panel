import React, { Fragment } from "react";
import { Layout, Image, Form, Select, Divider, Button, Row, Col } from "antd";
import MenuApp from "../../components/Menu";
import {
  BuildOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Uploader from "../../components/Uploader";

const { Header, Sider, Content } = Layout;

const Tabelas: React.FC = () => {
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
                <BuildOutlined /> TABELA DE TAMANHOS
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
              <Col span={20}>
                <Form size="large">
                  <Row gutter={10}>
                    <Col span={12}>
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
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
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
                    <Col span={12}>
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
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
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
                  </Row>
                </Form>
              </Col>
              <Col span={4}>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  size="large"
                  block
                >
                  Buscar
                </Button>
              </Col>
            </Row>
            <Divider style={{ marginTop: -5 }} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 400px))",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <div>
                <Image
                  width={"400px"}
                  height="300px"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  block
                  style={{ marginTop: 10 }}
                >
                  Remover Imagem
                </Button>
              </div>

              <Uploader width={"400px"} height={"300px"} to="/" />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default Tabelas;
