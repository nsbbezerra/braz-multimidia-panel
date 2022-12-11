import React, { useEffect, useState } from "react";
import {
  Layout,
  Image,
  Form,
  Select,
  Divider,
  Card,
  Badge,
  Input,
  message,
  Button,
} from "antd";
import MenuApp from "../components/Menu";
import { FileImageOutlined, DeleteOutlined } from "@ant-design/icons";
import Uploader from "../components/Uploader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { fetcher } from "../configs/axios";

const { Header, Sider, Content } = Layout;

interface BannerProps {
  id: string;
  banner: string;
  bannerId: string;
  redirect?: string;
  origin: "index" | "products" | "catalog" | "cart" | "product" | "other";
}

const Banners: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [page, setPage] = useState<string>("index");
  const [redirect, setRedirect] = useState<string>("");
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [bannerId, setBannerId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function finish(data: boolean) {
    setRedirect("");
    refetch();
  }

  async function findBanner() {
    try {
      const { data } = await fetcher.get(`/banners/${page}`);
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["banners"],
    queryFn: findBanner,
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (error) {
      message.open({
        type: "error",
        content: (error as Error).message,
      });
    }
    if (data) {
      setBanners(data);
    }
  }, [data, error]);

  useEffect(() => {
    refetch();
  }, [page]);

  async function DeleteBanner(id: string) {
    setBannerId(id);
    setLoading(true);

    try {
      const response = await fetcher.delete(`/banners/${id}`);
      message.open({
        type: "success",
        content: response.data.message,
      });
      setBannerId("");
      setLoading(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    } catch (error) {
      setBannerId("");
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
              <FileImageOutlined /> BANNERS DO SITE
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
          <Form size="large" initialValues={{ page: "index" }} form={form}>
            <Form.Item label="Selecione uma página:" name={"page"}>
              <Select
                showSearch
                placeholder="Selecione um opção"
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
                    value: "index",
                    label: "Página Principal",
                  },
                  {
                    value: "products",
                    label: "Página de Listagem de Produtos",
                  },
                  {
                    value: "product",
                    label: "Página de Informação de um Produto",
                  },
                  {
                    value: "catalog",
                    label: "Página de Catálogo",
                  },
                  {
                    value: "cart",
                    label: "Página do Carrinho",
                  },
                  {
                    value: "other",
                    label: "Páginas Gerais",
                  },
                ]}
                value={page}
                onChange={(e) => setPage(e)}
              />
            </Form.Item>
          </Form>

          <Divider />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  page === "index" ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
                gap: 20,
              }}
            >
              {banners.map((bann) => (
                <Badge.Ribbon
                  color={page !== "index" ? "green" : "blue"}
                  text={page !== "index" ? "Banner Único" : "Múltiplos Banners"}
                  key={bann.id}
                >
                  <Card
                    title="Banner"
                    size="small"
                    actions={[
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          paddingLeft: 20,
                        }}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => DeleteBanner(bann.id)}
                          loading={
                            bann.id === bannerId && loading ? true : false
                          }
                        >
                          Excluir
                        </Button>
                      </div>,
                    ]}
                  >
                    <Image
                      src={bann.banner}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    {bann.redirect && (
                      <>
                        <label>Ao clicar, ir para: </label>
                        <a href={bann.redirect} target="_blank">
                          {bann.redirect}
                        </a>
                      </>
                    )}
                  </Card>
                </Badge.Ribbon>
              ))}
            </div>
            {page !== "index" && banners.length >= 1 ? (
              ""
            ) : (
              <Badge.Ribbon
                color={page !== "index" ? "green" : "blue"}
                text={page !== "index" ? "Banner Único" : "Múltiplos Banners"}
              >
                <Card title="Banner" size="small">
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "repeat(1, 1fr)",
                      justifyContent: "center",
                      justifyItems: "center",
                    }}
                  >
                    {page === "index" && (
                      <>
                        <label>URL de Redirecionamento (Opcional)</label>
                        <Input
                          style={{ maxWidth: "1000px" }}
                          size="large"
                          value={redirect}
                          onChange={(e) => setRedirect(e.target.value)}
                        />
                      </>
                    )}
                    <label style={{ marginTop: 10 }}>Banner:</label>
                    <Uploader
                      to="/banners"
                      mode="POST"
                      onFinish={finish}
                      width="1000px"
                      height={page === "index" ? "375px" : "231px"}
                      label={
                        page === "index"
                          ? "Insira uma imagem 1920px X 720px"
                          : "Insira uma imagem 1920px X 460px"
                      }
                      customData={[
                        { key: "origin", value: page },
                        { key: "redirect", value: redirect },
                      ]}
                    />
                  </div>
                </Card>
              </Badge.Ribbon>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Banners;
