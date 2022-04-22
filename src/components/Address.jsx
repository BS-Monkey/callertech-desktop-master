import React from "react";
import { useSelector } from "react-redux";
import { Typography, Divider } from "@material-ui/core";
import Link from "./Link";
import { addressesSelector } from "../redux/selectors/details";
const Address = ({ id }) => {
  const address = useSelector(addressesSelector(id));
  let street_address = "";
  if (address.street_line_1) street_address += address.street_line_1 + ", ";
  if (address.street_line_2) street_address += " " + address.street_line_2;
  if (address.address_line_) street_address += " " + address.street_line_2;
  if (address.city) street_address += address.city + ", ";
  if (address.state_code) street_address += address.state_code;
  if (address.postal_code) street_address += " " + address.postal_code;
  // const url = `https://google.com/maps/place/${street_address}`;
  return (
    <div className="address-component" key={id}>
      <div className="address">
        <Typography variant="h6">
          <Link
            href={`https://www.google.com/maps/place/${encodeURI(
              street_address
            )}`}
          >
            {street_address}
          </Link>
        </Typography>
        <If condition={address.length_of_residence}>
          <Typography variant="body1">
            <b>Length Of Residence:</b>
            {address.length_of_residence}
          </Typography>
        </If>
        <If condition={address.dwelling_type}>
          <Typography variant="body1">
            <b>Dwelling Type:</b>
            {address.dwelling_type}
          </Typography>
        </If>
        <If condition={address.homeowner_type}>
          <Typography variant="body1">
            <b>Homeowner Type:</b>
            {address.homeowner_type}
          </Typography>
        </If>
        <If condition={address.address_line_3}>
          <Typography variant="body1">
            <b>Address Line 3:</b>
            {address.address_line_3}
          </Typography>
        </If>
        <If condition={address.county_number}>
          <Typography variant="body1">
            <b>County Number:</b>
            {address.county_number}
          </Typography>
        </If>
        <If condition={address.county_name}>
          <Typography variant="body1">
            <b>County Name:</b>
            {address.county_name}
          </Typography>
        </If>
        <If condition={address.first_in_household}>
          <Typography variant="body1">
            <b>First In Household:</b>
            {address.first_in_household}
          </Typography>
        </If>
        <If condition={address.mfdu}>
          <Typography variant="body1">
            <b>Mfdu:</b>
            {address.mfdu}
          </Typography>
        </If>
        <If condition={address.dpv_code}>
          <Typography variant="body1">
            <b>Dpv Code:</b>
            {address.dpv_code}
          </Typography>
        </If>
        <If condition={address.zenstimate && address.zenstimate !== "0"}>
          <Typography variant="body1">
            <b>Property Value Est:</b> $
            {String(address.zenstimate).includes("k")
              ? address.zenstimate
              : parseInt(address.zenstimate).toLocaleString()}{" "}
          </Typography>
        </If>
        <If condition={address.high_percent}>
          <Typography variant="body1">
            <b>High Percent:</b> {address.high_percent}
          </Typography>
        </If>
        <If condition={address.low_percent}>
          <Typography variant="body1">
            <b>Low Percent:</b> {address.low_percent}
          </Typography>
        </If>
        <If condition={address.minus30}>
          <Typography variant="body1">
            <b>Minus30:</b> {address.minus30}
          </Typography>
        </If>
        <If
          condition={address.rent_zenstimate && address.rent_zenstimate !== "0"}
        >
          <Typography variant="body1">
            <b>Property Rent Est:</b> $
            {String(address.rent_zenstimate).includes("k")
              ? address.rent_zenstimate
              : parseInt(address.rent_zenstimate).toLocaleString()}{" "}
          </Typography>
        </If>
        <If condition={address.rental_high_percent}>
          <Typography variant="body1">
            <b>Rental High Percent:</b> {address.rental_high_percent}
          </Typography>
        </If>
        <If condition={address.rental_low_percent}>
          <Typography variant="body1">
            <b>Rental Low Percent:</b> {address.rental_low_percent}
          </Typography>
        </If>
        <If condition={address.bedrooms}>
          <Typography variant="body1">
            <b>Bedrooms:</b> {address.bedrooms}
          </Typography>
        </If>
        <If condition={address.bathrooms}>
          <Typography variant="body1">
            <b>Bathrooms:</b> {address.bathrooms}
          </Typography>
        </If>
        <If condition={address.finished_square_footage}>
          <Typography variant="body1">
            <b>Finished Square Footage:</b> {address.finished_square_footage}
          </Typography>
        </If>
        <If condition={address.lot_size_square_footage}>
          <Typography variant="body1">
            <b>Lot Size Square Footage:</b> {address.lot_size_square_footage}
          </Typography>
        </If>
        <If condition={address.home_description}>
          <Typography variant="body1">
            <b>Home Description:</b> {address.home_description}
          </Typography>
        </If>
        <If condition={address.yearbuilt}>
          <Typography variant="body1">
            <b>Year Built:</b> {address.yearbuilt}
          </Typography>
        </If>
      </div>
      <Divider />
    </div>
  );
};
export default Address;
