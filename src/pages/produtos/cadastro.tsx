import React, { Fragment, useState } from "react";
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
} from "antd";
import MenuApp from "../../components/Menu";
import { TagOutlined, SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import RichTextEditor from "react-rte";
import Uploader from "../../components/Uploader";

const { Header, Sider, Content } = Layout;

const CadastrarProduto: React.FC = () => {
  const [text, setText] = useState<any>(RichTextEditor.createEmptyValue());
  const [modalImage, setModalImage] = useState<boolean>(false);

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
            <Form size="large">
              <Form.Item label="Título" required>
                <Input />
              </Form.Item>
              <Row style={{ width: "100%" }}>
                <Col span={12}>
                  <Form.Item label="Categoria" required>
                    <Select
                      showSearch
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
                <Col span={12} style={{ paddingLeft: 10 }}>
                  <Form.Item label="Preço" required>
                    <Input addonAfter="R$" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Descrição curta">
                <TextArea rows={2} style={{ resize: "none" }} />
              </Form.Item>
              <Form.Item label="URL Vídeo Youtube">
                <Input />
              </Form.Item>
              <Form.Item label="Descrição" required>
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

              <Button type="primary" size="large" icon={<SaveOutlined />}>
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
          <Uploader width={"300px"} height="300px" to="/" />
        </div>
      </Modal>
    </Fragment>
  );
};

export default CadastrarProduto;
