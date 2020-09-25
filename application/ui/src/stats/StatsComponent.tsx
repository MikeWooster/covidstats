import React from 'react';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container/Container';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import { Stats } from './api';
import StatsGraph from './StatsGraph';


const StatsComponent = ({ stats }: { stats: Stats[] }) => {
  return (
    <Container>
      <Header as='h1' textAlign={"center"}>Covid Stats UK</Header>
      <StatsGraph stats={stats} />
    </Container>
  )

}

export default StatsComponent
