import React, { ReactElement, useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";
import qs from "qs";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { Button, Typography, Paper, Select, MenuItem } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import FiltersSelect from "./Filters.select";

import useDebounce from "../../hooks/useDebounce";
import history from "../../helpers/history";

import { useFiltersStyles } from "./styles";

interface Props {
  searchQuery: string;
}

const Filters = ({ searchQuery }: Props): ReactElement => {
  const classes = useFiltersStyles({});
  const location = useLocation();
  const { formatMessage: _t } = useIntl();

  const searchParams = qs.parse(location.search.slice(1));
  const [queryField, setqueryField] = useState(
    searchParams.query || searchQuery || ""
  );
  const [yearRange, setYearRange] = useState(searchParams.year || "");
  const [collections, setcollections] = useState(
    searchParams.collections || []
  );
  const [minRating, setMinRating] = useState(
    Number(searchParams.minRating) || 0
  );

  const debouncedQueryField = useDebounce(queryField, 500);
  const debouncedYearRange: number[] = useDebounce(yearRange, 500) as number[];
  const debouncedCollections: string[] = useDebounce(
    collections,
    500
  ) as string[];
  const debouncedMinRating = useDebounce(minRating, 500);

  useEffect(() => {
    setqueryField(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const queryParams = qs.stringify({
      query: debouncedQueryField || undefined,
      collections: debouncedCollections.length
        ? debouncedCollections
        : undefined,
      year: yearRange || undefined,
      minRating: debouncedMinRating === 0 ? undefined : debouncedMinRating
    });

    if (history.location.pathname === "/search" || debouncedQueryField) {
      history.push({
        pathname: "/search",
        search: `?${queryParams}`
      });
    }
  }, [
    debouncedCollections,
    debouncedMinRating,
    debouncedQueryField,
    debouncedYearRange
  ]);

  const resetFilter = (): void => {
    setqueryField("");
    setYearRange(undefined);
    setcollections([]);
    setMinRating(0);
  };

  return (
    <Paper className={classes.container}>
      <div>
        <Typography>{_t({ id: "layout.filters.production_year" })}</Typography>
        <Select
          value={yearRange}
          onChange={(e): void => setYearRange(e.target.value)}
          className={classes.collectionsContainer}
          inputProps={{ style: { border: "1px solid blue" } }}
        >
          {_.rangeRight(1900, moment().year()).map((year: number) => (
            <MenuItem
              className={classes.yearItem}
              id={`menuitem-year${year}`}
              value={year}
            >
              {year}
            </MenuItem>
          ))}
          <MenuItem
            disabled
            className={classes.yearItem}
            id="menuitem-yeardefault"
            value=""
          />
        </Select>
      </div>
      <div className={classes.collectionsContainer}>
        <Typography>{_t({ id: "layout.filters.collection" })}</Typography>
        <FiltersSelect
          collections={collections}
          setCollections={(value): void => setcollections(value)}
        />
      </div>
      <div className={classes.ratingContainer}>
        <div>
          <Typography>
            {_t({ id: "layout.filters.select.minrating" })}
          </Typography>
          <Rating
            defaultValue={minRating}
            value={minRating || 0}
            onChange={(e, value): void => setMinRating(value)}
            name="ratingmin"
          />
        </div>
      </div>
      <Button onClick={resetFilter} className={classes.resetFilterButton}>
        {_t({ id: "layout.filters.select.reset" })}
      </Button>
    </Paper>
  );
};

export default Filters;
