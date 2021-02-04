import React from "react";
import { Input } from "semantic-ui-react";
import InfoPopup from "./InfoPopup";

interface props {
  postCode: string;
  setRefinedArea: (v: string) => void;
  searchRadius: number | null;
  setSearchRadius: (v: number | null) => void;
  getStatsForPostCode: (p: string, r: number) => void;
  setTimer: (v: NodeJS.Timeout | undefined) => void;
  clearTimer: () => void;
  loading: boolean;
}

const PostCodeSearch: React.FC<props> = ({
  postCode,
  setRefinedArea,
  searchRadius,
  setSearchRadius,
  getStatsForPostCode,
  setTimer,
  clearTimer,
  loading,
}) => {
  return (
    <div>
      Post Code:{" "}
      <Input
        size={"mini"}
        style={{ width: 60 }}
        disabled={loading}
        value={postCode}
        onChange={(e, { value }) => {
          const postCode = value as string;
          setRefinedArea(postCode);
          // When the search query changes, cancel any pending
          // search requests
          clearTimer();
          // Only perform a search when the user stops typing for 1500 ms
          setTimer(
            setTimeout(() => {
              const r = searchRadius === null ? 0 : searchRadius;
              getStatsForPostCode(postCode, r);
            }, 1500)
          );
        }}
      />{" "}
      Within{" "}
      <Input
        size={"mini"}
        style={{ width: 40 }}
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
          clearTimer();
          // Only perform a search when the user stops typing for 750 ms
          setTimer(
            setTimeout(() => {
              getStatsForPostCode(postCode, r);
            }, 750)
          );
        }}
      />{" "}
      km
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

export default PostCodeSearch;
