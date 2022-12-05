import React, { Fragment, useState, useEffect } from "react";
import {
  Layout,
  Image,
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  Modal,
  message,
} from "antd";
import MenuApp from "../../components/Menu";
import { TagOutlined, SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import RichTextEditor from "react-rte";
import Uploader from "../../components/Uploader";
import { useFormik } from "formik";
import { isAxiosError } from "axios";
import { fetcher } from "../../configs/axios";

const { Header, Sider, Content } = Layout;

interface ProductProps {
  name: string;
  categoryId: string;
  shortDescription: string;
  description?: string;
  price: number;
  video?: string;
}

type CategoriesProps = {
  id: string;
  name: string;
  description?: string;
};

const CadastrarProduto: React.FC = () => {
  const [form] = Form.useForm();
  const [text, setText] = useState<any>(RichTextEditor.createEmptyValue());
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!modalImage) {
      form.resetFields();
      setCategoryId("");
      setText(RichTextEditor.createEmptyValue());
    }
  }, [modalImage]);

  useEffect(() => {
    async function findCategories() {
      try {
        const { data } = await fetcher.get("/categories");
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
    findCategories();
  }, []);

  async function CreateProduct(values: ProductProps) {
    if (categoryId === "") {
      message.open({
        type: "warning",
        content: "Selecione uma categoria",
      });
      return false;
    }
    setLoading(true);
    try {
      let textConvert = text.toString("html");
      let videoUrlConvert = !values.video
        ? ""
        : values.video.replace("watch?v=", "embed/");
      const response = await fetcher.post("/products", {
        categoryId,
        description: textConvert,
        name: values.name,
        price: values.price,
        shortDescription: values.shortDescription,
        video: videoUrlConvert,
      });
      message.open({
        type: "success",
        content: response.data.message,
      });
      setId(response.data.id);
      setLoading(false);
      setModalImage(true);
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
      name: "",
      categoryId: "",
      price: 0,
      shortDescription: "",
      video: "",
    },
    onSubmit: (values) => {
      CreateProduct(values);
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
                <TagOutlined /> CADASTRAR PRODUTOS
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
                name: "",
                categoryId: "",
                price: 0,
                shortDescription: "",
                video: "",
              }}
              onFinish={formik.handleSubmit}
              form={form}
            >
              <Form.Item
                label="Título"
                required
                rules={[{ required: true, message: "Insira um título" }]}
                name="name"
              >
                <Input
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Row style={{ width: "100%" }}>
                <Col span={12}>
                  <Form.Item
                    label="Categoria"
                    required
                    rules={[
                      { required: true, message: "Selecione uma categoria" },
                    ]}
                    name="categoryId"
                  >
                    <Select
                      showSearch
                      disabled={categories.length === 0 ? true : false}
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
                      options={categories.map((cat) => {
                        return { value: cat.id, label: cat.name };
                      })}
                      value={categoryId}
                      onChange={(e) => setCategoryId(e)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ paddingLeft: 10 }}>
                  <Form.Item
                    label="Preço"
                    required
                    rules={[{ required: true, message: "Insira um preço" }]}
                    name="price"
                  >
                    <Input
                      addonAfter="R$"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Descrição curta" name={"shortDescription"}>
                <TextArea
                  rows={2}
                  style={{ resize: "none" }}
                  value={formik.values.shortDescription}
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item label="URL Vídeo Youtube" name={"video"}>
                <Input
                  value={formik.values.video}
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item label="Descrição">
                <RichTextEditor
                  value={text}
                  onChange={(e) => setText(e)}
                  toolbarConfig={{
                    display: [
                      "INLINE_STYLE_BUTTONS",
                      "BLOCK_TYPE_BUTTONS",
                      "BLOCK_TYPE_DROPDOWN",
                    ],
                    INLINE_STYLE_BUTTONS: [
                      {
                        label: "Negrito",
                        style: "BOLD",
                        className: "custom-css-class",
                      },
                      { label: "Itálico", style: "ITALIC" },
                      { label: "Sublinhado", style: "UNDERLINE" },
                      {
                        label: "Tracejado",
                        style: "STRIKETHROUGH",
                      },
                    ],
                    BLOCK_TYPE_DROPDOWN: [
                      { label: "Normal", style: "unstyled" },
                      { label: "Título 1", style: "header-one" },
                      { label: "Título 2", style: "header-two" },
                      { label: "Título 3", style: "header-three" },
                    ],
                    BLOCK_TYPE_BUTTONS: [
                      { label: "Lista", style: "unordered-list-item" },
                      { label: "Numeração", style: "ordered-list-item" },
                      { label: "Citação", style: "blockquote" },
                    ],
                  }}
                  placeholder="Insira seu texto aqui"
                  editorStyle={{
                    background: "transparent",
                  }}
                  rootStyle={{
                    fontFamily: "sans-serif",
                    borderRadius: "8px",
                  }}
                />
              </Form.Item>

              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={loading}
              >
                Salvar
              </Button>
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
          <Uploader
            width={"300px"}
            height="300px"
            to={`/products/thumbnail/${id}`}
            onFinish={setModalImage}
            mode="PUT"
          />
        </div>
      </Modal>
    </Fragment>
  );
};

export default CadastrarProduto;
