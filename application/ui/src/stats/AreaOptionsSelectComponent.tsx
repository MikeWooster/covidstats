import React from "react";
import { Dropdown } from "semantic-ui-react";
import { AreaTypes } from "./stats";

interface props {
  nations: string[];
  regions: string[];
  areaType: AreaTypes;
  setAreaType: (v: AreaTypes) => void;
  setRefinedArea: (v: string) => void;
  getStats: (a: AreaTypes, r: string) => void;
}

const AreaOptionsSelect: React.FC<props> = ({
  nations,
  regions,
  areaType,
  setAreaType,
  setRefinedArea,
  getStats,
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
      <label htmlFor="areaTypeSelectInput">Display data for </label>
      <Dropdown
        id="areaTypeSelectInput"
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

export default AreaOptionsSelect;
