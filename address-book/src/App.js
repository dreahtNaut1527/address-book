import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Modal, Layout, Typography, Divider, Space, Popconfirm, notification, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Content, Header } from 'antd/es/layout/layout';
import ContactForm from './components/contact-form';
import axios from 'axios';
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
import 'antd/dist/reset.css';
import './App.css';


const API_BASE_URL = 'http://localhost:9090';

const { Title } = Typography;
const { TextArea } = Input;

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [form] = Form.useForm();
  const [selectedContact, setSelectedContact] = useState(null);

  // Edit Contact
  const [modalVisible, setModalVisible] = useState(false);

  // Add New Contact
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [api, contextHolder] = notification.useNotification();

  const columns = [
    { 
      title: 'Full Name', 
      render: (_, record) => (
        <span>
          {record.firstname} {record.lastname}
        </span>
      ),
      key: 'name' 
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Contact"><Button onClick={() => handleEditContact(record)} icon={<EditOutlined />} /></Tooltip>
          
          <Popconfirm
              title="Delete the contact"
              description="Are you sure to delete this contact?"
              onConfirm={() => handleDeleteContact(record.id)}
              okText="Yes"
              cancelText="No"
            >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const openNotification = (title, message, placement) => {
    api.info({
      message: title,
      description: message,
      duration: 2.1,
      placement
    })
  }

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    form.setFieldsValue({
      id: contact.id,
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email,
      address: contact.address,
      phonenumber: contact.phonenumber
    });
    setModalVisible(true);
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
      openNotification('Success', 'Contact has been deleted', 'topRight');
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contacts:', error);
    }
  };

  const handleSaveEdit = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/todos/${values.id}`, values)
      openNotification('Success', 'Contact saved', 'topRight');
      fetchContacts();
      setModalVisible(false);
    } catch (error) {
      console.error('Error edit contacts:', error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchContacts();
  };

  const handleCancel = () => {
    setSelectedContact(null)
    form.resetFields();
    form.setFieldsValue({
      id: null,
      firstname: null,
      lastname: null,
      email: null,
      address: null,
      phonenumber: null
    });
    setModalVisible(false);
  };

  return (
    <Layout>
      <Header 
        style={{
          position: 'sticky', 
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
        <Title style={{ color: 'white' }} level={2} color='secondary'>CASE TEST</Title>
      </Header>

      <Content style={{ padding: '20px 48px' }}>
        {contextHolder}
        <Divider orientation="left">Address Book</Divider>

        <div style={{textAlign: 'right', marginBottom: '20px'}}>
          <Button type="primary" htmlType="submit" onClick={showModal}>
            Add Contact
          </Button>
        </div>

        <ContactForm 
          isOpen={isModalOpen} 
          closeModal={closeModal} 
          dataFromParent={contacts} 
          setDataInModal={setContacts}
        />

        <Table dataSource={contacts} columns={columns} rowKey="id" />

        {/* View and Edit Details */}
        <Modal
          title="Edit Contact"
          open={modalVisible}
          onCancel={handleCancel}
          onOk={form.submit}
        >
          <Divider orientation="left"></Divider>
          <Form 
            form={form} 
            onFinish={handleSaveEdit}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 800 }}
          >
            <Form.Item name="id" style={{display: 'none'}}>
              <Input />
            </Form.Item>
            <Form.Item name="firstname" label="First Name" rules={[{ required: true, message: 'Fisrt Name is required' }]}>
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
      </Content>
    </Layout>
  );
};