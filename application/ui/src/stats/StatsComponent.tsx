import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Header,
  Input,
  Segment,
} from "semantic-ui-react";
import InfoPopup from "../utils/InfoPopup";
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
          // Only perform a search when the user stops typing for 1500 ms
          searchTimeout.current = setTimeout(() => {
            const r = searchRadius === null ? 0 : searchRadius;
            getStatsForPostCode(postCode, r);
          }, 1500);
        }}
      />{" "}
      Within{" "}
      <Input
        size={"mini"}
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
          }, 750);
        }}
      />{" "}
      Kilometers
      <InfoPopup
        header="Post Code Search"
        content={
          <div>
            <p>
              The post code search takes your postcode, and looks up local
              authorities within the search radius and sums up all stats from
              all authorities. If no local authorites are found within your
              search radius, it will find the nearest for you.
            </p>
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                Contains OS data © Crown copyright and database right{" "}
                {new Date().getFullYear()}.
              </li>
              <li>
                Contains Royal Mail data © Royal Mail copyright and database
                right {new Date().getFullYear()}.
              </li>
              <li>
                Source: Office for National Statistics licensed under the Open
                Government Licence v.3.0.
              </li>
            </ul>
          </div>
        }
      />
    </div>
  );
};

export default StatsComponent;
