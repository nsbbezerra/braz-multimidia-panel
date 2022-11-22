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
  Menu,
  Modal,
} from "antd";
import MenuApp from "../../components/Menu";
import { HolderOutlined, SaveOutlined, ToolOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";

const { Header, Sider, Content } = Layout;

interface DataProps {
  id: string;
  size: string;
}

const Tamanhos: React.FC = () => {
  const [modalInfo, setModalInfo] = useState<boolean>(false);

  const columns: ColumnsType<DataProps> = [
    {
      key: "size",
      title: "Tamanho",
      dataIndex: "size",
    },
    {
      key: "id",
      title: "Ações",
      dataIndex: "id",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          overlay={() => (
            <Menu>
              <Menu.Item onClick={() => setModalInfo(true)}>
                Alterar Informações
              </Menu.Item>
            </Menu>
          )}
        >
          <Button icon={<ToolOutlined />} block type="primary">
            Opções
          </Button>
        </Dropdown>
      ),
    },
  ];

  const data: DataProps[] = [
    {
      id: "1",
      size: "PP",
    },
  ];

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
                <HolderOutlined /> TAMANHOS DOS PRODUTOS
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
                    <Col span={12}>
                      <Form.Item label="Tamanho" required>
                        <Input width={"100%"} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col span={4}>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  size="large"
                  block
                >
                  Salvar
                </Button>
              </Col>
            </Row>
            <Divider style={{ marginTop: -5 }} />

            <Table
              columns={columns}
              dataSource={data}
              size="middle"
              pagination={{ pageSize: 20 }}
            />
          </Content>
        </Layout>
      </Layout>

      <Modal
        open={modalInfo}
        onOk={() => {}}
        onCancel={() => setModalInfo(false)}
        title="Alterar Informações"
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form labelCol={{ span: 4 }} size="large">
          <Form.Item label="Tamanho" required>
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Tamanhos;
