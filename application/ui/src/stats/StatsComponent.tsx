import React from "react";
import { Container, Divider, Header, Segment } from "semantic-ui-react";

interface props {
  areaOptions: React.ReactElement;
  searchRefinement: React.ReactElement;
  graph: React.ReactElement;
  graphOptions: React.ReactElement;
  err: React.ReactElement | null;
}

const StatsComponent: React.FC<props> = ({
  areaOptions,
  searchRefinement,
  graph,
  graphOptions,
  err,
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
      </Segment>
      <Divider horizontal />
      {graph}
      <Divider horizontal />
      {graphOptions}
    </Container>
  );
};

export default StatsComponent;
