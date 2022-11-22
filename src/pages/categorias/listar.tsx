import React, { Fragment, useState } from "react";
import {
  Layout,
  Image,
  Button,
  Switch,
  Menu,
  Dropdown,
  Modal,
  Form,
  Input,
  Avatar,
} from "antd";
import MenuApp from "../../components/Menu";
import {
  OrderedListOutlined,
  DeleteOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import Uploader from "../../components/Uploader";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";

const { Header, Sider, Content } = Layout;

interface DataProps {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  thumbnail: string;
  thumbnailId: string;
}

const ListarCategorias: React.FC = () => {
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);

  const columns: ColumnsType<DataProps> = [
    {
      key: "active",
      title: "Ativo?",
      dataIndex: "active",
      render: (_, record) => <Switch defaultChecked={record.active} />,
      width: "5%",
      align: "center",
    },
    {
      key: "thumbnail",
      title: "Thumb",
      dataIndex: "thumbnail",
      render: (_, record) => (
        <Avatar src={<Image src={record.thumbnail} />} size="large" />
      ),
      width: "5%",
      align: "center",
    },
    {
      key: "name",
      title: "Título",
      dataIndex: "name",
    },
    Table.EXPAND_COLUMN,
    {
      key: "description",
      title: "Descrição",
      dataIndex: "description",
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
              <Menu.Item onClick={() => setModalImage(true)}>
                Alterar Imagem
              </Menu.Item>
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
      name: "John Brown",
      description: "Descrição",
      active: true,
      thumbnail: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      thumbnailId: "id",
    },
    {
      id: "2",
      name: "Jim Green",
      description: "Descrição",
      active: true,
      thumbnail: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      thumbnailId: "id",
    },
    {
      id: "3",
      name: "Joe Black",
      description: "Descrição",
      active: true,
      thumbnail: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      thumbnailId: "id",
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
            <Table
              columns={columns}
              dataSource={data}
              size="middle"
              pagination={{ pageSize: 20 }}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>{record.description}</p>
                ),
              }}
            />
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
