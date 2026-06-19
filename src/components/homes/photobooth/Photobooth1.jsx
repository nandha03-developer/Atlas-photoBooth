"use client";

import { useState, useEffect, useRef } from "react";
import "swiper/css";
import React from "react";
import { categories } from "../../../data/categories";
import { AddonsData } from "../../../data/learningPaths";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import logo from "../../../public/assets/img/logo/logo72.svg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { List, OrderedSet } from "immutable";
// import { convertFromHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import dynamic from "next/dynamic";

const Editor =
  typeof window !== "undefined"
    ? dynamic(() =>
        import("react-draft-wysiwyg").then((module) => module.Editor)
      )
    : undefined;

// const customStyleMap = {
//   RED: {
//     color: 'red',
//   },
//   BOLD: {
//     fontWeight: 'bold',
//   },
//   BULLET: {
//     listStyleType: 'bullet',
//   },
//   NUMBER: {
//     listStyleType: 'decimal',
//   },
// };
const customStyleMap = {
  RED: {
    color: "rgb(209,72,65)",
  },
  BOLD: {
    fontWeight: "bold",
  },
  BULLET: {
    listStyleType: "bullet",
  },
  NUMBER: {
    listStyleType: "decimal",
  },
  COLOR: (color) => ({
    color: color,
  }),
};

