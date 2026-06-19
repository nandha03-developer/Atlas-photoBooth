import React, { useEffect, useRef, useState } from "react";
// import { topCatagoriesFive } from "../../../data/topCategories";
// import { occassion } from "../../../data/occassion";
import { occassion } from "../../../data/occassion";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";


export default function CategoriesOccassion() {
  const hasSubmitted = useRef(false);
  // const [reviews, setReviews] = useState([]);
  const [packageList, setPackageList] = useState([]);

  useEffect(() => {
    // Check if the function has already been called
    if (!hasSubmitted.current) {
      // fetchAddOns();
      fetchPackages();
      // fetchOccasions();
      hasSubmitted.current = true;
    }
  }, []);
  
  const fetchPackages = () => {
    const query = `query MyQuery {
      listTopCategories {
        Totalcount
        items {
          Category_image
          Description
          Heading
          id
        }
      }
    }`
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listTopCategories?.items || [];
        setPackageList(userDetails);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  
  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-20 justify-center items-end">
          <div className="col-auto">
            <div className="sectionTitle text-center">
              <p className="sectionTitle__title heading">Top Categories</p>
            </div>
          </div>

          {/* <div className="col-auto">
            <a href="#" className="button -icon -purple-3 text-purple-1">
              All Categories
              <i className="icon-arrow-top-right text-13 ml-10"></i>
            </a>
          </div> */}
        </div>

        <div className="row y-gap-30 pt-50">
          {packageList.map((elm, i) => (
            <div
              // href={`/courses-list-${elm.id > 8 ? 1 : elm.id}`}
              className="col-xl-4 col-md-6 linkCustomTwo"
              key={i}
              data-aos="zoom-in"
              data-aos-duration={(i + 1) * 300}
            >
              <div className="categoryCard -type-4" >
                {/* <div className="categoryCard__icon bg-light-3" style={{borderRadius:"20px"}}> */}
                  {/* <i className={elm.icon}></i> */}
                  {/* <img src={`/assets/img/home/categories/${elm.image}`} alt='img'/>  */}
                  {/* <Image className="brd-10" src={`/assets/img/home/categories/${elm.Category_image}`} height={400} width={400} alt=""/> */}
                  <Image className="brd-10" src={elm.Category_image} height={400} width={400} alt="" style={{ width: 'auto', height: 'auto' }}/>

                {/* </div> */}
                <div className="categoryCard__content mt-10">
                  <h4 className="categoryCard__title text-20 fw-500 heading">
                    {elm.Heading}
                  </h4>
                  <div className="categoryCard__text text-13 text-light-1 lh-1 mt-5 para">
                    <p>{elm.Description} </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}