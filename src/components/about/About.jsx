import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function About() {
  return (
    <>
      <section className="page-header -type-1 mt-80">
        <div className="container">
          <div className="page-header__content">
            <div className="row justify-center text-center">
              <div className="col-auto">
                <div>
                  <h1 className="page-header__title">About Us</h1>
                </div>

                <div>
                  <p className="page-header__text">
                  Upgrade your photos with our top-notch rental equipment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-50 justify-between items-center">
            <div className="col-lg-6 pr-50 sm:pr-15">
              <div className="composition -type-8">
                <div className="-el-1">
                  <Image
                    width={300}
                    height={400}
                    src="/assets/img/home-1/hero/full1.png"
                    alt="image"
                  />
                </div>
                <div className="-el-2">
                  <Image
                    width={200}
                    height={200}
                    src="/assets/img/home-1/hero/full2.png"
                    alt="image"
                  />
                </div>
                <div className="-el-3">
                  <Image
                    width={255}
                    height={250}
                    src="/assets/img/home-1/hero/full4.png"
                    alt="image"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <h2 className="text-30 lh-16">
              Capture Moments with Premier Wedding Photoshoot Rentals              </h2>
              <p className="text-dark-1 mt-30">
              Atlas fotobooth specializes in delivering exceptional moments with our top-tier wedding photoshoot equipment rentals. We provide premium photo booths and professional gear that enhance every event, driven by a commitment to perfection.
              </p>
              <p className="pr-50 lg:pr-0 mt-25">
              With extensive experience in the event industry, we ensure meticulous attention to detail. Like Pop Up Photo Booth MD, we prioritize quality and client satisfaction, maintaining a stellar 5-star rating on platforms like Google. Trust Atlas fotobooth to capture priceless memories on your special day, creating moments that will be cherished forever.
              </p>
              {/* <div className="d-inline-block">
                <Link
                  href="/signup"
                  className="button -md -purple-1 text-white mt-30"
                >
                  Start Learning For Free
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
