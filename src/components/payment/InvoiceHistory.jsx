import React, { useState, useEffect } from 'react';
import { List, Typography, message, Tag, Divider, Pagination } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import TopNavbar from '../Navbar/TopNavbar';

const { Text } = Typography;

const InvoiceHistory = ({ userEmail }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Default page size

  const fetchInvoiceHistory = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`/request/invoice-history?page=${page}&limit=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice history');
      }
      const result = await response.json();
      console.log(result.data);
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceHistory(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="invoice-history" style={{ paddingLeft: "100px", paddingRight: "100px" }}>
      <TopNavbar />
      <Text strong className="mb-4" style={{ fontSize: '16px' }}>INVOICE HISTORY</Text>
      <Divider />
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => {
          // Remove single quotes from the URL
          const cleanUrl = item.invoice_url.replace(/'/g, '');

          return (
            <>
              <p>
                <Tag style={{ paddingRight: "50px", borderColor: "white" }}>{item.date}</Tag>
                <a href={cleanUrl} style={{ paddingRight: "50px" }} target="_blank" rel="noopener noreferrer">
                  <ExportOutlined />
                </a>
                
                <Tag style={{ paddingRight: "50px", borderColor: "white" }}>{item.product}</Tag>
                <Tag style={{ paddingRight: "50px", borderColor: "white" }}>{item.amount}</Tag>
                <Tag color="green" style={{ marginLeft: '8px' }}>Paid</Tag>
              </p>
              <Divider />
            </>
          );
        }}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '16px' }}
      />
    </div>
  );
};

export default InvoiceHistory;
