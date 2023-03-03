import s from "../styles/TableStyles.module.css";

const Table = (props) => {
  return (
    <div className={s.tableDiv}>
      <span>Create table</span>
      <hr />
      <form className={s.tableForm} onSubmit={(e)=>props.createTable(e)}>
        <label>
          Table title
          <input type="text" name="title" autoFocus />
        </label>
        <input type="submit" value="Create" />
      </form>
    </div>
  );
};

export default Table;
