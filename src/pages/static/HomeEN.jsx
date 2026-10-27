import React from "react";
import { Link } from "react-router-dom";
import { ContactForm } from "../../components/ContactForm.jsx";
import { asset } from "../../lib/assets.js";

export default function HomeEN() {
  return (
    <>
      <div
        className="wp-block-cover alignfull has-custom-content-position is-position-top-center has-border-color has-light-border-color has-custom-css wp-custom-css-ebde3099"
        style={{ borderWidth: "2px" }}
      >
        <img
          loading="lazy"
          decoding="async"
          width="1024"
          height="572"
          className="wp-block-cover__image-background wp-image-1154 size-large"
          alt=""
          src={asset(
            "assets/9bc4d933-Gemini_Generated_Image_2er9w42er9w42er9-2048x1143.webp",
          )}
          data-object-fit="cover"
        />
        <span
          aria-hidden="true"
          className="wp-block-cover__background has-color-2-background-color has-background-dim-60 has-background-dim"
        ></span>
        <div className="wp-block-cover__inner-container is-layout-flow wp-block-cover-is-layout-flow">
          {"\n"}
          <div
            className="wp-block-group has-global-padding is-layout-constrained wp-container-core-group-is-layout-a4b709fd wp-block-group-is-layout-constrained"
            style={{
              borderTopColor: "#ffffff4d",
              borderTopWidth: "1px",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
          >
            {"\n"}
            <div className="wp-block-buttons leaf-pill-nav leaf-pill-nav-en is-content-justification-center is-layout-flex wp-container-core-buttons-is-layout-851737ba wp-block-buttons-is-layout-flex">
              {"\n"}
              <div className="wp-block-button is-style-outline leaf-pill-btn leaf-pill-btn-1 is-style-outline--1">
                <Link
                  className="wp-block-button__link has-medium-font-size has-custom-font-size wp-element-button"
                  to="/en/buy-2/"
                >
                  {"BUY"}
                </Link>
              </div>
              {"\n\n\n\n"}
              <div className="wp-block-button is-style-outline leaf-pill-btn leaf-pill-btn-2 is-style-outline--2">
                <Link
                  className="wp-block-button__link has-medium-font-size has-custom-font-size wp-element-button"
                  to="/en/rent/"
                >
                  {"RENT"}
                </Link>
              </div>
              {"\n\n\n\n"}
              <div className="wp-block-button is-style-outline leaf-pill-btn leaf-pill-btn-3 is-style-outline--3">
                <Link
                  className="wp-block-button__link has-medium-font-size has-custom-font-size wp-element-button"
                  to="/en/sale/"
                >
                  {"SELL"}
                </Link>
              </div>
              {"\n"}
            </div>
            {"\n"}
          </div>
          {"\n\n\n\n"}
          <p
            className="has-text-align-center has-color-1-color has-text-color has-link-color wp-elements-e8052d04c085a31d33b18c626852910e wp-block-paragraph"
            style={{
              marginTop: "220px",
              fontSize:
                "clamp(15.747px, 0.984rem + ((1vw - 3.2px) * 1.058), 24px)",
              letterSpacing: "3px",
            }}
          >
            {"LEAF PROPERTIES & PARTNERS | ATHENS"}
          </p>
          {"\n\n\n\n"}
          <hr className="wp-block-separator has-alpha-channel-opacity" />
          {"\n"}
        </div>
      </div>
      {"\n"}
    </>
  );
}
