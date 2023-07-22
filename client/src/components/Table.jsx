// Table.jsx
import React from "react";

const Table = ({ columns, data }) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-black">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="border border-black px-4 py-2">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-black px-4 py-2 text-center"
                  >
                    {column.dataKey === "criterias" ? (
                      <ul>
                        {row[column.dataKey]
                          .split(", ")
                          .map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                      </ul>
                    ) : (
                      row[column.dataKey]
                    )}
                  </td>
                ))}
                {columns.find((column) => column.header === "Actions") && ( // Check if any column has header "Actions"
                  <td className="border border-black px-4 py-2 flex justify-center">
                    {columns
                      .find((column) => column.header === "Actions")
                      .buttons.map((button, buttonIndex) => (
                        <button
                          key={buttonIndex}
                          className={`mr-2 px-4 py-2 bg-${button.color}-600 text-white rounded hover:bg-${button.color}-700`}
                          onClick={button.onClick}
                        >
                          {button.label}
                        </button>
                      ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
