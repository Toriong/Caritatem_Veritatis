import React, { useEffect, useState, useContext } from 'react';
import { UserInfoContext } from '../provider/UserInfoProvider'
import { v4 as uuidv4 } from 'uuid';
import { MdCancel } from "react-icons/md";
import '../blog-css/table.css';




const Table = ({ wasInputDeleted, setWasInputDeleted, sectionId }) => {
    const { _blogPost } = useContext(UserInfoContext);
    const [blogPost, setBlogPost] = _blogPost;
    const [isBlogPostUpdated, setIsBlogPostUpdated] = useState(false);
    const [table, setTable] = useState(() => {
        // GOAL: give the user ability to delete a column. 
        // user clicks on the 'add column' button 
        // for the header (the first element of a column) give an id to it, for all of its elements below it, give the same id

        const columnId1 = uuidv4();
        const columnId2 = uuidv4();
        const columnId3 = uuidv4();
        return {
            rows: [
                {
                    id: uuidv4(),
                    cells: [
                        {
                            id: "headerTag",
                            data: ""
                        },
                        {
                            id: columnId1,
                            data: "",
                        },
                        {
                            id: columnId2,
                            data: "",
                        },
                        {
                            id: columnId3,
                            data: ""
                        }
                    ]
                },
                {
                    id: uuidv4(),
                    cells: [
                        {
                            id: "headerTag",
                            data: ""
                        },
                        {
                            id: columnId1,
                            data: "",
                        },
                        {
                            id: columnId2,
                            data: "",
                        },
                        {
                            id: columnId3,
                            data: ""
                        }
                    ]
                },
                {
                    id: uuidv4(),
                    cells: [
                        {
                            id: "headerTag",
                            data: ""
                        },
                        {
                            id: columnId1,
                            data: "",
                        },
                        {
                            id: columnId2,
                            data: "",
                        },
                        {
                            id: columnId3,
                            data: ""
                        }
                    ]
                },
            ],
            // copy all of this and put it into the cells 
            columns: [
                {
                    id: columnId1,
                    data: ""
                },
                {
                    id: columnId2,
                    data: ""
                },
                {
                    id: columnId3,
                    data: ""
                }
            ]
        }
    });

    const addRow = (event) => {
        event.preventDefault();
        const currentCells = table.columns.map(column => {
            const { id } = column;
            return {
                id,
                data: ""
            };;
        });
        const newCells = [
            {
                id: "headerTag",
                data: ""
            },
            ...currentCells
        ];
        const newRow = {
            // id must be the same as header id 
            id: uuidv4(),
            cells: newCells
        };

        setTable({
            ...table,
            rows: [...table.rows, newRow]
        });
        setIsBlogPostUpdated(true);
    };

    const addColumn = (event) => {
        event.preventDefault();
        const _id = uuidv4();
        const rows_ = table.rows.map(row => {
            const newCells = [...row.cells, {
                id: _id,
                data: ""
            }]

            return {
                ...row,
                cells: newCells
            }
        })
        const columns_ = [...table.columns, {
            id: _id,
            data: ""
        }];

        setTable({
            columns: columns_,
            rows: rows_
        })
        setIsBlogPostUpdated(true);
    }

    const handleDeleteRow = (id) => () => {
        console.log(id);
        // WHAT I WANT: when the user clicks on the row deletion button, I want that row to be deleted
        const rows_ = table.rows.filter(row => row.id !== id);
        console.log(rows_);
        setTable({
            ...table,
            rows: rows_
        });
        setIsBlogPostUpdated(true);
    };
    useEffect(() => {
        console.log(table.rows);
    })

    const handleDeleteColumn = (id) => () => {
        const columns_ = table.columns.filter(column => column.id !== id);
        let rows_;
        table.rows.forEach(row => {
            const cells_ = row.cells.filter(cell => cell.id !== id);
            const row_ = {
                ...row,
                cells: cells_
            };
            rows_ = rows_ ? [...rows_, row_] : [row_];
        });
        setTable({
            rows: rows_,
            columns: columns_
        });
        setIsBlogPostUpdated(true);
    };

    const handleCellInput = (event, rowId) => {
        const name = event.target.name;
        const rows_ = table.rows.map(row => {
            if (rowId === row.id) {
                const cells_ = row.cells.map(cell_ => {
                    if (cell_.id === name) {
                        return {
                            ...cell_,
                            data: event.target.value
                        }
                    }

                    return cell_;
                })

                return {
                    ...row,
                    cells: cells_
                }
            }

            return row;
        });
        setTable({
            ...table,
            rows: rows_
        });
        setIsBlogPostUpdated(true);
    };

    const handleHeadersInput = (event) => {
        const id = event.target.name;
        const columns_ = table.columns.map(column => {
            if (column.id === id) {
                return {
                    ...column,
                    data: event.target.value
                }
            }

            return column
        })

        setTable({
            ...table,
            columns: columns_
        });
        setIsBlogPostUpdated(true);
    }

    useEffect(() => {
        if (wasInputDeleted) {
            const section = blogPost.body.find(section_ => section_.id === sectionId);
            setTable({
                rows: section.data.rows,
                columns: section.data.columns
            });
            setWasInputDeleted(false);
        } else if (isBlogPostUpdated) {
            const body_ = blogPost.body.map(section_ => {
                if (section_.id === sectionId) {
                    return {
                        ...section_,
                        data: table
                    }
                }

                return section_;
            });

            setBlogPost({
                ...blogPost,
                body: body_
            });
            setIsBlogPostUpdated(false);
        }
    }, [blogPost, table])

    return <table className="userTable">
        <thead className="tableHeader">
            <tr>

                <th id="buttonCell">
                    <button onClick={addRow}>
                        Add row
                    </button>
                    <button onClick={addColumn}>Add column</button>
                </th>
                {table.columns.map(column =>
                    <th
                        key={column.id}
                    >
                        <section>
                            <div className="deleteColumnBtn">
                                <MdCancel onClick={handleDeleteColumn(column.id)} />
                            </div>
                        </section>
                        <input
                            name={column.id}
                            key={column.id}
                            onChange={handleHeadersInput}
                            data={column.data}
                            onClick={() => {
                                console.log(column.id)
                            }}
                        />
                    </th>
                )
                }
            </tr>
        </thead>
        <tbody className="tableBody">
            {table.rows.map(row =>
                /*bug with the use of bracket notation in order to get the values of the user input?  */
                <tr
                    key={row.id}
                >
                    {row.cells.map((cell, index) =>
                        index === 0 ?
                            <td className="rowHeader">
                                <MdCancel onClick={handleDeleteRow(row.id)} />
                                <input
                                    name={cell.id}
                                    key={cell.id}
                                    onChange={event => { handleCellInput(event, row.id,) }}
                                    defaultValue={cell.data}
                                />
                            </td>
                            :
                            <td>
                                <input
                                    name={cell.id}
                                    key={cell.id}
                                    onChange={event => { handleCellInput(event, row.id,) }}
                                    defaultValue={cell.data}
                                    onClick={() => {
                                        console.log(cell.id)
                                    }}
                                />
                            </td>
                    )
                    }
                </tr>
            )}
        </tbody>
    </table>
}

export default Table
