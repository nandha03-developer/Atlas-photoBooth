import React from "react";
import { steps } from "../../data/steps";
import Image from "next/image";
import Link from "next/link";


export default function WhyCourse() {
  return (
    // <section className="layout-pt-lg layout-pb-lg bg-dark-2">
       <section className="layout-pt-md layout-pb-lg bg-dark-2">
        <div className="container">
          <div className="row y-gap-50 justify-between items-center">
            

            <div className="col-lg-5">
              <h2 className="text-light-3 lh-16">
              Using Atlas fotobooth to Enhance Every Event
              </h2>
              <p className="text-light-2 mt-30">
              Our wide range of booths, backdrops, and accessories guarantees a great fit for any event style, from little get-togethers to lavish weddings and business events.
              </p>
              <p className="pr-50 lg:pr-0 mt-25 text-light-2">
              Our crew promises a five-star experience whether you're looking for great photo souvenirs or interactive guest entertainment. Find out why Last fotobooth is the best option for preserving memories and recording happy moments on any occasion. 
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
            <div className="col-lg-6 pr-50 sm:pr-15">
              <div className="composition -type-8">
                <div className="-el-1">
                  <Image
                    width={300}
                    height={400}
                    src="/assets/img/home-1/hero/images_3.png"
                    alt="image"
                  />
                </div>
                <div className="-el-2">
                  <Image
                    width={255}
                    height={250}
                    src="/assets/img/home-1/hero/image_1.jpg"
                    alt="image"
                  />
                </div>
                <div className="-el-3">
                  <Image
                    width={255}
                    height={250}
                    src="/assets/img/home-1/hero/frame_2.png"
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    // </section>
  );
}
