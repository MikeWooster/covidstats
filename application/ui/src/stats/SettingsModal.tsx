import React from "react";
import { Button, Checkbox, Icon, Input, Modal } from "semantic-ui-react";
import InfoPopup from "./InfoPopup";

interface props {
  setModalOpen: (v: boolean) => void;
  modalOpen: boolean;
  showApplyWeighting: boolean;
  applyWeighting: boolean;
  setApplyWeighting: (v: boolean) => void;
  applyPopulationScaling: boolean;
  setApplyPopulationScaling: (v: boolean) => void;
  displayDeathsMovingAverage: boolean;
  setDisplayDeathsMovingAverage: (v: boolean) => void;
  daysToDisregard: number | null;
  setDaysToDisregard: (v: number | null) => void;
}

const SettingsModal: React.FC<props> = ({
  setModalOpen,
  modalOpen,
  showApplyWeighting,
  applyWeighting,
  setApplyWeighting,
  applyPopulationScaling,
  setApplyPopulationScaling,
  displayDeathsMovingAverage,
  setDisplayDeathsMovingAverage,
  daysToDisregard,
  setDaysToDisregard,
}) => {
  return (
    <Modal
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
      open={modalOpen}
      trigger={<Icon name="setting" size="large" link />}
    >
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content image>
        <div>
          <div>
            <Checkbox
              disabled={!showApplyWeighting}
              toggle
              label="Weight stats based on number of test cases."
              checked={applyWeighting}
              onChange={() => setApplyWeighting(!applyWeighting)}
            />
            <InfoPopup
              header="Stat Weighting"
              content={
                <div>
                  <p>
                    By enabling stat weighting, we assume that the number of
                    cases is proportional to the number of tests taken.
                  </p>
                  <p>
                    We find the maximum number of tests that were carried out on
                    a single day, and treat the number of cases on that day as
                    the true tests to cases ratio.
                  </p>
                  <p>
                    For every other stat we apply a weighting assuming that they
                    conform to the same ratio. Stats weighting is only available
                    for data where we are able to get the test statistics
                    (nation and UK)
                  </p>
                  <p>
                    Disclaimer: This weighting has not been validated by any
                    scientific means and should not be treated as a reliable
                    dataset. This is not to be used in any form outside of
                    covidstats.uk
                  </p>
                </div>
              }
            />
          </div>
          <div>
            <Checkbox
              toggle
              label="Display cases per 100,000 population."
              checked={applyPopulationScaling}
              onChange={() =>
                setApplyPopulationScaling(!applyPopulationScaling)
              }
            />
          </div>
          <div>
            <Checkbox
              toggle
              label="Display deaths 7 day moving average."
              checked={displayDeathsMovingAverage}
              onChange={() =>
                setDisplayDeathsMovingAverage(!displayDeathsMovingAverage)
              }
            />
          </div>
          <div>
            <Input
              style={{width:50, textAlign: "center"}}
              value={daysToDisregard}
              onChange={(e, { value }) => {
                if (value === "") {
                  setDaysToDisregard(null);
                  return;
                }
                const days = parseInt(value);
                if (isNaN(days)) {
                  return;
                }
                setDaysToDisregard(days);
              }}
            />
            <label style={{paddingLeft: 15}}>Number of days to ignore.</label>
            <InfoPopup
              header="Ignoring Days"
              content={
                <div>
                  <p>
                    Setting this value to a number greater than 0 will remove
                    the number of daysToDisregard towards the end of the graph.
                  </p>
                  <p>
                    An analysis shows that due to the delay in tests being
                    analysed and having to be sent to labs, the data from the
                    last 5 days can not yet be considered complete.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Done"
          labelPosition="right"
          icon="checkmark"
          onClick={() => setModalOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default SettingsModal;
