import React from "react";
import { Dropdown } from "semantic-ui-react";
import { AreaTypes } from "./stats";

interface props {
  nations: string[];
  regions: string[];
  areaType: AreaTypes;
  refinedArea: string;
  setRefinedArea: (v: string) => void;
  getStats: (a: AreaTypes, r: string) => void;
}

const AreaRefinementSearch: React.FC<props> = ({
  nations,
  regions,
  areaType,
  refinedArea,
  setRefinedArea,
  getStats,
}) => {
  let searchOptions: {
    key: string;
    value: string;
    text: string;
  }[] = [];
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

export default AreaRefinementSearch;