export default function SkillsOne() {
  const [isHovered, setIsHovered] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const [addOnsName, setAddOnsName] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [singleStore, setSingleStore] = useState(null);
  const [data, setData] = useState([]);
  const [editorState, setEditorState] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setShowSlider(true);
  }, []);

  const handleClick = (e) => {
    router.push(`/booknow?title=${e.title}&rentalDuration=${e.rentalDuration}`);
  };
  //   const fetchPackages = () => {
  //     setLoading(true);
  //     const query = `
  //       query MyQuery {
  //   listPackages {
  //     items {
  //       Content
  //       Hours
  //       PackageName
  //       Price
  //       Status
  //       UID
  //     }
  //   }
  // }
  //     `;
  //     const headers = {
  //       "x-api-key": "da2-ayrlrqjwu5dazeu6zzoaz3notu",
  //       "Content-Type": "application/json",
  //     };
  //     const endPoint = process.env.NEXT_PUBLIC_API_URL;
  //     axios
  //       .post(endPoint, { query }, { headers })
  //       .then((res) => {
  //         const userDetails = res.data?.data?.listPackages?.items || [];
  //         setPackageList(userDetails);
  //         setLoading(false);

  //         const editorContent = packages.map((pkg) => {
  //           const blocksFromHTML = convertFromHTML(pkg.Content || "");
  //           const contentState = ContentState.createFromBlockArray(
  //             blocksFromHTML.contentBlocks,
  //             blocksFromHTML.entityMap
  //           );
  //           return EditorState.createWithContent(contentState);
  //         });
  //         setEditorStates(editorContent);
  //         setLoading(false);
  //         const foundData = dataWithSerialNumber.find(data => data.URL === id);
  //         setSingleStore(foundData);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching data:", err);
  //       });
  //   };

  const fetchPackages = () => {
    setLoading(true);
    const query = `
    query MyQuery {
      listPackages {
        items {
          Content
          Hours
          PackageName
          Price
          Status
          UID
        }
      }
    }
  `;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;

    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listPackages?.items || [];
        setPackageList(userDetails);
        // Create editor states for each package
        const editorContent = userDetails.map((pkg) => {
          const blocksFromHTML = convertFromHTML(pkg.Content || "");
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          return EditorState.createWithContent(contentState);
        });
        setEditorState(editorContent); // Update editor states
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const fetchAddOns = () => {
    setLoading(true);
    const query = `
      query list {
  listAddOns {
    Totalcount
    items {
      Description
      Image
      Name
      Status
      id
      Price
    }
  }
}
    `;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listAddOns?.items || [];

        setAddOns(userDetails);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  const hasSubmitted = useRef(false);

  useEffect(() => {
    // Check if the function has already been called
    if (!hasSubmitted.current) {
      fetchAddOns();
      fetchPackages();
      // fetchOccasions();
      hasSubmitted.current = true;
    }
  }, []);

  const createEditorStateFromHTML = (html) => {
    if (html) {
      html = html.replace(/^"|"$/g, "");
      html = html.replace(/\\"/g, '"').replace(/\\n/g, "");
      const blocksFromHTML = convertFromHTML(html);
      const updatedBlocks = blocksFromHTML.contentBlocks.map((block) => {
        if (block.getType() === "unordered-list-item") {
          return block.set("data", OrderedSet.of("BULLET"));
        }
        if (block.getType() === "ordered-list-item") {
          return block.set("data", OrderedSet.of("NUMBER"));
        }
        return block;
      });

      const updatedContentState = ContentState.createFromBlockArray(
        List(updatedBlocks),
        blocksFromHTML.entityMap
      );

      const editorState = EditorState.createWithContent(updatedContentState);
      return editorState;
    }
    return EditorState.createEmpty();
  };

  const [showMoreIndex, setShowMoreIndex] = useState(null);

  const handleShowMore = (index) => {
    setShowMoreIndex(showMoreIndex === index ? null : index); // Toggle between expanding or collapsing
  };

  useEffect(() => {
    if (packageList && packageList.Content) {
      const editorStateFromAPI = createEditorStateFromHTML(packageList.Content);
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [editorState]);

  const handleRouteContact = () => {
    router.push("/contactus");
  };
  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <Image
  //         src={logo}
  //         alt="loading"
  //         width={100}
  //         height={100}
  //         className="zoom-image"
  //       />
  //     </div>
  //   );
  // }
  return (
    <section
      className="layout-pt-lg layout-pb-lg"
      style={{
        background: `linear-gradient(to bottom, #f1e4f1 40%, white 40%)`,
      }}
    >
      <div className="container">
        <div className="row y-gap-20 justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle ">
              <p className="sectionTitle__title heading text-50 pt-50">
                photo booth packages
              </p>

              <p
                className="sectionTitle__text para text-20 pt-20"
                style={{ lineHeight: "50px" }}
              >
                Create lasting memories with our exceptional photo booth
                packages
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-50">
        {/* <div className="row justify-content-center">
         
           {packageList.map((el, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  textAlign: "center",
                  backgroundColor: "white",
                  height: "600px",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.2)";
                  e.currentTarget.style.transform = "scale(1.01)";
                  setHoveredIndex(index);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                  setHoveredIndex(null);
                }}
              >
                <div
                  style={{
                    // backgroundColor: `#A64CA6`,
                    backgroundColor:
                      hoveredIndex === index ? "#800080" : "#A64CA6", // Change color on hover
                    color: "white",
                    padding: "20px 0",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    className="heading"
                  >
                    {el.PackageName}
                  </p>
                </div>

                <div style={{ padding: "20px 20px 0px 20px", flexGrow: 1 }}>
                  {" "}
                  <p
                    style={{
                      paddingTop: "10px",
                      textAlign: "justify",
                      fontSize: "13px",
                      fontWeight: 550,
                    }}
                    className="para"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: el.Content?.replace(/\s+/g, " ").trim(),
                      }}
                    />
                  </p>
                </div>
                <div className="horizondal-line" />

                <Button
                  className="button-font"
                  onClick={() => handleClick(el)}
                  style={{
                    fontSize: "15px",
                    color: "purple !important",
                    margin: "20px 0",
                    textTransform: "capitalize",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#5441ad";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#800080";
                  }}
                >
                  Starting ${el.Price}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {Editor && (
          <Editor
            editorState={editorState}
            toolbarHidden
            readOnly
            // customStyleMap={customStyleMap}
            toolbarClassName="hide-toolbar"
            wrapperClassName="editor-wrapper"
            editorClassName="editor-content"
          />
        )} */}

        <div className="container mt-50">
          <div className="row justify-content-center">
            {packageList.length === 0
              ? [...Array(4)].map((_, index) => (
                  <div key={index} className="col-lg-3 col-md-6 mb-4">
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                        textAlign: "center",
                        backgroundColor: "white",
                        height: "590px", // Adjust height to show skeleton loader
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Skeleton for Package Name */}
                      <div
                        style={{
                          backgroundColor: "#A64CA6",
                          color: "white",
                          padding: "20px 0",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-loading 1.5s infinite",
                            height: "20px",
                            width: "60%",
                            borderRadius: "4px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>

                      {/* Skeleton for Content */}
                      <div
                        style={{
                          padding: "20px",
                          flexGrow: 1,
                          overflowY: "hidden",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-loading 1.5s infinite",
                            height: "100px",
                            width: "100%",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>

                      {/* Skeleton for Show More Button */}
                      <div
                        style={{
                          marginTop: "auto",
                          padding: "10px 0",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-loading 1.5s infinite",
                            height: "30px",
                            width: "60%",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>

                      {/* Skeleton for Button */}
                      <div style={{ marginTop: "auto", padding: "10px 0" }}>
                        <div
                          style={{
                            background:
                              "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-loading 1.5s infinite",
                            height: "40px",
                            width: "80%",
                            borderRadius: "4px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              : packageList.map((pkg, index) => {
                  // Calculate if content has more than 8 lines
                  const contentLines =
                    editorState[index]
                      ?.getCurrentContent()
                      ?.getPlainText()
                      ?.split("\n").length || 0;
                  const hasMoreContent = contentLines > 8;

                  return (
                    <div key={index} className="col-lg-3 col-md-6 mb-4">
                      <div
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          overflow: "hidden",
                          textAlign: "center",
                          backgroundColor: "white",
                          height: showMoreIndex === index ? "auto" : "590px", // Adjust height based on showMoreIndex
                          display: "flex",
                          flexDirection: "column",
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <div
                          style={{
                            backgroundColor:
                              hoveredIndex === index ? "#800080" : "#A64CA6",
                            color: "white",
                            padding: "20px 0",
                          }}
                        >
                          <p
                            className="heading"
                            style={{
                              color: "white",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >
                            {pkg.PackageName}
                          </p>
                        </div>

                        <div
                          style={{
                            padding: "20px",
                            flexGrow: 1,
                            overflowY: "hidden",
                          }}
                        >
                          {editorState[index] && (
                            <Editor
                              editorState={editorState[index]}
                              toolbarHidden
                              readOnly
                              wrapperClassName="editor-wrapper"
                              editorClassName="editor-content"
                              toolbarClassName="editor-toolbar"
                              customStyleMap={customStyleMap}
                            />
                          )}
                        </div>

                        {hasMoreContent && (
                          <div>
                            <button onClick={() => handleShowMore(index)}>
                              {showMoreIndex === index
                                ? "Show Less"
                                : "Show More"}
                            </button>
                          </div>
                        )}

                        <div style={{ marginTop: "auto", padding: "10px 0" }}>
                          {pkg?.Price !== 0 ? (
                            <Button
                              className="button-font"
                              onClick={() => handleClick(pkg)}
                              style={{
                                fontSize: "15px",
                                color: "purple",
                                textTransform: "capitalize",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.color = "#5441ad")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.color = "#800080")
                              }
                            >
                              Starting ${pkg.Price}
                            </Button>
                          ) : (
                            <Button
                              className="button-font"
                              onClick={() => handleRouteContact()}
                              style={{
                                fontSize: "15px",
                                color: "purple",
                                textTransform: "capitalize",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.color = "#5441ad")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.color = "#800080")
                              }
                            >
                              Contact Us
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        <div style={{ marginTop: "70px", marginBottom: "70px" }}>
          <div style={{ textAlign: "center", margin: "20px 0px " }}>
            <button
              className="button-font brd-10"
              style={{
                backgroundColor: "#800080",
                padding: "10px 30px",
                border: "none",

                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#5441ad"; // Darken on hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#800080"; // Reset to original color
              }}
            >
              Add-On
            </button>
          </div>
          <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    width: "80%",
    margin: "auto",
  }}
>
  {addOns.length === 0 ? (
    [...Array(6)].map((_, i) => (
      <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Skeleton for Add-on Name */}
        <div
          style={{
            background: "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-loading 1.5s infinite",
            height: "20px",
            width: "150px", // Adjust width as needed
            borderRadius: "4px",
            marginBottom: "5px",
          }}
        ></div>

        {/* Skeleton for Add-on Price */}
        <div
          style={{
            background: "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-loading 1.5s infinite",
            height: "20px",
            width: "80px", // Adjust width as needed
            borderRadius: "4px",
            marginBottom: "5px",
          }}
        ></div>
      </div>
    ))
  ) : (
    addOns.map((el, i) => (
      <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>
        <p
          style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}
          className="para"
        >
          {el.Name}
        </p>
        <p
          style={{
            margin: "1px",
            fontWeight: "lighter",
            color: "purple",
            fontSize: "17px",
          }}
          className="para"
        >
          ${el.Price}
        </p>
      </div>
    ))
  )}
</div>

        </div>
      </div>
    </section>
  );
}
