import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Avatar, message } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

function ManageSubscription() {

return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center">
          <Dropdown menu={{ items }} placement="bottomRight">
            <div>
              <Avatar size="large" icon={<UserOutlined />} className="cursor-pointer" />
            </div>
          </Dropdown>
        </div>
      </div>
      <div className="pt-16">
        <h1>Home Page</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ManageSubscription;