import s from "../styles/InputBarStyles.module.css";

const InputBar = (props) => {
  return props.condition ? (
    <form
      onSubmit={(e) => {
        props.add(e);
        props.changeTag(e);
      }}
      className={s.input}
    >
      <textarea
        onChange={props.handleChange}
        onKeyDown={props.handleKeyDown}
        placeholder="Enter a title"
        autoFocus
      />
      <div>
        <button className={s.btnAdd}>{props.addName}</button>
        <button onClick={props.changeTag} type="button" className={s.btnCancel}>
          &#9587;
        </button>
      </div>
    </form>
  ) : (
    <div
      onClick={
        props.user.user_id === props.selectedTable.user
          ? props.changeTag
          : undefined
      }
      className={s.add}
    >
      <span className={s.plus}>+</span>
      <span>{props.addName}</span>
    </div>
  );
};

export default InputBar;
