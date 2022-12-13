import React, { Fragment, useEffect, useState } from "react";
import {
  Layout,
  Image,
  Row,
  Col,
  Select,
  Form,
  Input,
  Divider,
  message,
  Table,
  Spin,
  Button,
  Tag,
  Dropdown,
  Menu,
  Modal,
  Descriptions,
  Card,
  Space,
  Typography,
} from "antd";
import MenuApp from "../components/Menu";
import {
  ShoppingOutlined,
  SearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { isAxiosError } from "axios";
import { fetcher } from "../configs/axios";
import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface ClientProps {
  id: string;
  name: string;
}

type SizeProps = {
  size: string;
};

type ProductProps = {
  id: string;
  name: string;
  price: string;
  thumbnail: string;
  category: CategoryProps;
};

type CategoryProps = {
  name: string;
};

type OrderItemsProps = {
  id: string;
  product: ProductProps;
  quantity: number;
  size: SizeProps;
  total: string;
};

interface OrdersProps {
  id: string;
  checkoutId?: string;
  observation: string;
  orderStatus:
    | "payment"
    | "design"
    | "production"
    | "packing"
    | "shipping"
    | "finish";
  paymentStatus: "waiting" | "paidOut" | "refused" | "cancel";
  client: ClientProps;
  OrderItems: OrderItemsProps[];
  total: string;
  createdAt: Date;
}

const Vendas: React.FC = () => {
  const [search, setSearch] = useState<string>("all");
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [orders, setOrders] = useState<OrdersProps[]>([]);
  const [order, setOrder] = useState<OrdersProps | null>(null);
  const [modalOrder, setModalOrder] = useState<boolean>(false);
  const [modalShipping, setModalShipping] = useState<boolean>(false);

  useEffect(() => {
    async function findClients() {
      try {
        const { data } = await fetcher.get("/clients");
        setClients(data);
      } catch (error) {
        if (isAxiosError(error) && error.message) {
          message.open({
            type: "error",
            content: error.response?.data.message,
          });
        }
      }
    }
    findClients();
  }, []);

  async function findOrders() {
    const { data } = await fetcher.get(
      `/orders/${search}/${
        (search === "id" && id) ||
        (search === "client" && clientId) ||
        (search === "all" && id)
      }`
    );

    return data;
  }

  const { isLoading, data, refetch } = useQuery({
    queryFn: findOrders,
    queryKey: ["orders"],
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const handlePaymentStatus = (
    payment: "waiting" | "paidOut" | "refused" | "cancel"
  ) => {
    switch (payment) {
      case "cancel":
        return "error";
      case "paidOut":
        return "success";
      case "refused":
        return "default";
      case "waiting":
        return "warning";
      default:
        return "default";
    }
  };

  function formateDate(date: Date) {
    const initialDate = new Date(date);
    const day = initialDate.getDate();
    const month = initialDate.toLocaleString("pt-br", { month: "long" });
    const year = initialDate.getFullYear();

    return `${day} de ${month} de ${year}`;
  }

  function handleOrder(id: string) {
    const result = orders.find((obj) => obj.id === id);
    setOrder(result || null);
    setModalOrder(true);
  }

  const columns: ColumnsType<OrdersProps> = [
    {
      title: "Cliente",
      dataIndex: "client",
      key: "name",
      render: (_, record) => <span>{record.client.name}</span>,
    },
    {
      title: "Valor",
      dataIndex: "price",
      key: "price",
      width: "12%",
      render: (_, record) => (
        <span>
          {parseFloat(record.total).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      ),
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      width: "12%",
      render: (_, record) => (
        <Button type="primary" size="small" block>
          {(record.orderStatus === "design" && "Design") ||
            (record.orderStatus === "finish" && "Finalizada") ||
            (record.orderStatus === "packing" && "Preparando Envio") ||
            (record.orderStatus === "payment" && "Pagamento") ||
            (record.orderStatus === "production" && "Em Produção") ||
            (record.orderStatus === "shipping" && "Enviada")}
        </Button>
      ),
      align: "center",
    },
    {
      title: "Pagamento",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      width: "12%",
      render: (_, record) => (
        <Tag
          color={handlePaymentStatus(record.paymentStatus)}
          style={{ fontSize: 13, padding: 2 }}
        >
          {(record.paymentStatus === "cancel" && "Cancelado") ||
            (record.paymentStatus === "paidOut" && "Aprovado") ||
            (record.paymentStatus === "refused" && "Recusado") ||
            (record.paymentStatus === "waiting" && "Aguardando")}
        </Tag>
      ),
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "18%",
      render: (_, record) => (
        <span>{formateDate(new Date(record.createdAt))}</span>
      ),
    },
    {
      title: "Opções",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          overlay={() => (
            <Menu>
              <Menu.Item onClick={() => handleOrder(record.id)}>
                Visualizar Pedido
              </Menu.Item>
              <Menu.Item onClick={() => {}}>Imprimir Pedido</Menu.Item>
              <Menu.Item onClick={() => {}}>Informações de Envio</Menu.Item>
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
                <ShoppingOutlined /> VENDAS
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
              <Col span={10}>
                <Form.Item label="Busca">
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
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={[
                      { label: "Todas as vendas", value: "all" },
                      { label: "Buscar por cliente", value: "client" },
                      { label: "Buscar por número", value: "id" },
                    ]}
                    value={search}
                    onChange={(e) => setSearch(e)}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                {search === "all" && (
                  <Form.Item label="Digite para buscar">
                    <Input disabled size="large" />
                  </Form.Item>
                )}
                {search === "id" && (
                  <Form.Item label="Digite para buscar">
                    <Input
                      size="large"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </Form.Item>
                )}
                {search === "client" && (
                  <Form.Item label="Selecione o Cliente">
                    <Select
                      showSearch
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Selecione uma opção"
                      optionFilterProp="children"
                      disabled={clients.length === 0 ? true : false}
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={clients.map((cli) => {
                        return { label: cli.name, value: cli.id };
                      })}
                      value={clientId}
                      onChange={(e) => setClientId(e)}
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={4}>
                <Button
                  size="large"
                  block
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => refetch()}
                >
                  Buscar
                </Button>
              </Col>
            </Row>

            <Divider style={{ marginTop: -5 }} />

            <Spin spinning={isLoading}>
              <Table
                size="middle"
                columns={columns}
                pagination={{ pageSize: 20 }}
                dataSource={orders}
              />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Informações do Pedido"
        open={modalOrder}
        onCancel={() => setModalOrder(false)}
        footer={[
          <Button onClick={() => setModalOrder(false)}>Fechar</Button>,
          <Button onClick={() => setModalOrder(false)} type="primary">
            Imprimir
          </Button>,
        ]}
        width={700}
      >
        {order && (
          <Fragment>
            <Descriptions bordered size={"middle"}>
              <Descriptions.Item label="Cliente" span={3}>
                {order.client.name}
              </Descriptions.Item>
              <Descriptions.Item label="Número" span={2}>
                {order.id}
              </Descriptions.Item>
              <Descriptions.Item label="Data" span={1}>
                {formateDate(new Date(order.createdAt))}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                {(order.orderStatus === "design" && "Design") ||
                  (order.orderStatus === "finish" && "Finalizada") ||
                  (order.orderStatus === "packing" && "Embalando") ||
                  (order.orderStatus === "payment" && "Pagamento") ||
                  (order.orderStatus === "production" && "Produzindo") ||
                  (order.orderStatus === "shipping" && "Enviado")}
              </Descriptions.Item>
              <Descriptions.Item label="Pagamento" span={1}>
                {(order.paymentStatus === "cancel" && "Cancelado") ||
                  (order.paymentStatus === "paidOut" && "Confirmado") ||
                  (order.paymentStatus === "refused" && "Recusado") ||
                  (order.paymentStatus === "waiting" && "Aguardando")}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Itens</Divider>

            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              {order.OrderItems.map((item) => (
                <Card size="small" key={item.id}>
                  <Row gutter={10}>
                    <Col span={4}>
                      <div>
                        <Image src={item.product.thumbnail} />
                      </div>
                    </Col>
                    <Col span={20}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Title level={5}>{item.product.name}</Title>
                          <Text>Categoria: {item.product.category.name}</Text>
                          <div style={{ display: "flex" }}>
                            <Text code>Tamanho: {item.size.size}</Text>
                            <Text code>Quantidade: {item.quantity}</Text>
                          </div>
                        </div>
                        <div>
                          <Title level={5}>
                            {parseFloat(item.total).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Title>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
            <Divider>Resumo</Divider>
            <Descriptions bordered size={"middle"}>
              <Descriptions.Item label="Total do Pedido" span={3}>
                <strong>
                  {parseFloat(order.total).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </Descriptions.Item>
            </Descriptions>
          </Fragment>
        )}
      </Modal>
    </Fragment>
  );
};

export default Vendas;
