import s from "../styles/TableStyles.module.css";

const Table = (props) => {
  return (
    <div className={s.tableDiv}>
      <span>Create table</span>
      <hr />
      <form className={s.tableForm}>
        <label>
          Table title
          <input type="text" autoFocus />
        </label>
        <input type="button" value="Create" />
      </form>
    </div>
  );
};

export default Table;
