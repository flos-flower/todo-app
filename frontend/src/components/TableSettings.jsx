import React, { useContext } from "react";
import s from "../styles/TableSettingsStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Context from "../context/Context";

let TableSettings = (props) => {
  let {
    selectedTable,
  } = useContext(Context);
  return (
    <div className={s.mainDiv}>
      <span>{selectedTable.name}</span>
      <div className={s.settings}>
        <FontAwesomeIcon icon={faGear} className={s.settingGear}/>
      </div>
    </div>
  );
};

export default TableSettings;
