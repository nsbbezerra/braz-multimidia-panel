import React, { useRef, useState, useEffect } from "react";
import {
  Layout,
  Image,
  Dropdown,
  Menu,
  Button,
  Switch,
  Avatar,
  Modal,
  Form,
  Input,
  Space,
  InputRef,
  message,
  Spin,
} from "antd";
import MenuApp from "../../components/Menu";
import {
  OrderedListOutlined,
  ToolOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import { formatMoney } from "../../utils/functions";
import Uploader from "../../components/Uploader";
import TextArea from "antd/es/input/TextArea";
import RichTextEditor from "react-rte";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { fetcher } from "../../configs/axios";

const { Header, Sider, Content } = Layout;

type CategoryProps = {
  id: string;
  name: string;
};

interface DataProps {
  id: string;
  active: boolean;
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  video?: string;
  thumbnail: string;
  thumbnailId: string;
  category: CategoryProps;
}

type DataIndex = keyof DataProps;

const ListarProdutos: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [products, setProducts] = useState<DataProps[]>([]);
  const [id, setId] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [description, setDescription] = useState<any>(
    RichTextEditor.createEmptyValue()
  );
  const [price, setPrice] = useState<number>(0);
  const [video, setVideo] = useState<string>("");

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [loading, setLoading] = useState<boolean>(false);

  function clearAll() {
    setName("");
    setDescription(RichTextEditor.createEmptyValue());
    setShortDescription("");
    setPrice(0);
    setVideo("");
    form.resetFields();
  }

  useEffect(() => {
    !modalImage && queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [modalImage]);

  async function findProducts() {
    try {
      const { data: productsData } = await fetcher.get("/products");
      return productsData;
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

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: findProducts,
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
      setProducts(data);
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

  function handleSearchImage(key: string) {
    setId(key);
    setModalImage(true);
  }

  function handleSearchProduct(key: string) {
    const result = products.find((obj) => obj.id === key);
    setId(key);
    setName(String(result?.name));
    setPrice(Number(result?.price));
    setDescription(
      RichTextEditor.createValueFromString(String(result?.description), "html")
    );
    setShortDescription(result?.shortDescription || "");
    setVideo(result?.video || "");
    form.setFieldValue("name", result?.name);
    form.setFieldValue("price", parseFloat(result?.price as string));
    form.setFieldValue("shortDescription", result?.shortDescription);
    form.setFieldValue(
      "description",
      RichTextEditor.createValueFromString(String(result?.description), "html")
    );
    form.setFieldValue("video", result?.video);

    setModalInfo(true);
  }

  async function active(key: string, active: boolean) {
    setId(key);
    setLoading(true);
    try {
      const response = await fetcher.put(`/products/active/${key}`, {
        active,
      });
      message.open({
        type: "success",
        content: response.data.message,
      });
      setLoading(false);
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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataProps> => ({
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
            style={{ width: 90 }}
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

  const columns: ColumnsType<DataProps> = [
    {
      key: "active",
      title: "Ativo?",
      dataIndex: "active",
      render: (_, record) => (
        <Switch
          defaultChecked={record.active}
          onChange={(e) => active(record.id, e)}
          loading={id === record.id && loading === true}
        />
      ),
      width: "5%",
      align: "center",
    },
    {
      key: "thumbnail",
      title: "Thumb",
      dataIndex: "thumbnail",
      render: (_, record) => (
        <Avatar src={<Image src={record.thumbnail} />} size="large" />
      ),
      width: "5%",
      align: "center",
    },
    {
      key: "name",
      title: "Nome",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      key: "category",
      title: "Categoria",
      dataIndex: "category.name",
      render: (_, record) => <span>{record.category.name}</span>,
    },
    {
      key: "shortDescription",
      title: "Descrição Curta",
      dataIndex: "shortDescription",
    },
    Table.EXPAND_COLUMN,
    {
      key: "descriptio",
      title: "Descrição",
      dataIndex: "description",
      render: (_, record) => <span>Veja a descrição</span>,
    },
    {
      key: "price",
      title: "Preço",
      dataIndex: "price",
      render: (_, record) => <span>{formatMoney(record.price)}</span>,
      width: "12%",
      align: "right",
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
              <Menu.Item onClick={() => handleSearchImage(record.id)}>
                Alterar Imagem
              </Menu.Item>
              <Menu.Item onClick={() => handleSearchProduct(record.id)}>
                Alterar Informações
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

  async function UpdateProduct() {
    try {
      setLoading(true);
      let textConvert = description.toString("html");
      let videoUrlConvert =
        video === "" ? "" : video.replace("watch?v=", "embed/");
      const response = await fetcher.put(`/products/update/${id}`, {
        description: textConvert,
        name,
        price,
        shortDescription,
        video: videoUrlConvert,
      });
      message.open({
        type: "success",
        content: response.data.message,
      });
      setLoading(false);
      setModalInfo(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
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

  return (
    <Spin spinning={isLoading}>
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
                <OrderedListOutlined /> LISTAGEM DE PRODUTOS
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
            <Table
              columns={columns}
              dataSource={products}
              size="middle"
              pagination={{ pageSize: 20 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div
                    dangerouslySetInnerHTML={{ __html: record.description }}
                  />
                ),
              }}
            />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Thumbnail"
        open={modalImage}
        footer={false}
        width={"350px"}
        onCancel={() => setModalImage(false)}
      >
        <Uploader
          width={"300px"}
          height="300px"
          to={`/products/updateThumbnail/${id}`}
          onFinish={setModalImage}
          mode="PUT"
        />
      </Modal>

      <Modal
        open={modalInfo}
        onOk={() => UpdateProduct()}
        onCancel={() => setModalInfo(false)}
        title="Alterar Informações"
        okText="Salvar"
        cancelText="Cancelar"
        width={"50%"}
        okButtonProps={{ loading: loading }}
      >
        <Form size="large" form={form}>
          <Form.Item
            label="Título"
            required
            name={"name"}
            rules={[{ required: true, message: "Insira um nome" }]}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Preço"
            required
            name="price"
            rules={[{ required: true, message: "Insira um preço" }]}
          >
            <Input
              addonAfter="R$"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Descrição curta" name={"shortDescription"}>
            <TextArea
              rows={2}
              style={{ resize: "none" }}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="URL Vídeo Youtube" name={"video"}>
            <Input value={video} onChange={(e) => setVideo(e.target.value)} />
          </Form.Item>
          <Form.Item label="Descrição" name={"description"}>
            <RichTextEditor
              value={description}
              onChange={(e) => setDescription(e)}
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
        </Form>
      </Modal>
    </Spin>
  );
};

export default ListarProdutos;
