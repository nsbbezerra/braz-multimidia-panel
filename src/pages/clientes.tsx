import React, { useRef, useState, useEffect } from "react";
import {
  Layout,
  Image,
  Table,
  InputRef,
  Input,
  Space,
  Button,
  notification,
  Spin,
  message,
} from "antd";
import MenuApp from "../components/Menu";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { fetcher } from "../configs/axios";
import { NotificationType } from "../utils/types";

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  comp?: string;
  district: string;
  cep: string;
  city: string;
  state: string;
}

const { Header, Sider, Content } = Layout;

const Clientes: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  type DataIndex = keyof DataType;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [clients, setClients] = useState<DataType[]>([]);

  const openNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  async function findClients() {
    try {
      const { data } = await fetcher.get("/clients");
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.message) {
        let message = error.response?.data.message || "";
        openNotification("error", "Erro", message);
      }
    }
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: findClients,
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
      setClients(data);
    }
  }, [data, error]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            block
          >
            Buscar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record["name"]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    { title: "Documento", dataIndex: "document", key: "document" },
    { title: "Telefone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    Table.EXPAND_COLUMN,
    {
      title: "Endereço",
      dataIndex: "street",
      key: "street",
      ellipsis: true,
      width: "10%",
    },
  ];

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
              <UserOutlined /> CLIENTES
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
          <Spin spinning={isLoading}>
            <Table
              size="middle"
              columns={columns}
              pagination={{ pageSize: 20 }}
              expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{ margin: 0 }}
                  >{`${record.street}, Nº: ${record.number}, setor: ${record.district}, CEP: ${record.cep}, ${record.city}-${record.state}`}</p>
                ),
              }}
              dataSource={clients}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Clientes;
