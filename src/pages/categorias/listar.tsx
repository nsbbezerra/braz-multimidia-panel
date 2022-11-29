import React, { Fragment, useEffect, useState } from "react";
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
  message,
  Spin,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../configs/axios";
import { isAxiosError } from "axios";

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
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [categories, setCategories] = useState<DataProps[]>([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!modalInfo) {
      form.resetFields();
    }
    if (!modalImage) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  }, [modalInfo, modalImage]);

  async function findCategories() {
    try {
      const { data } = await fetcher.get("/categories");
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.message) {
        let content = error.response?.data.message || "";
        message.open({
          type: "error",
          content,
        });
      }
    }
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: findCategories,
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (error) {
      let content = (error as Error).message;
      message.open({
        type: "error",
        content,
      });
    }
    if (data) {
      setCategories(data);
    }
  }, [data, error]);

  function handleCategorie(key: string) {
    const result = categories.find((obj) => obj.id === key);
    setName(result?.name || "");
    form.setFieldValue("name", result?.name || "");
    form.setFieldValue("description", result?.description || "");
    setDescription(result?.description || "");
    setId(result?.id || "");
    setModalInfo(true);
  }

  function handleImage(key: string) {
    setId(key);
    setModalImage(true);
  }

  async function active(key: string, active: boolean) {
    try {
      const response = await fetcher.put(`/activeCategory/${key}`, {
        active,
      });
      message.open({
        type: "success",
        content: response.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      if (isAxiosError(error) && error.message) {
        let content = error.response?.data.message || "";
        message.open({
          type: "error",
          content,
        });
      }
    }
  }

  const columns: ColumnsType<DataProps> = [
    {
      key: "active",
      title: "Ativo?",
      dataIndex: "active",
      render: (_, record) => (
        <Switch
          defaultChecked={record.active}
          onChange={(e) => active(record.id, e)}
        />
      ),
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
              <Menu.Item onClick={() => handleImage(record.id)}>
                Alterar Imagem
              </Menu.Item>
              <Menu.Item onClick={() => handleCategorie(record.id)}>
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

  async function UpdateCategory() {
    if (name === "") {
      message.open({
        type: "warning",
        content: "Digite um nome",
      });
      return false;
    }
    setLoading(true);
    try {
      const response = await fetcher.put(`/categories/${id}`, {
        name,
        description,
      });
      message.open({
        type: "success",
        content: response.data.message,
      });
      setLoading(false);
      form.resetFields();
      setModalInfo(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        let content = error.response?.data.message || "";
        message.open({
          type: "error",
          content,
        });
      }
    }
  }

  return (
    <Spin spinning={isLoading}>
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
              dataSource={categories}
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
        <Uploader
          width={"300px"}
          height="300px"
          to={`/updateThumbnailCategory/${id}`}
          onFinish={setModalImage}
          mode="PUT"
        />
      </Modal>

      <Modal
        open={modalInfo}
        onOk={() => UpdateCategory()}
        onCancel={() => setModalInfo(false)}
        title="Alterar Informações"
        okText="Salvar"
        cancelText="Cancelar"
        okButtonProps={{ loading: loading }}
      >
        <Form labelCol={{ span: 4 }} size="large" form={form}>
          <Form.Item label="Titulo" required name={"name"}>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Descrição" name={"description"}>
            <TextArea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default ListarCategorias;
