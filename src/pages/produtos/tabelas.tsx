import React, { Fragment, useEffect, useState } from "react";
import {
  Layout,
  Image,
  Form,
  Select,
  Divider,
  Button,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import MenuApp from "../../components/Menu";
import { BuildOutlined, DeleteOutlined } from "@ant-design/icons";
import Uploader from "../../components/Uploader";
import { fetcher } from "../../configs/axios";
import { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Header, Sider, Content } = Layout;

type ProductsProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  id: string;
  name: string;
  Products: ProductsProps[];
}

interface TableProps {
  id: string;
  table: string;
  tableId: string;
}

const Tabelas: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tableId, setTableId] = useState<string>("");

  const [tables, setTables] = useState<TableProps[]>([]);

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

  function handleSearchProduct(id: string) {
    setProductId("");
    form.setFieldValue("productId", "");
    setCategoryId(id);
    const result = categories.find((obj) => obj.id === id);
    setProducts(result?.Products || []);
  }

  async function findTables() {
    if (productId === "") {
      return [];
    } else {
      const { data } = await fetcher.get(`/tables/${productId}`);
      return data;
    }
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: findTables,
    queryKey: ["tables"],
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (productId !== "") {
      refetch();
    } else {
      setTables([]);
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
      setTables(data);
    }
  }, [data, error]);

  async function RemoveTable(id: string) {
    setTableId(id);
    setLoading(true);

    try {
      const response = await fetcher.delete(`/tables/${id}`);

      message.open({
        type: "success",
        content: response.data.message,
      });

      setTableId("");
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    } catch (error) {
      setTableId("");
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
            <Form
              size="large"
              initialValues={{
                categoryId: "",
                productId: "",
              }}
              form={form}
            >
              <Row gutter={10}>
                <Col span={12}>
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
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={categories.map((cat) => {
                        return { value: cat.id, label: cat.name };
                      })}
                      value={categoryId}
                      onChange={(e) => handleSearchProduct(e)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Produto"
                    required
                    name={"productId"}
                    rules={[
                      {
                        required: true,
                        message: "Selecione um produto",
                      },
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
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={products.map((prod) => {
                        return { value: prod.id, label: prod.name };
                      })}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider style={{ marginTop: -5 }} />

            <Spin spinning={isLoading}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 400px))",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                {tables.map((tab) => (
                  <div key={tab.id}>
                    <Image
                      width={"400px"}
                      height="300px"
                      src={tab.table}
                      style={{
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      block
                      style={{ marginTop: 10 }}
                      onClick={() => RemoveTable(tab.id)}
                      loading={tableId === tab.id && loading ? true : false}
                    >
                      Remover Imagem
                    </Button>
                  </div>
                ))}

                <Uploader
                  width={"400px"}
                  height={"300px"}
                  to={`/tables/${productId}`}
                  mode="POST"
                  onFinish={() => {}}
                />
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default Tabelas;
