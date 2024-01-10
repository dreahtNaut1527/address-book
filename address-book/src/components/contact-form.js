import { Divider, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";

const API_BASE_URL = 'http://localhost:9090';

const { TextArea } = Input;

const ModalComponent = ({ isOpen, closeModal, dataFromParent }) => {

  const [internalData, setInternalData] = useState([]);
  const [formContact] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  
  const handleAddContact = async (values) => {
    try {
      await axios.post(`${API_BASE_URL}/todos`, values)
      openNotification('Success', 'New contact saved', 'topRight');
      formContact.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const openNotification = (title, message, placement) => {
    api.info({
      message: title,
      description: message,
      duration: 2.1,
      placement
    })
  }
  
  useEffect(() => {
    setInternalData(dataFromParent);
  }, [dataFromParent]);

  return (
    <Modal
      title="Add new contact"
      open={isOpen}
      onCancel={() => {
        formContact.resetFields();
        closeModal();
      }}
      onOk={formContact.submit}
    >
      {contextHolder}
      <Divider orientation="left"></Divider>
      <Form 
        form={formContact} 
        onFinish={handleAddContact}
        labelCol={{ span: 6 }}
        style={{ maxWidth: 800 }}
      >
        <Form.Item name="id" style={{display: 'none'}}>
          <Input />
        </Form.Item>
        <Form.Item name="firstname" label="First Name" rules={[{ required: true, message: 'First Name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastname" label="Last Name" rules={[{ required: true, message: 'Last Name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email address' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Address is required' }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="phonenumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Phone number is required' }]}
        >
          <PhoneInput country={"ph"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalComponent;