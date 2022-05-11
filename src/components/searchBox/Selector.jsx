import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTable } from '../../hooks/TableContext';

export default function Selector({ qlikApp, fieldName }) {
  const [inputValue, setInputValue] = useState('');
  const [field, setField] = useState(undefined);

  const tableData = useTable();
  useEffect(() => {
    const getSetObjectDetails = async () => {
      const newField = await qlikApp.getField(fieldName);
      setField(newField);
    };
    if (!field && qlikApp) {
      getSetObjectDetails();
    }
  }, [qlikApp, field, inputValue, fieldName]);

  // Create an empty array for sales names
  const salesNames = [];

  if (tableData) {
    // Extract all data for rows that has the same name for each person
    tableData.forEach((row) => {
      if (!salesNames.some((item) => item === row.repName)) {
        // Add sales name to the array
        salesNames.push(row.repName);
      }
    });
  }
  useEffect(() => {
    const handleOnClick = async () => {
      if (field && inputValue) {
        await field.selectValues({
          qFieldValues: [{ qText: inputValue }],
          qToggleMode: true,
          qSoftLock: true,
        });
      }
    };
    // Select the sales name that has been type in the input and does exist!
    if (salesNames.some((name) => name === inputValue) && field) {
      handleOnClick();
    }
    // Deselect all when input is empty
    const handleClear = async () => {
      if (inputValue === '') {
        await field.clear();
      }
    };
    handleClear();
  }, [inputValue, field]);
  return (
    <div>
      <Search>
        <fieldset>
          <legend>Sales Person Name</legend>
          <SearchBar
            type="text"
            list="names"
            placeholder="Search..."
            name="name"
            value={inputValue}
            onFocus={() => setInputValue('')}
            onChange={(event) => setInputValue(event.target.value)}
            autocomplete="on"
          />
          <datalist type="text" id="names">
            {salesNames.map((name) => (
              <option value={name} key={name} />
            ))}
          </datalist>
        </fieldset>
      </Search>
    </div>
  );
}
const Search = styled.div`
  fieldset {
    margin-left: 0;
    transition: 0.5s ease-in-out;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
    border-color: #eef4ff;
  }
`;
const SearchBar = styled.input`
  border: none;
  color: black;
  height: 30px;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: black;
    }
  }
`;
