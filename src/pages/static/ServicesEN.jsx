import React from "react";
import { Link } from "react-router-dom";
import { ContactForm } from "../../components/ContactForm.jsx";
import { asset } from "../../lib/assets.js";

export default function ServicesEN() {
  return (
    <>
      {"\n\n"}
      <div
        className="leaf-services-wrap alignwide"
        style={{ position: "relative", padding: "20px 10px" }}
      >
        {"\n  "}
        <div style={{ position: "relative", zIndex: "1" }}>
          {"\n    "}
          <h2
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "2em",
              marginBottom: "40px",
              color: "#1b4332",
            }}
          >
            {"SERVICES"}
          </h2>
          {"\n    "}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "40px",
              justifyContent: "center",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"1. Project Management & Construction Development"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {"In strategic partnership with the construction company "}
                <a
                  href="https://www.dgncon.com/"
                  target="_blank"
                  rel="noopener"
                >
                  {"DGN Construction IKE"}
                </a>
                {
                  ", we undertake the complete design and execution of upgrade projects. The goal is to maximize the property’s commercial value, delivering fully completed turnkey investment projects. Expected profit is calculated in advance, offering solutions with fully measurable returns."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"2. Rigorous Legal & Technical Due Diligence"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {
                  "Every transaction is safeguarded through a rigorous, proactive legal and technical inspection. Our specialized partners fully map out every potential risk, ensuring the complete legality of the investment well before final signing. Urban planning and legal data are analyzed with transparency, protecting the interests of all parties at every stage of the process."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"3. Golden Visa & Relocation Services"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {
                  "We provide comprehensive, multilingual support to international individuals and investors seeking a residence permit or relocation. Specialized research is carried out and personalized guidance is offered, tailored strictly to the specifics and requirements of each case. From selecting the ideal property, based on current legislative limits, to the final processing of documents, every stage is coordinated swiftly. Full support is provided at every step, freeing clients from having to deal with complex bureaucratic procedures. For a more detailed overview of the process, an in-depth informational guide on this service is available for immediate download."
                }
              </p>
              {"\n        "}
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <a
                  href={asset("assets/LEAF-Golden-Visa.pdf")}
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    backgroundColor: "#1b4332",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  }}
                >
                  {"READ MORE"}
                </a>
              </div>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"4. Targeted Market Research & Mapping"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {
                  "Specialized market research is conducted, responding precisely to each investment requirement. Through detailed area mapping and systematic trend monitoring, properties that meet specific demand criteria are identified. The approach is based strictly on data analysis, enabling the safe and targeted discovery of high-performing options."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"5. Strategic Valuation & Pricing"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {
                  "A property’s value is determined strategically, based exclusively on real market data and modern comparative analysis models. Well-documented reports are prepared that objectively explain the factors influencing price. This ensures clear forecasts and creates a strong advantage for subsequent negotiations."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"6. Professional Promotion & Targeted Marketing"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {
                  "The promotion of each property is approached as a distinct, standalone project. A tailored promotional strategy is designed to professionally highlight the unique features and commercial value of each space. Through targeted digital strategies, a personalized presentation of the property is delivered."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={{ flex: "1 1 45%", minWidth: "300px", maxWidth: "500px" }}
            >
              {"\n        "}
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1b4332",
                }}
              >
                {"7. Investment Strategies & Capital Management"}
              </h3>
              {"\n        "}
              <p style={{ textAlign: "justify" }}>
                {
                  "Available capital is matched with carefully selected opportunities, offering specialized investment solutions. Personalized proposals are created with clear, measurable ROI figures and realistic risk analysis. The primary goal remains the transparent use of resources, aiming to build long-term relationships of trust with the investor community."
                }
              </p>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </div>
        {"\n"}
      </div>
      {"\n"}
    </>
  );
}
