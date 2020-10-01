import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Header,
  Input,
  Segment,
} from "semantic-ui-react";
import { AreaTypes } from "./stats";

interface OptionsType {
  key: string;
  value: string;
  text: string;
}

const StatsComponent = ({
  areaOptions,
  searchRefinement,
  graph,
  graphOptions,
  err,
}: {
  areaOptions: React.ReactElement;
  searchRefinement: React.ReactElement;
  graph: React.ReactElement;
  graphOptions: React.ReactElement;
  err: React.ReactElement | null;
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

export const AreaOptionsSelect = ({
  nations,
  regions,
  areaType,
  setAreaType,
  setRefinedArea,
  getStats,
}: {
  nations: string[];
  regions: string[];
  areaType: AreaTypes;
  setAreaType: (v: AreaTypes) => void;
  setRefinedArea: (v: string) => void;
  getStats: (a: AreaTypes, r: string) => void;
}) => {
  const areaOptions = [
    {
      key: AreaTypes.overview,
      text: "All UK",
      value: AreaTypes.overview,
    },
    {
      key: AreaTypes.nation,
      text: "Nation",
      value: AreaTypes.nation,
    },
    {
      key: AreaTypes.region,
      text: "Region",
      value: AreaTypes.region,
    },
    {
      key: AreaTypes.postCode,
      text: "Near You",
      value: AreaTypes.postCode,
    },
  ];
  return (
    <div>
      Display data for{" "}
      <Dropdown
        inline
        options={areaOptions}
        onChange={(e, { value }) => {
          setAreaType(value as AreaTypes);
          switch (value) {
            case AreaTypes.overview:
              getStats(value, "");
              break;
            case AreaTypes.nation:
              const defaultNation = nations[0];
              setRefinedArea(defaultNation);
              getStats(value, defaultNation);
              break;
            case AreaTypes.region:
              const defaultRegion = regions[0];
              setRefinedArea(defaultRegion);
              getStats(value, defaultRegion);
              break;
            case AreaTypes.postCode:
              setRefinedArea("");
              break;
          }
        }}
        value={areaType}
      />
    </div>
  );
};

export const AreaRefinementSearch = ({
  nations,
  regions,
  areaType,
  refinedArea,
  setRefinedArea,
  getStats,
}: {
  nations: string[];
  regions: string[];
  areaType: AreaTypes;
  refinedArea: string;
  setRefinedArea: (v: string) => void;
  getStats: (a: AreaTypes, r: string) => void;
}) => {
  let searchOptions: OptionsType[] = [];
  let disabled = false;

  switch (areaType) {
    case AreaTypes.overview:
      disabled = true;
      break;
    case AreaTypes.nation:
      searchOptions = nations.map((nation) => ({
        key: nation,
        text: nation,
        value: nation,
      }));
      break;
    case AreaTypes.region:
      searchOptions = regions.map((region) => ({
        key: region,
        text: region,
        value: region,
      }));
      break;
  }

  const searchInput = (
    <Dropdown
      inline
      search
      disabled={disabled}
      options={searchOptions}
      onChange={(e, { value }) => {
        const selected = value as string;
        setRefinedArea(selected);
        getStats(areaType, selected);
      }}
      value={refinedArea}
    />
  );
  return <div>Refine results: {searchInput}</div>;
};

export const PostCodeSearch = ({
  postCode,
  setRefinedArea,
  searchRadius,
  setSearchRadius,
  getStatsForPostCode,
  searchTimeout,
  loading,
}: {
  postCode: string;
  setRefinedArea: (v: string) => void;
  searchRadius: number | null;
  setSearchRadius: (v: number | null) => void;
  getStatsForPostCode: (p: string, r: number) => void;
  searchTimeout: React.MutableRefObject<NodeJS.Timeout | undefined>;
  loading: boolean;
}) => {
  return (
    <div>
      Enter Post Code:{" "}
      <Input
        size={"mini"}
        loading={loading}
        disabled={loading}
        value={postCode}
        onChange={(e, { value }) => {
          const postCode = value as string;
          setRefinedArea(postCode);
          // When the search query changes, cancel any pending
          // search requests
          if (searchTimeout.current !== undefined) {
            clearTimeout(searchTimeout.current);
          }
          // Only perform a search when the user stops typing for 750 ms
          searchTimeout.current = setTimeout(() => {
            const r = searchRadius === null ? 0 : searchRadius;
            getStatsForPostCode(postCode, r);
          }, 750);
        }}
      />{" "}
      Within{" "}
      <Input
        size={"mini"}
        loading={loading}
        disabled={loading}
        value={searchRadius === null ? "" : searchRadius}
        onChange={(e, { value }) => {
          if (value === "") {
            setSearchRadius(null);
            return;
          }
          const r = parseInt(value);
          if (isNaN(r)) {
            return;
          }
          setSearchRadius(r);
          // When the search query changes, cancel any pending
          // search requests
          if (searchTimeout.current !== undefined) {
            clearTimeout(searchTimeout.current);
          }
          // Only perform a search when the user stops typing for 750 ms
          searchTimeout.current = setTimeout(() => {
            getStatsForPostCode(postCode, r);
          }, 500);
        }}
      />{" "}
      Kilometers
    </div>
  );
};

export default StatsComponent;
