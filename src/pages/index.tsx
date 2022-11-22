import React from "react";
import { Layout, Image } from "antd";
import MenuApp from "../components/Menu";
import { HomeOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const IndexPage: React.FC = () => {
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
              <HomeOutlined /> DASHBOARD
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
          <div className="index-content">
            <Image src="/vite.svg" width={300} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default IndexPage;
