import React, { Fragment, useRef, useState } from "react";
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
} from "antd";
import MenuApp from "../../components/Menu";
import {
  OrderedListOutlined,
  ToolOutlined,
  DeleteOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType, ColumnType } from "antd/es/table";
import { formatMoney } from "../../utils/functions";
import Uploader from "../../components/Uploader";
import TextArea from "antd/es/input/TextArea";
import RichTextEditor from "react-rte";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const { Header, Sider, Content } = Layout;

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
}

type DataIndex = keyof DataProps;

const ListarProdutos: React.FC = () => {
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [text, setText] = useState<any>(RichTextEditor.createEmptyValue());

  const data: DataProps[] = [
    {
      id: "1",
      name: "John Brown",
      description: "Descrição",
      active: true,
      thumbnail: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      thumbnailId: "id",
      shortDescription: "Descrição curta",
      price: "1000",
      video: "https://www.youtube.com/embed/EMrNBMCaQFA",
    },
    {
      id: "2",
      name: "John Brown",
      description: "Descrição",
      active: true,
      thumbnail: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      thumbnailId: "id",
      shortDescription: "Descrição curta",
      price: "1000",
      video: "https://www.youtube.com/embed/EMrNBMCaQFA",
    },
    {
      id: "3",
      name: "John Brown",
      description: "Descrição",
      active: true,
      thumbnail: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
      thumbnailId: "id",
      shortDescription: "Descrição curta",
      price: "1000",
      video: "https://www.youtube.com/embed/EMrNBMCaQFA",
    },
  ];

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
      record[dataIndex]
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
      render: (_, record) => <Switch defaultChecked={record.active} />,
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
      title: "Título",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      key: "category",
      title: "Categoria",
      dataIndex: "name",
    },
    Table.EXPAND_COLUMN,
    {
      key: "description",
      title: "Descrição",
      dataIndex: "description",
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
              <Menu.Item onClick={() => setModalImage(true)}>
                Alterar Imagem
              </Menu.Item>
              <Menu.Item onClick={() => setModalInfo(true)}>
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
              dataSource={data}
              size="middle"
              pagination={{ pageSize: 20 }}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>{record.description}</p>
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
        {true ? (
          <div>
            <div
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <Image
                width={"300px"}
                height="300px"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                style={{ objectFit: "cover" }}
              />
            </div>
            <Button block icon={<DeleteOutlined />} danger>
              Excluir Imagem
            </Button>
          </div>
        ) : (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Uploader width={"300px"} height="300px" to="/" />
          </div>
        )}
      </Modal>

      <Modal
        open={modalInfo}
        onOk={() => {}}
        onCancel={() => setModalInfo(false)}
        title="Alterar Informações"
        okText="Salvar"
        cancelText="Cancelar"
        width={"50%"}
      >
        <Form size="large">
          <Form.Item label="Título" required>
            <Input />
          </Form.Item>
          <Form.Item label="Preço" required>
            <Input addonAfter="R$" />
          </Form.Item>
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
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ListarProdutos;
