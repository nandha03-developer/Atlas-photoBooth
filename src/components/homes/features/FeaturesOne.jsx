import React from "react";
import Image from "next/image";
import { featureOne, featureOnes } from "../../../data/features";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import pic from "../../../public/assets/img/homeatlas/home6.jpeg";

export default function LearnNewSkill() {
  return (
    <section className="layout-pt-lg layout-pb-lg bg-beige-1">
      <div className="container">
        <div className="row y-gap-30 justify-between items-center">
          <div className="col-xl-5 col-lg-6 col-md-10 order-2 order-lg-1">
            <div className="about-content">
              <p
                className="about-content__title customSized heading"
                data-aos="fade-up"
                style={{ lineHeight: "1.5" }}
              >
                <span>Capture </span> timeless moments, anytime, anywhere with
                Atlas Fotobooth.
              </p>
              <p
                className="about-content__text para"
                data-aos="fade-up"
                style={{ fontSize: "16px" }}
              >
                Highlighting Atlas Fotobooth
              </p>
              <div className="y-gap-20 pt-30 para">
                {featureOnes.map((elm, i) => (
                  <div
                    key={i}
                    className="d-flex items-center"
                    data-aos="fade-up"
                  >
                    <div className="about-content-list__icon">
                      <span
                        className="text-white"
                        style={{
                          fontSize: "10px",
                          fontWeight: "300",
                        }}
                        aria-hidden="true"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    </div>
                    <div className="about-content-list__title">
                      <p className="para" style={{ fontSize: "16px" }}>
                        {elm.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="col-xl-5 col-lg-6 order-1 order-lg-2"
            data-aos="fade-up"
          >
            <div className="about-image">
              <Image
                className="brd-10"
                width={1000} // Match the style width
                height={1000} // Match the style height
                style={{ width: '550px', height: '450px' }}
                src={pic}
                alt="image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
