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
  Card,
  message,
  Spin,
} from "antd";
import MenuApp from "../../components/Menu";
import { BuildOutlined, DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
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

interface ModelingProps {
  id: string;
  title: string;
  description: string;
  image: string;
  imageId: string;
}

const Modelagem: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [modelings, setModelings] = useState<ModelingProps[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [modelingId, setModelingId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  async function findModelings() {
    if (productId === "") {
      return [];
    } else {
      const { data } = await fetcher.get(`/modeling/${productId}`);
      return data;
    }
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: findModelings,
    queryKey: ["modelings"],
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (productId !== "") {
      refetch();
    } else {
      setModelings([]);
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
      setModelings(data);
    }
  }, [data, error]);

  function handleFinish(value: boolean) {
    setTitle("");
    setDescription("");
    queryClient.invalidateQueries({ queryKey: ["modelings"] });
  }

  async function DeleteModeling(id: string) {
    setModelingId(id);
    setLoading(false);

    try {
      const response = await fetcher.delete(`/modeling/${id}`);
      message.open({
        type: "success",
        content: response.data.message,
      });
      setModelingId("");
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["modelings"] });
    } catch (error) {
      setModelingId("");
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
                <Col span={12}>
                  <Form.Item label="Categoria" required>
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
                  <Form.Item label="Produto" required>
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 250px))",
                  gap: 20,
                  justifyContent: "center",
                }}
              >
                {modelings.map((model) => (
                  <div key={model.id}>
                    <img
                      alt="example"
                      src={model.image}
                      style={{ padding: 10, width: "250px" }}
                    />
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "16px" }}>
                        {model.title}
                      </strong>
                      <p>{model.description}</p>

                      <Button
                        block
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => DeleteModeling(model.id)}
                        loading={
                          modelingId === model.id && loading ? true : false
                        }
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}

                <div>
                  <Input
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextArea
                    placeholder="Descrição"
                    style={{ marginTop: 10, marginBottom: 10 }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  <Uploader
                    width={"250px"}
                    height={"250px"}
                    to={`/modeling/${productId}`}
                    mode="POST"
                    onFinish={handleFinish}
                    disabled={title === "" || description === "" ? true : false}
                    customData={[
                      { key: "title", value: title },
                      { key: "description", value: description },
                    ]}
                  />
                </div>
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default Modelagem;
