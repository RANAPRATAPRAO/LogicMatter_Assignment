import React, { useState } from 'react';

const students = [
  { id: 1, name: 'Janu', English: 50, Maths: 86, Science: 77, SocialScience: 88 },
  { id: 2, name: 'Tanu', English: 75, Maths: 96, Science: 67, SocialScience: 91 },
  { id: 3, name: 'Tara', English: 90, Maths: 35, Science: 86, SocialScience: 100 },
  { id: 4, name: 'Glen', English: 79, Maths: 68, Science: 77, SocialScience: 78 },
  { id: 5, name: 'Zara', English: 80, Maths: 85, Science: 96, SocialScience: 68 },
];

const ITEMS_PER_PAGE = 2; //Based on our requirement

export default function StudentTable() {
  const [subject, setSubject] = useState('English');
  const [filterType, setFilterType] = useState('Above');
  const [filterValue, setFilterValue] = useState({ min: '', max: '' });
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const applyFilter = () => {
    let filtered = students;

    if (filterType === 'Above') {
      filtered = students.filter((s) => s[subject] > filterValue.min);
    } else if (filterType === 'Below') {
      filtered = students.filter((s) => s[subject] < filterValue.min);
    } else if (filterType === 'Between') {
      filtered = students.filter(
        (s) => s[subject] >= filterValue.min && s[subject] <= filterValue.max
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reseting to first page
  };

  const clearFilter = () => {
    setFilteredStudents(students);
    setFilterValue({ min: '', max: '' });
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...filteredStudents].sort((a, b) => {
      if (order === 'asc') return a[column] > b[column] ? 1 : -1;
      return a[column] < b[column] ? 1 : -1;
    });

    setSortColumn(column);
    setSortOrder(order);
    setFilteredStudents(sorted);
  };

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      {/* Filtering Controls on the UI */}
      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {['English', 'Maths', 'Science', 'SocialScience'].map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <input
            type="radio"
            name="filterType"
            value="Above"
            checked={filterType === 'Above'}
            onChange={() => setFilterType('Above')}
          />
          <label>Above</label>
          <input
            type="radio"
            name="filterType"
            value="Below"
            checked={filterType === 'Below'}
            onChange={() => setFilterType('Below')}
          />
          <label>Below</label>
          <input
            type="radio"
            name="filterType"
            value="Between"
            checked={filterType === 'Between'}
            onChange={() => setFilterType('Between')}
          />
          <label>Between</label>
        </div>

        <input
          type="number"
          placeholder="Min"
          value={filterValue.min}
          onChange={(e) => setFilterValue({ ...filterValue, min: e.target.value })}
          className="p-2 border rounded"
        />
        {filterType === 'Between' && (
          <input
            type="number"
            placeholder="Max"
            value={filterValue.max}
            onChange={(e) => setFilterValue({ ...filterValue, max: e.target.value })}
          className="p-2 border rounded"
        />)}

        <button onClick={applyFilter} className="bg-blue-500 text-white px-4 py-2 rounded">
          Filter
        </button>
        <button onClick={clearFilter} className="bg-gray-500 text-white px-4 py-2 rounded">
          Clear
        </button>
      </div>

      {/* Table of the Student Data */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            {['id', 'name', 'English', 'Maths', 'Science', 'SocialScience'].map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="p-2 border border-gray-400 cursor-pointer"
              >
                {col} {sortColumn === col ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-100">
              {Object.values(student).map((val, i) => (
                <td key={i} className="p-2 border border-gray-400 text-center">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls which is for large dataSet */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
