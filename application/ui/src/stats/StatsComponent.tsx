import React from "react";
import { Container, Divider, Header, Loader, Segment } from "semantic-ui-react";

interface props {
  areaOptions: React.ReactElement;
  searchRefinement: React.ReactElement;
  graph: React.ReactElement;
  graphOptions: React.ReactElement;
  err: React.ReactElement | null;
  loading: boolean;
}

const StatsComponent: React.FC<props> = ({
  areaOptions,
  searchRefinement,
  graph,
  graphOptions,
  err,
  loading,
}) => {
  return (
    <Container>
      <Header as="h1" textAlign={"center"}>
        Covid Stats UK
      </Header>
      <Segment basic>
        {areaOptions}
        {searchRefinement}
        {err && err}
        <Loader active={loading} inline />
      </Segment>
      <Divider horizontal />
      {graph}
      <Divider horizontal />
      {graphOptions}
    </Container>
  );
};

export default StatsComponent;
