import React from "react";
import { Checkbox, Icon, Popup } from "semantic-ui-react";
import InfoPopup from "../utils/InfoPopup";

const GraphOptions = ({
  showApplyWeighting,
  applyWeighting,
  setApplyWeighting,
}: {
  showApplyWeighting: boolean;
  applyWeighting: boolean;
  setApplyWeighting: (v: boolean) => void;
}) => {
  return (
    <div>
      {showApplyWeighting && (
        <span>
          <Checkbox
            toggle
            label="Weight stats based on number of test cases."
            checked={applyWeighting}
            onChange={() => setApplyWeighting(!applyWeighting)}
          />
          <InfoPopup
            header="Stat Weighting"
            content={`By enabling stat weighting, we assume that the number of cases is proportional to the number of tests taken. 
              We find the maximum number of tests that were carried out on a single day, and treat the number of cases on that day 
              as the true tests to cases ratio. For every other stat we apply a weighting assuming that they conform to the same ratio.
              Stats weighting is only available for data where we are able to get the test statistics (nation and UK)`}
          />
        </span>
      )}
    </div>
  );
};

export default GraphOptions;
