import s from "../styles/TableStyles.module.css";
import { useState } from "react";

const Table = (props) => {

  let [tableTitle, setTableTitle] = useState('');

  let handleTitleChange = (e) => {
    setTableTitle(e.target.value)
  }

  return (
    <div className={s.tableDiv}>
      <span>Create table</span>
      <hr />
      <form className={s.tableForm} onSubmit={(e)=>{props.createTable(e); props.changeVisibility()}}>
        <label>
          Table title
          <input type="text" value={tableTitle} onChange={(e)=>handleTitleChange(e)} name="title" autoFocus maxLength={15} />
        </label>
        <input type="submit" value="Create"/>
      </form>
    </div>
  );
};

export default Table;
