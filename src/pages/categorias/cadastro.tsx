import React, { Fragment, useState, useEffect } from "react";
import { Layout, Image, Form, Input, Button, Modal, message } from "antd";
import MenuApp from "../../components/Menu";
import { SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import Uploader from "../../components/Uploader";
import { NotificationType } from "../../utils/types";
import { fetcher } from "../../configs/axios";
import { isAxiosError } from "axios";
import * as yup from "yup";
import { useFormik } from "formik";

const { Header, Sider, Content } = Layout;

interface CategoryProps {
  name: string;
  description?: string;
}

const CadastroCategorias: React.FC = () => {
  const [form] = Form.useForm();
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const openNotification = (type: NotificationType, content: string) => {
    message.open({
      type,
      content,
    });
  };

  useEffect(() => {
    if (!modalImage) {
      form.resetFields();
    }
  }, [modalImage]);

  async function createCategories(values: CategoryProps) {
    setLoading(true);
    try {
      const response = await fetcher.post("/categories", {
        name: values.name,
        description: values.description,
      });
      openNotification("success", response.data.message);
      setId(response.data.id);
      setModalImage(true);
      setLoading(false);
      form.resetFields();
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        let message = error.response?.data.message || "";
        openNotification("error", message);
      }
    }
  }

  const validationSchema = yup.object().shape({
    name: yup.string().required("Insira um nome"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createCategories(values);
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
                <SaveOutlined /> CADASTRO DE CATEGORIAS
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
              layout="horizontal"
              size="large"
              initialValues={{ name: "", description: "" }}
              form={form}
              onFinish={formik.handleSubmit}
            >
              <Form.Item
                label="Nome"
                required
                name="name"
                rules={[{ required: true, message: "Insira um nome" }]}
              >
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Form.Item>
              <Form.Item label="Descrição" name="description">
                <TextArea
                  rows={4}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                >
                  Salvar
                </Button>
              </Form.Item>
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
            to={`/thumbnailCateogry/${id}`}
            onFinish={setModalImage}
            mode="PUT"
          />
        </div>
      </Modal>
    </Fragment>
  );
};

export default CadastroCategorias;
