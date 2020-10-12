import React from "react";
import { Button, Checkbox, Icon, Modal } from "semantic-ui-react";
import InfoPopup from "../utils/InfoPopup";

interface props {
  setModalOpen: (v: boolean) => void;
  modalOpen: boolean;
  showApplyWeighting: boolean;
  applyWeighting: boolean;
  setApplyWeighting: (v: boolean) => void;
  applyPopulationScaling: boolean;
  setApplyPopulationScaling: (v: boolean) => void;
}

const SettingsModal: React.FC<props> = ({
  setModalOpen,
  modalOpen,
  showApplyWeighting,
  applyWeighting,
  setApplyWeighting,
  applyPopulationScaling,
  setApplyPopulationScaling,
}) => {
  return (
    <Modal
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
      open={modalOpen}
      trigger={<Icon name="setting" size="large" />}
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
