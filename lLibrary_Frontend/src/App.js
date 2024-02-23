import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Table, Pagination, PaginationItem, PaginationLink, Col, Row, Button } from 'reactstrap';
import './App.css'; // Import CSS file for custom styles

const App = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [readBooks, setReadBooks] = useState([]);

  useEffect(() => {
    axios.get("https://library-system-1.onrender.com/books")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  // const handleMarkAsRead = (index) => {
  //   const bookToMarkAsRead = sortedData[index];
  //   setReadBooks([...readBooks, bookToMarkAsRead]);
  //   const updatedData = data.filter((_, i) => i !== index);
  //   setData(updatedData);
  // };
  const handleMarkAsRead = (index) => {
    const bookToMarkAsRead = sortedData[index];
    setReadBooks([...readBooks, bookToMarkAsRead]);
    const updatedData = sortedData.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const filteredData = data.filter((item) => {
    if (searchTerm === "") return true;
    if (
      searchCategory === "name" &&
      item.Title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    if (
      searchCategory === "author" &&
      item.Author.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    if (
      searchCategory === "subject" &&
      item.Subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.Publish_Date) - new Date(b.Publish_Date);
    } else {
      return new Date(b.Publish_Date) - new Date(a.Publish_Date);
    }
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedData.slice(indexOfFirstBook, indexOfLastBook);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (number) => {
    setCurrentPage(number);
  };

  return (
    <article className="container">
      <h1 className="title">Library Management System</h1>
      <Row>
        <Col>
          <div className="sub-title">Search by</div>
          <Input type="select" value={searchCategory} onChange={handleSearchCategoryChange} style={{ width: '150px', marginRight: '10px' }}>
            <option value="name">Name</option>
            <option value="author">Author</option>
            <option value="subject">Subject</option>
          </Input>
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: '250px', marginRight: '10px' }}
          />
        </Col>
        <Col>
          <div className="sub-title">Date sort by</div>
          <Input type="select" value={sortOrder} onChange={handleSortOrderChange} style={{ width: '150px' }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Input>
        </Col>
      </Row>
      <span className="sub-title">Total Books found: {filteredData.length}</span>
      <Table striped bordered hover style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Subject</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((item, index) => (
            <tr key={index}>
              <td>{item.Title}</td>
              <td>{item.Author}</td>
              <td>{item.Subject}</td>
              <td>{item.Publish_Date}</td>
              <td>
                <Button onClick={() => handleMarkAsRead(index)}>Mark as Read</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination style={{ marginTop: '10px' }}>
        {pageNumbers.map((number) => (
          <PaginationItem key={number} active={currentPage === number}>
            <PaginationLink onClick={() => handleClick(number)}>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
      <h1 className="title">Read Books</h1>
      <Table striped bordered hover style={{ marginTop: '10px', marginBottom: '10px'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Subject</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {readBooks.map((item, index) => (
            <tr key={index}>
              <td>{item.Title}</td>
              <td>{item.Author}</td>
              <td>{item.Subject}</td>
              <td>{item.Publish_Date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </article>
  );
};

export default App;