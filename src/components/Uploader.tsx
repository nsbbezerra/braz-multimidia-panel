import { useEffect, useMemo, useState } from "react";
import {
  PictureOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Row, message, Spin } from "antd";
import { isAxiosError } from "axios";
import { fetcher } from "../configs/axios";

type CustomDataProps = {
  key: string;
  value: string;
};

interface Props {
  width: number | string;
  height: number | string;
  to: string;
  mode?: "POST" | "PUT";
  customData?: CustomDataProps[];
  onFinish: (data: boolean) => void;
  disabled?: boolean;
}

type NotificationType = "success" | "info" | "warning" | "error";

export default function Uploader({
  width,
  height,
  to,
  mode = "POST",
  customData = [],
  onFinish,
  disabled = false,
}: Props) {
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail as any);
    setThumbnail(undefined);
  }

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  function handleThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  const openNotification = (type: NotificationType, content: string) => {
    message.open({
      type: type,
      content,
      duration: 5,
    });
  };

  useEffect(() => {
    if (thumbnail) {
      let size = thumbnail.size;
      let sum = size / 1024;
      setSize(parseFloat(sum.toFixed(2)));
      if (sum > 500) {
        message.open({
          type: "error",
          content: "Arquivo muito grande insira um arquivo de até 500kb",
          duration: 5,
        });
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [thumbnail]);

  async function saveThumbnail() {
    if (!thumbnail) {
      openNotification("warning", "Selecione uma imagem");
      return false;
    }
    const data = new FormData();
    data.append("thumbnail", thumbnail);
    if (customData.length !== 0) {
      customData.map((cust) => data.append(cust.key, cust.value));
    }
    setLoading(true);
    try {
      if (mode === "POST") {
        const { data: responseData } = await fetcher.post(to, data);

        openNotification("success", responseData.message);

        onFinish(false);
      } else {
        const { data: responseData } = await fetcher.put(to, data);

        openNotification("success", responseData.message);

        onFinish(false);
      }
      setLoading(false);
      setThumbnail(undefined);
      removeThumbnail();
    } catch (error) {
      setLoading(false);
      if (isAxiosError(error) && error.message) {
        let message = error.response?.data.message || "";
        openNotification("error", message);
      }
    }
  }

  return (
    <Spin spinning={loading}>
      {!thumbnail ? (
        <label
          style={{
            width,
            height,
          }}
          htmlFor="file"
          className={
            disabled === true ? "label-uploaderd-disabled" : "label-uploader"
          }
        >
          <PictureOutlined style={{ fontSize: "50px", marginBottom: 10 }} />
          <span>
            Insira uma imagem {width} X {height}
          </span>
          <span>Tamanho máximo: 500kb</span>
          <input
            type={"file"}
            style={{ display: "none" }}
            id="file"
            onChange={(e) => {
              handleThumbnail(e.target.files);
            }}
            accept="image/*"
          />
        </label>
      ) : (
        <div
          style={{
            width,
          }}
        >
          <div
            style={{
              width,
              height,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Image
              src={preview}
              width={width}
              height={height}
              style={{
                objectFit: "cover",
              }}
            />
          </div>

          <Row style={{ marginTop: 10 }} gutter={10}>
            <Col span={12}>
              <Button
                block
                icon={<DeleteOutlined />}
                danger
                onClick={() => removeThumbnail()}
              >
                Excluir
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                type="primary"
                icon={<SaveOutlined />}
                disabled={isDisabled}
                onClick={() => saveThumbnail()}
                loading={loading}
              >
                Salvar
              </Button>
            </Col>
          </Row>

          <span>Tamanho: {size}kb</span>
        </div>
      )}
    </Spin>
  );
}
