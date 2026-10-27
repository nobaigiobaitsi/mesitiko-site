import React from "react";
import { Link } from "react-router-dom";
import { ContactForm } from "../../components/ContactForm.jsx";
import { asset } from "../../lib/assets.js";

export default function SellEN() {
  return (
    <>
      <div
        className="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        data-aos="fade-up"
        style={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
        {"\n"}
        <div
          className="wp-block-group alignwide is-layout-grid wp-container-core-group-is-layout-57453441 wp-block-group-is-layout-grid"
          data-aos="fade-up"
        >
          {"\n"}
          <div className="wp-block-columns are-vertically-aligned-center is-layout-flex wp-container-core-columns-is-layout-7094c525 wp-block-columns-is-layout-flex">
            {"\n"}
            <div
              className="wp-block-column is-vertically-aligned-center is-layout-flow wp-block-column-is-layout-flow"
              style={{ flexBasis: "100%" }}
            >
              {"\n"}
              <h1 className="wp-block-heading has-text-align-center">
                <strong>{"Responsible Management & Sale"}</strong>
              </h1>
              {"\n\n\n\n"}
              <p className="alignwide wp-block-paragraph">
                {
                  "We guide the sale of your property with absolute security and a strategic structure, ensuring the best possible outcome. With modern promotion tools and deep market knowledge, we guarantee complete transparency at every stage."
                }
              </p>
              {"\n\n\n\n"}
              <div className="wp-block-buttons is-content-justification-center is-layout-flex wp-container-core-buttons-is-layout-851737ba wp-block-buttons-is-layout-flex">
                {"\n"}
                <div className="wp-block-button">
                  <Link
                    className="wp-block-button__link has-light-color has-text-color has-background has-link-color wp-element-button"
                    to="/en/services/"
                    style={{
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                      backgroundColor: "#1b4332",
                    }}
                  >
                    <strong>{"SERVICES"}</strong>
                  </Link>
                </div>
                {"\n"}
              </div>
              {"\n"}
            </div>
            {"\n\n\n\n"}
            <div
              className="wp-block-column is-vertically-aligned-center is-layout-flow wp-block-column-is-layout-flow"
              style={{ flexBasis: "100%" }}
            >
              {"\n"}
              <div className="wp-block-cover">
                <img
                  loading="lazy"
                  decoding="async"
                  width="683"
                  height="1024"
                  className="wp-block-cover__image-background wp-image-1016 size-large"
                  alt=""
                  src={asset(
                    "assets/f4e4a2e0-848677c64d0ab5163b2f783cfb6bff04-683x1024.webp",
                  )}
                  data-object-fit="cover"
                />
                <span
                  aria-hidden="true"
                  className="wp-block-cover__background has-background-dim-20 has-background-dim"
                  style={{ backgroundColor: "#564935" }}
                ></span>
                <div className="wp-block-cover__inner-container has-global-padding is-layout-constrained wp-block-cover-is-layout-constrained">
                  {"\n"}
                  <div className="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
                    {"\n"}
                    <div
                      className="wp-block-group has-background has-global-padding is-layout-constrained wp-container-core-group-is-layout-0ab0b8ad wp-block-group-is-layout-constrained"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        paddingTop: "24px",
                        paddingRight: "24px",
                        paddingBottom: "24px",
                        paddingLeft: "24px",
                      }}
                    >
                      {"\n"}
                      <ContactForm lang="en" kind="sell" />
                      {"            "}
                      {"\n            \n\n"}
                    </div>
                    {"\n"}
                  </div>
                  {"\n"}
                </div>
              </div>
              {"\n"}
            </div>
            {"\n"}
          </div>
          {"\n"}
        </div>
        {"\n"}
      </div>
      {"\n\n\n\n"}
      <p className="wp-block-paragraph"></p>
      {"\n"}
    </>
  );
}
