import React from "react";
import { Icon, Popup } from "semantic-ui-react";

interface props {
  header: string;
  content: React.ReactElement;
}

const InfoPopup: React.FC<props> = ({ header, content }) => {
  return (
    <Popup
      data-testid="info-popup"
      trigger={
        <Icon
          data-testid="popup-trigger"
          name="info"
          circular
          color="blue"
          size="small"
          style={{ marginLeft: 7, borderTop: 50 }}
        />
      }
    >
      <div data-testid="popup-content">
        <h4>{header}</h4>
        {content}
      </div>
    </Popup>
  );
};

export default InfoPopup;
