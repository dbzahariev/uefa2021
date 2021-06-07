// eslint-disable-next-line
import React, { useState } from "react";
import { Button, Checkbox, InputNumber, Modal, Space } from "antd";

export let AutoRefreshInterval: number | "disable" = "disable";

export default function AutoRefresh({ refresh }: { refresh: Function }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newInterval, setNewInterval] =
    useState<number | "disable">(AutoRefreshInterval);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    AutoRefreshInterval = newInterval;
    refresh();
  };

  const onChangeAllowRefresh = (event: any) => {
    let newValue = event.target.checked;
    let newInterval2: number | "disable";
    if (newValue) {
      newInterval2 = "disable";
    } else {
      newInterval2 = 30;
    }
    setNewInterval(newInterval2);
  };

  return (
    <div>
      <Space direction={"horizontal"}>
        <>
          <Button type="primary" onClick={showModal}>
            Open Modal
          </Button>
          <Modal
            title="Basic Modal"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={() => {
              setIsModalVisible(false);
            }}
          >
            <Space direction={"vertical"}>
              <Checkbox
                onChange={onChangeAllowRefresh}
                defaultChecked={newInterval === "disable"}
              >
                Auto refresh
              </Checkbox>
              <InputNumber
                disabled={newInterval === "disable"}
                min={30}
                step={5}
                max={180}
                defaultValue={30}
                value={newInterval === "disable" ? 30 : newInterval}
                onChange={(value: number) => {
                  setNewInterval(value);
                }}
              />
            </Space>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </>
        {`inter, ${AutoRefreshInterval}`}
      </Space>
    </div>
  );
}