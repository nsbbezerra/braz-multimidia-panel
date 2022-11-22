import { Fragment, useEffect, useMemo, useState } from "react";
import {
  PictureOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Row, message } from "antd";

interface Props {
  width: number | string;
  height: number | string;
  to: string;
}

export default function Uploader({ width, height, to }: Props) {
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);

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

  useEffect(() => {
    if (thumbnail) {
      let size = thumbnail.size;
      let sum = size / 1024;
      setSize(parseFloat(sum.toFixed(2)));
      if (sum > 500) {
        message.open({
          type: "error",
          content: "Arquivo muito grande insira um arquivo de até 500kb",
        });
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [thumbnail]);

  return (
    <Fragment>
      {!thumbnail ? (
        <label
          style={{
            width,
            height,
          }}
          htmlFor="file"
          className="label-uploader"
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
          <span>Tamanho: {size}kb</span>

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
              >
                Salvar
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </Fragment>
  );
}
