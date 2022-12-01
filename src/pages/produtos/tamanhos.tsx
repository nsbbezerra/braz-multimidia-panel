import React, { Fragment, useEffect, useState } from "react";
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
  message,
  Spin,
} from "antd";
import MenuApp from "../../components/Menu";
import {
  HolderOutlined,
  SaveOutlined,
  ToolOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { isAxiosError } from "axios";
import { fetcher } from "../../configs/axios";
import { useFormik } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Header, Sider, Content } = Layout;

interface DataProps {
  id: string;
  size: string;
}

type ProductsProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  id: string;
  name: string;
  Products: ProductsProps[];
}

const Tamanhos: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [sizes, setSizes] = useState<DataProps[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sizeId, setSizeId] = useState<string>("");

  useEffect(() => {
    async function findCategoriesWithProducts() {
      try {
        const { data } = await fetcher.get("/findCategoriesWithProducts");
        setCategories(data);
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
    findCategoriesWithProducts();
  }, []);

  async function DeleteSize(id: string) {
    setSizeId(id);
    setLoading(true);
    try {
      const response = await fetcher.delete(`/sizes/${id}`);
      message.open({
        type: "success",
        content: response.data.message,
      });
      setSizeId("");
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    } catch (error) {
      setSizeId("");
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
          <Button
            icon={<DeleteOutlined />}
            block
            danger
            onClick={() => DeleteSize(record.id)}
            loading={sizeId === record.id && loading ? true : false}
          >
            Excluir
          </Button>
        </Dropdown>
      ),
    },
  ];

  async function findSizes() {
    if (productId === "") {
      return [];
    } else {
      const { data } = await fetcher.get(`/sizes/${productId}`);
      return data;
    }
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["sizes"],
    queryFn: findSizes,
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (productId !== "") {
      refetch();
    }
  }, [productId]);

  useEffect(() => {
    if (error) {
      message.open({
        type: "error",
        content: (error as Error).message,
      });
    }
    if (data) {
      setSizes(data);
    }
  }, [data, error]);

  function handleSearchProduct(id: string) {
    setProductId("");
    form.setFieldValue("productId", "");
    setCategoryId(id);
    const result = categories.find((obj) => obj.id === id);
    setProducts(result?.Products || []);
  }

  async function CreateSize(size: string) {
    setLoading(true);
    try {
      const response = await fetcher.post(`/sizes/${productId}`, {
        size,
      });
      message.open({
        type: "success",
        content: response.data.message,
      });
      setLoading(false);
      form.setFieldValue("size", "");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
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

  const formik = useFormik({
    initialValues: {
      categoryId: "",
      productId: "",
      size: "",
    },
    onSubmit: (values) => {
      let size = values.size;
      CreateSize(size);
    },
  });

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
            <Form
              size="large"
              form={form}
              initialValues={{ categoryId: "", productId: "", size: "" }}
              onFinish={formik.handleSubmit}
            >
              <Row gutter={10}>
                <Col span={20}>
                  <Row gutter={10}>
                    <Col span={8}>
                      <Form.Item
                        label="Categoria"
                        required
                        name={"categoryId"}
                        rules={[
                          {
                            required: true,
                            message: "Selecione uma categoria",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="Selecione uma opção"
                          optionFilterProp="children"
                          disabled={categories.length === 0 ? true : false}
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
                          options={categories.map((cat) => {
                            return { value: cat.id, label: cat.name };
                          })}
                          value={categoryId}
                          onChange={(e) => handleSearchProduct(e)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Produto"
                        required
                        name={"productId"}
                        rules={[
                          { required: true, message: "Selecione um produto" },
                        ]}
                      >
                        <Select
                          showSearch
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="Selecione uma opção"
                          optionFilterProp="children"
                          value={productId}
                          onChange={(e) => setProductId(e)}
                          disabled={products.length === 0 ? true : false}
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
                          options={products.map((prod) => {
                            return { value: prod.id, label: prod.name };
                          })}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Tamanho"
                        required
                        name={"size"}
                        rules={[
                          { required: true, message: "Insira um tamanho" },
                        ]}
                      >
                        <Input
                          width={"100%"}
                          value={formik.values.size}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={4}>
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    size="large"
                    block
                    htmlType="submit"
                    loading={loading && sizeId === "" ? true : false}
                  >
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Form>
            <Divider style={{ marginTop: -5 }} />
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={sizes}
                size="middle"
                pagination={{ pageSize: 20 }}
              />
            </Spin>
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
