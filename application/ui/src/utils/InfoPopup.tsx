import React from "react";
import { Icon, Popup } from "semantic-ui-react";

interface props {
  header: string;
  content: string;
}

const InfoPopup: React.FC<props> = ({ header, content }) => {
  return (
    <Popup
      header={header}
      content={content}
      trigger={
        <Icon
          name="info"
          circular
          color="blue"
          size="small"
          style={{ marginLeft: 7, borderTop: 50 }}
        />
      }
    />
  );
};

export default InfoPopup;
