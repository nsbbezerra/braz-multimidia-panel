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
  SaveOutlined,
  DollarOutlined,
  EditOutlined,
  NodeIndexOutlined,
  BoxPlotOutlined,
  CarOutlined,
  CheckOutlined,
  CreditCardOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { isAxiosError } from "axios";
import { fetcher } from "../configs/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { useFormik } from "formik";

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
  shippingCode: string;
  shippingInformation: string;
}

type OrderToPrintProps = {
  order: string;
  client: string;
  address: string;
  data: string;
  items: OrderItemsProps[];
  total: string;
};

type PaymentProps = {
  status: "paid" | "unpaid" | "no_payment_required";
  method: ["boleto" | "card"];
};

const Vendas: React.FC = () => {
  const queryClient = useQueryClient();
  const [formStatus] = Form.useForm();
  const [formShipping] = Form.useForm();
  const [search, setSearch] = useState<string>("all");
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [orders, setOrders] = useState<OrdersProps[]>([]);
  const [order, setOrder] = useState<OrdersProps | null>(null);
  const [modalOrder, setModalOrder] = useState<boolean>(false);
  const [modalShipping, setModalShipping] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentProps | null>(null);
  const [modalPaymentInfo, setModalPaymentInfo] = useState<boolean>(false);
  const [orderToPrint, setOrderToPrint] = useState<OrderToPrintProps | null>(
    null
  );

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

  function handleRoute(search: string) {
    switch (search) {
      case "all":
        return "all";

      case "client":
        return clientId;

      case "id":
        return id;

      default:
        return "all";
    }
  }

  async function findOrders() {
    const { data } = await fetcher.get(
      `/orders/${search}/${handleRoute(search)}`
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

  function handleShipping(id: string) {
    const result = orders.find((obj) => obj.id === id);
    formShipping.setFieldValue("shippingCode", result?.shippingCode);
    formShipping.setFieldValue(
      "shippingInformation",
      result?.shippingInformation
    );
    setOrderId(id);
    setModalShipping(true);
  }

  function handleStatus(id: string) {
    const result = orders.find((obj) => obj.id === id);
    formStatus.setFieldValue("orderStatus", result?.orderStatus);
    formStatus.setFieldValue("paymentStatus", result?.paymentStatus);
    setOrderStatus(result?.orderStatus || "");
    setPaymentStatus(result?.paymentStatus || "");
    setOrderId(id);
    setModalStatus(true);
  }

  async function findPaymentInformation(idOrder: string, checkoutId: string) {
    setLoading(true);
    setOrderId(idOrder);
    try {
      const { data } = await fetcher.get(
        `/order/payment/${checkoutId}/${idOrder}`
      );
      setPaymentInfo(data);
      setModalPaymentInfo(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        message.open({
          type: "error",
          content: error.response?.data.message,
        });
      }
    }
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
        <Button
          icon={
            (record.orderStatus === "payment" && <DollarOutlined />) ||
            (record.orderStatus === "design" && <EditOutlined />) ||
            (record.orderStatus === "finish" && <CheckOutlined />) ||
            (record.orderStatus === "packing" && <BoxPlotOutlined />) ||
            (record.orderStatus === "production" && <NodeIndexOutlined />) ||
            (record.orderStatus === "shipping" && <CarOutlined />)
          }
          size="small"
          block
          onClick={() => handleStatus(record.id)}
        >
          {(record.orderStatus === "design" && "Design") ||
            (record.orderStatus === "finish" && "Finalizado") ||
            (record.orderStatus === "packing" && "Preparando Envio") ||
            (record.orderStatus === "payment" && "Pagamento") ||
            (record.orderStatus === "production" && "Em Produção") ||
            (record.orderStatus === "shipping" && "Enviado")}
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
        <div style={{ display: "flex", gap: 2 }}>
          <Tag
            color={handlePaymentStatus(record.paymentStatus)}
            style={{
              fontSize: 13,
              padding: 2,
              width: "100%",
              textAlign: "center",
            }}
          >
            {(record.paymentStatus === "cancel" && "Cancelado") ||
              (record.paymentStatus === "paidOut" && "Aprovado") ||
              (record.paymentStatus === "refused" && "Recusado") ||
              (record.paymentStatus === "waiting" && "Aguardando")}
          </Tag>
          {record.checkoutId && (
            <Button
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 40 }}
              type="primary"
              onClick={() =>
                findPaymentInformation(record.id, String(record.checkoutId))
              }
              loading={orderId === record.id && loading}
            />
          )}
        </div>
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
              <Menu.Item onClick={() => findOrderToPrint(record.id)}>
                Imprimir Pedido
              </Menu.Item>
              <Menu.Item
                onClick={() => handleShipping(record.id)}
                disabled={record.orderStatus === "shipping" ? false : true}
              >
                Informações de Envio
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

  async function updateShipping(code: string, info: string) {
    setLoading(true);
    try {
      const { data } = await fetcher.put(`/orders/shipping/${orderId}`, {
        shippingCode: code,
        shippingInformation: info,
      });

      message.open({
        type: "success",
        content: data.message,
      });
      setModalShipping(false);
      setLoading(false);
      formShipping.resetFields();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        message.open({
          type: "error",
          content: error.response?.data.message,
        });
      }
    }
  }

  const handleShippingUpdate = useFormik({
    initialValues: {
      shippingCode: "",
      shippingInformation: "",
    },
    onSubmit: (values) => {
      updateShipping(values.shippingCode, values.shippingInformation);
    },
  });

  async function updateStatus() {
    setLoading(true);
    try {
      const { data } = await fetcher.put(`/orders/status/${orderId}`, {
        orderStatus,
        paymentStatus,
      });

      message.open({
        type: "success",
        content: data.message,
      });
      formStatus.resetFields();
      setOrderStatus("");
      setPaymentStatus("");
      setLoading(false);
      setModalStatus(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        message.open({
          type: "error",
          content: error.response?.data.message,
        });
      }
    }
  }

  async function findOrderToPrint(id: string) {
    setLoading(true);

    try {
      const { data } = await fetcher.get(`/print/${id}`);

      setOrderToPrint(data);

      setLoading(false);
      print();
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        message.open({
          type: "error",
          content: error.response?.data.message,
        });
      }
    }
  }

  function print() {
    const fakeIframe = document.createElement("iframe");
    document.body.appendChild(fakeIframe);
    let fakeContet = fakeIframe.contentWindow;
    fakeContet?.document.open();
    fakeContet?.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Imprimir</title>
        <style>
          * {
            font-family: Arial, Helvetica, sans-serif;
          }
          .header {
            width: 100%;
            border: 1px solid #444;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-radius: 10px;
            padding-bottom: 20px;
          }
          .items-grid {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
            border: 1px solid #444;
            border-radius: 10px;
            margin-top: 30px;
            overflow: hidden;
          }
          .item {
            display: flex;
            justify-content: center;
            padding: 10px;
            align-items: center;
            position: relative;
            border-bottom: 1px solid #444;
            gap: 10px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            align-items: center;
            position: relative;
            border: 1px solid #444;
            margin-top: 30px;
            border-radius: 10px;
            font-size: larger;
            font-weight: 700;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item img {
            width: 120px;
            height: 120px;
          }
          .item h3 {
            line-height: 10px;
            margin-top: 0px;
          }
          .item p {
            line-height: 10px;
          }
          .item-info {
            width: 100%;
          }
          .price {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: larger;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Pedido Nº: ${orderToPrint?.order}</h1>
          <span>Cliente: <strong>${orderToPrint?.client}</strong></span>
          <span>Endereço: <strong>${orderToPrint?.address}</strong></span>
          <span>Data: <strong>${orderToPrint?.data}</strong></span>
        </div>
    
        <div class="items-grid">
        ${orderToPrint?.items.map((item) => {
          return `
         <div class="item">
            <img
              src="${item.product.thumbnail}"
              class="item-image"
            />
            <div class="item-info">
              <h3>${item.product.name}</h3>
              <p>Categoria: ${item.product.category.name}</p>
              <p>Quantidade: ${item.quantity}</p>
              <p>Tamanho: ${item.size.size}</p>
    
              <span class="price">${parseFloat(
                item.total as string
              ).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>
          </div>
         `;
        })}
          
        </div>
    
        <div class="footer">
          <span>TOTAL A PAGAR</span>
          <span>${parseFloat(orderToPrint?.total as string).toLocaleString(
            "pt-br",
            {
              style: "currency",
              currency: "BRL",
            }
          )}</span>
        </div>
      </body>
    </html>    
    `);
    fakeContet?.document.close();
    fakeContet?.focus();
    fakeIframe.addEventListener("load", () => {
      fakeContet?.print();
      fakeIframe.remove();
    });
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
          <Button
            onClick={() => findOrderToPrint(order?.id as string)}
            type="primary"
          >
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
              <Descriptions.Item label="Número" span={3}>
                {order.id}
              </Descriptions.Item>
              <Descriptions.Item label="Data" span={3}>
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

      <Modal
        title="Informações de Envio"
        open={modalShipping}
        onCancel={() => setModalShipping(false)}
        footer={false}
      >
        <Form
          form={formShipping}
          initialValues={{ shippingCode: "", shippingInformation: "" }}
          size="large"
          onFinish={handleShippingUpdate.handleSubmit}
        >
          <Form.Item label="Informações" name={"shippingInformation"}>
            <TextArea
              rows={5}
              value={handleShippingUpdate.values.shippingInformation}
              onChange={handleShippingUpdate.handleChange}
            />
          </Form.Item>
          <Form.Item label="Código de Ratreio" name={"shippingCode"}>
            <Input
              value={handleShippingUpdate.values.shippingCode}
              onChange={handleShippingUpdate.handleChange}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: 0,
            }}
          >
            <Button
              icon={<SaveOutlined />}
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Status do Pedido"
        open={modalStatus}
        onCancel={() => setModalStatus(false)}
        footer={false}
      >
        <Form
          initialValues={{ orderStatus: "", paymentStatus: "" }}
          form={formStatus}
        >
          <Form.Item label="Stautus do Pedido" name={"orderStatus"}>
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
                { label: "1 - Pagamento", value: "payment" },
                { label: "2 - Design", value: "design" },
                { label: "3 - Produção", value: "production" },
                { label: "4 - Embalando", value: "packing" },
                { label: "5 - Enviado", value: "shipping" },
                { label: "6 - Finalizado", value: "finish" },
              ]}
              value={orderStatus}
              onChange={(e) => setOrderStatus(e)}
            />
          </Form.Item>
          {orderStatus === "payment" && (
            <Form.Item label="Stautus do Pagamento" name={"paymentStatus"}>
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
                  { label: "Aguardando", value: "waiting" },
                  { label: "Confirmado", value: "paidOut" },
                  { label: "Recusado", value: "refused" },
                  { label: "Cancelado", value: "cancel" },
                ]}
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e)}
              />
            </Form.Item>
          )}
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: 0,
            }}
          >
            <Button
              icon={<SaveOutlined />}
              type="primary"
              loading={loading}
              size="large"
              onClick={() => updateStatus()}
            >
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Informações do Pagamento"
        open={modalPaymentInfo}
        onCancel={() => setModalPaymentInfo(false)}
        footer={[<Button type="primary">Fechar</Button>]}
        width={400}
      >
        {paymentInfo && (
          <Fragment>
            <Tag
              icon={<CheckOutlined />}
              style={{ width: "100%", fontSize: 18, padding: 10 }}
              color={
                paymentInfo.status === "no_payment_required"
                  ? "default"
                  : "default" || paymentInfo.status === "paid"
                  ? "success"
                  : "default" || paymentInfo.status === "unpaid"
                  ? "error"
                  : "default"
              }
            >
              {paymentInfo.status === "no_payment_required"
                ? "Sem Pagamento"
                : "default" || paymentInfo.status === "paid"
                ? "Confirmado"
                : "default" || paymentInfo.status === "unpaid"
                ? "Não Pago"
                : "default"}
            </Tag>
            <Divider>Formas de Pagamento</Divider>
            {paymentInfo.method.map((met) => {
              return met === "boleto" ? (
                <Text code style={{ fontSize: 18 }}>
                  <BarcodeOutlined /> Boleto
                </Text>
              ) : (
                <Text code style={{ fontSize: 18 }}>
                  <CreditCardOutlined /> Cartão
                </Text>
              );
            })}
          </Fragment>
        )}
      </Modal>
    </Fragment>
  );
};

export default Vendas;
