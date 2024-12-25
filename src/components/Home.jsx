import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, Form, Select, message, AutoComplete, Statistic } from 'antd';
import { SearchOutlined, BarChartOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import TopNavbar from './Navbar/TopNavbar';
import './Home.css';

const { Option } = Select;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [securityName, setSecurityName] = useState('Apple');
  const [lastWeek, setLastWeek] = useState('');
  const [lastMonth, setLastMonth] = useState('');
  const [lastYear, setLastYear] = useState('');
  const [lastTwoYears, setLastTwoYears] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedStock) {
      fetchStockData(selectedStock);
    }
  }, [selectedStock]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (values) => {
    // Add to list logic here
    console.log(values);
  };

  const fetchStockData = async (stockName) => {
    try {
      const response = await fetch('request/getStockData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stockName, timeframe: '3y' }), // Example timeframe
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();

      // Update state with fetched data
      setSecurityName(data.security);
      setLastWeek(data.last_5_days_change);
      setLastMonth(data.last_20_days_change);
      setLastYear(data.last_100_days_change);
      setLastTwoYears(data.last_200_days_change);
      setCurrentPrice(data.last_price);
    } catch (error) {
      message.error('Error fetching stock data');
      console.error('Error fetching stock data:', error);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`request/getSymbols?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      message.error('Error fetching suggestions');
      console.error('Error fetching suggestions:', error);
    }
  };

  const getIconAndColor = (value) => {
    if (value > 0) {
      return <RiseOutlined style={{ color: 'green' }} />;
    } else if (value < 0) {
      return <FallOutlined style={{ color: 'red' }} />;
    } else {
      return null;
    }
  };

  return (
    <>
      <TopNavbar />
      <Row
  style={{ paddingTop: '80px' }}
  justify="center"
  align="middle"
  gutter={[16, 16]} // Add spacing if needed
>
  <Col xs={24} sm={18} md={12} lg={10} xl={8}>
    <AutoComplete
      value={searchTerm}
      onChange={handleSearchChange}
      onSelect={(value) => setSelectedStock(value)}
      options={suggestions.map((suggestion) => ({ value: suggestion }))}
      style={{ width: '100%' }} // Ensure AutoComplete takes full width of Col
    >
      <Input
        type="text"
        id="searchInput"
        placeholder="Search Stock ..."
        required
        prefix={<SearchOutlined />}
        style={{ width: '100%' }} // Input also takes full width of AutoComplete
      />
    </AutoComplete>
  </Col>
</Row>

      <Row
  style={{ paddingTop: '50px' }}
  justify="center"
  align="middle"
  gutter={[16, 16]} // Spacing between columns and rows
>
  <Col xs={24} sm={24} md={8} lg={6} xl={6}>
    <div className="stat-cards-item">
      <div className="stat-cards-icon primary">
        <BarChartOutlined />
      </div>
      <div className="stat-cards-info">
        <p className="stat-cards-info__num">{selectedStock}</p>
        <p className="stat-cards-info__num">{securityName}</p>
        <p className="stat-cards-info__progress">
          <span className="stat-cards-info__profit">
            {getIconAndColor(lastWeek)}
            <span>{lastWeek}</span>
          </span>
          <span> % Last 5 days</span>
        </p>
        <p className="stat-cards-info__progress">
          <span className="stat-cards-info__profit">
            {getIconAndColor(lastMonth)}
            <span>{lastMonth}</span>
          </span>
          <span> % Last 20 days</span>
        </p>
        <p className="stat-cards-info__progress">
          <span className="stat-cards-info__profit">
            {getIconAndColor(lastYear)}
            <span>{lastYear}</span>
          </span>
          <span> % Last 100 days</span>
        </p>
        <p className="stat-cards-info__progress">
          <span className="stat-cards-info__profit">
            {getIconAndColor(lastTwoYears)}
            <span>{lastTwoYears}</span>
          </span>
          <span> % Last 200 days</span>
        </p>
      </div>
    </div>
  </Col>
  <Col xs={24} sm={24} md={8} lg={6} xl={6}>
    <div className="stat-cards-item">
      <div className="stat-cards-icon primary">
        <BarChartOutlined />
      </div>
      <div className="stat-cards-info">
        <p className="stat-cards-info__num">Price</p>
        <p className="stat-cards-info__num">
          <Statistic value={currentPrice} />
        </p>
      </div>
    </div>
  </Col>
  <Col xs={24} sm={24} md={8} lg={6} xl={6}>
    <div className="stat-cards-item">
      <div className="stat-cards-icon primary">
        <BarChartOutlined />
      </div>
      <div className="stat-cards-info">
        <Form form={form} onFinish={handleSubmit} className="compact-form">
          <p className="stat-cards-info__num">Add to list</p>
          <Form.Item name="price" className="compact-form-item">
            <Input type="number" step="0.01" placeholder="Enter price" />
          </Form.Item>
          <Form.Item name="number" className="compact-form-item">
            <Input type="number" min="1" placeholder="Enter number (integer)" />
          </Form.Item>
          <Form.Item name="sellStrategy" className="compact-form-item">
            <Select placeholder="Select strategy">
              <Option value="average25daysloss">Average 25 Days Loss</Option>
              <Option value="average50daysloss">Average 50 Days Loss</Option>
              <Option value="break25percentwin">Break 25% Win</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form>
      </div>
    </div>
  </Col>
</Row>

      <Row>
        <Col lg={9}>
          <Button className="btn btn-outline-primary">3 Years</Button>
          <Button className="btn btn-outline-primary">2 Years</Button>
          <Button className="btn btn-outline-primary">1 Year</Button>
          <Button className="btn btn-outline-primary">3 Months</Button>
          <Button className="btn btn-outline-primary">1 Month</Button>
          <div className="chart">
            {/* Placeholder for Chart.js */}
            <canvas id="stockChart" aria-label="Site statistics"></canvas>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Home;
