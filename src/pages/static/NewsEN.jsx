import React from "react";
import { Link } from "react-router-dom";
import { ContactForm } from "../../components/ContactForm.jsx";
import { asset } from "../../lib/assets.js";

export default function NewsEN() {
  return (
    <>
      <div
        className="wp-block-group alignwide has-background is-layout-flow wp-block-group-is-layout-flow"
        style={{
          backgroundColor: "#f8f9fa",
          marginTop: "0",
          marginBottom: "0",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        {"\n"}
        <h2
          className="wp-block-heading has-text-align-center"
          style={{ letterSpacing: "2px", textTransform: "uppercase" }}
        >
          {"INSIGHTS & ANALYSIS"}
        </h2>
        {"\n\n\n\n"}
        <hr className="wp-block-separator has-alpha-channel-opacity style-wide" />
        {"\n\n\n\n"}
        {"\n\n\n\n"}
        <div className="wp-block-columns alignfull is-layout-flex wp-container-core-columns-is-layout-ff876a77 wp-block-columns-is-layout-flex">
          {"\n"}
          <div
            className="wp-block-column leaf-card-dark has-background is-layout-flow wp-block-column-is-layout-flow"
            style={{
              borderRadius: "12px",
              backgroundColor: "#1b4332",
              paddingTop: "28px",
              paddingRight: "28px",
              paddingBottom: "28px",
              paddingLeft: "28px",
              flexBasis: "33.33%",
            }}
          >
            {"\n"}
            <div className="wp-block-cover has-custom-css wp-custom-css-48c8629e">
              <img
                loading="lazy"
                decoding="async"
                width="909"
                height="1024"
                className="wp-block-cover__image-background wp-image-1166 size-large"
                alt=""
                src={asset("assets/669203d4-living-room-new-909x1024.webp")}
                data-object-fit="cover"
              />
              <span
                aria-hidden="true"
                className="wp-block-cover__background has-background-dim-90 has-background-dim wp-block-cover__gradient-background has-background-gradient"
                style={{
                  background:
                    "linear-gradient(180deg,rgba(27,67,50,0) 0%,rgb(27,67,50) 100%)",
                }}
              ></span>
              <div className="wp-block-cover__inner-container is-layout-flow wp-block-cover-is-layout-flow">
                {"\n"}
                <h3
                  className="wp-block-heading has-text-align-center has-light-color has-text-color"
                  style={{
                    fontSize:
                      "clamp(0.875rem, 0.875rem + ((1vw - 0.2rem) * 0.769), 1.25rem)",
                  }}
                >
                  {"LEAF Workflow"}
                </h3>
                {"\n\n\n\n"}
                <p
                  className="has-text-color wp-block-paragraph"
                  style={{ color: "#ffffff" }}
                >
                  {
                    "Every property comes with a number — the least of its documentation. How the market is mapped, recorded, and translated into a well-documented decision."
                  }
                </p>
                {"\n\n\n\n"}
                <div className="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
                  {"\n"}
                  <div className="wp-block-button has-custom-width wp-block-button__width-100">
                    <Link
                      className="wp-block-button__link has-text-color has-background wp-element-button"
                      to="/en/the-leaf-workflow/"
                      style={{
                        borderRadius: "4px",
                        color: "#1b4332",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {"Full Article"}
                    </Link>
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
      {"\n\n\n\n"}
      <p className="wp-block-paragraph"></p>
      {"\n"}
    </>
  );
}
