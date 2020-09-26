import React from 'react';
import { Container, Divider, Dropdown, Header, Segment } from 'semantic-ui-react';
import { AreaTypes, Stats } from './stats';
import StatsGraph from './StatsGraph';

interface OptionsType {
  key: string
  value: string
  text: string
}

const StatsComponent = (
  {
    err,
    stats,
    nations,
    regions,
    areaType,
    setAreaType,
    refinedArea,
    setRefinedArea
  }: {
    err: string,
    stats: Stats[],
    nations: string[],
    regions: string[],
    areaType: AreaTypes,
    setAreaType: (v: AreaTypes) => void,
    refinedArea: string,
    setRefinedArea: (v: string) => void
  }
) => {
  return (
    <Container>
      <Header as='h1' textAlign={"center"}>Covid Stats UK</Header>
      <Segment basic>
        <AreaOptionsSelect areaType={areaType} setAreaType={setAreaType} />
        <AreaRefinementSelect nations={nations} regions={regions} areaType={areaType} refinedArea={refinedArea} setRefinedArea={setRefinedArea} />
        {err && <Segment inverted color='red' tertiary>Something Went Wrong</Segment>}
      </Segment>
      <Divider horizontal />
      <StatsGraph stats={stats} />
    </Container>
  )
}

const AreaOptionsSelect = ({ areaType, setAreaType }: { areaType: AreaTypes, setAreaType: (v: AreaTypes) => void }) => {
  const areaOptions = [
    {
      key: AreaTypes.overview,
      text: 'All UK',
      value: AreaTypes.overview,
    },
    {
      key: AreaTypes.nation,
      text: 'Nation',
      value: AreaTypes.nation,
    },
    {
      key: AreaTypes.region,
      text: 'Region',
      value: AreaTypes.region,
    },
  ]
  return (
    <div>
      Display data for {" "}
      <Dropdown
        inline
        options={areaOptions}
        onChange={(e, { value }) => setAreaType(value as AreaTypes)}
        value={areaType}
      />
    </div>
  )
}

const AreaRefinementSelect = (
  {
    nations,
    regions,
    areaType,
    refinedArea,
    setRefinedArea
  }: {
    nations: string[],
    regions: string[],
    areaType: AreaTypes,
    refinedArea: string,
    setRefinedArea: (v: string) => void
  }
) => {
  let searchOptions: OptionsType[] = []
  let disabled = false

  switch (areaType) {
    case AreaTypes.overview:
      disabled = true
      break
    case AreaTypes.nation:
      searchOptions = nations.map(nation => ({ key: nation, text: nation, value: nation }))
      break
    case AreaTypes.region:
      searchOptions = regions.map(region => ({ key: region, text: region, value: region }))
      break
  }

  const searchInput = <Dropdown
    inline
    search
    disabled={disabled}
    options={searchOptions}
    onChange={(e, { value }) => setRefinedArea(value as string)}
    value={refinedArea}
  />
  return <div>Refine results: {searchInput}</div>
}

export default StatsComponent
