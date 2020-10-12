import React from "react";
import { Container, Grid, Header, Loader, Segment } from "semantic-ui-react";

interface props {
  areaOptions: React.ReactElement;
  searchRefinement: React.ReactElement;
  graph: React.ReactElement;
  settingsModal: React.ReactElement;
  graphOptions: React.ReactElement;
  err: React.ReactElement | null;
  loading: boolean;
}

const StatsComponent: React.FC<props> = ({
  areaOptions,
  searchRefinement,
  graph,
  settingsModal,
  graphOptions,
  err,
  loading,
}) => {
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  // Calculate an approx height for the graph.
  // header height - render options - "a buffer"
  const graphHeight = height - 36 - 66 - 50;

  return (
    <Container>
      <Header as="h1" textAlign={"center"}>
        Covid Stats UK
      </Header>
      <Segment basic>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column width={14}>
              {areaOptions}
              {searchRefinement}
              {err && err}
              <Loader active={loading} inline />
            </Grid.Column>
            <Grid.Column width={2}>{settingsModal}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <div style={{ height: graphHeight }}>{graph}</div>
    </Container>
  );
};

export default StatsComponent;
