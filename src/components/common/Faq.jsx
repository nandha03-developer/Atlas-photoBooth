"use client";

import React, { useEffect, useRef, useState } from "react";
import { faq } from "../../data/faq";
import { useRouter } from "next/navigation";

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import Link from "next/link";
import axios from "axios";
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

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(0);
  const hasSubmitted = useRef(false);

  const [packageList, setPackageList] = useState([]);
  const [editorState, setEditorState] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Check if the function has already been called
    if (!hasSubmitted.current) {
      // fetchAddOns();
      fetchfaq();
      // fetchOccasions();
      hasSubmitted.current = true;
    }
  }, []);

  const fetchfaq = () => {
    const query = `query MyQuery {
  listFaqs {
    Totalcount
    items {
      Description
      Heading
      id
    }
  }
}`;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listFaqs?.items || [];
        setPackageList(userDetails);
        const editorContent = userDetails.map((pkg) => {
          const blocksFromHTML = convertFromHTML(pkg.Description || "");
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

  useEffect(() => {
    if (packageList && packageList.Description) {
      const editorStateFromAPI = createEditorStateFromHTML(
        packageList.Description
      );
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [editorState]);

  return (
    <section
      className="layout-pt-lg layout-pb-lg bg-light-4"
      style={{ marginTop: "30px" }}
    >
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-xl-8 col-lg-9 col-md-11">
            <div className="sectionTitle ">
              <p className="sectionTitle__title heading">
                Frequently Asked Questions.
              </p>

              <p
                className="sectionTitle__text para"
                style={{ fontSize: "20px" }}
              >
                Our most commonly asked questions
              </p>
            </div>

            <div className="accordion -block text-left pt-60 lg:pt-40 js-accordion">
              {packageList.length === 0
                ? [...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="accordion__item"
                      style={{
                        background:
                          "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "skeleton-loading 1.5s infinite",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        padding: "10px 15px",
                      }}
                    >
                      {/* Skeleton for Accordion Heading */}
                      <div className="accordion__button">
                        <div className="accordion__icon">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="icon"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="icon"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </div>
                        </div>
                        <span className="text-17 fw-500 text-dark-1">
                          <p
                            className="para"
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              background:
                                "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                              backgroundSize: "200% 100%",
                              animation: "skeleton-loading 1.5s infinite",
                              width: "60%",
                              height: "20px",
                              borderRadius: "4px",
                            }}
                          ></p>
                        </span>
                      </div>

                      {/* Skeleton for Accordion Content */}
                      {/* <div
                        style={{
                          maxHeight: "300px",
                          overflow: "hidden",
                          transition: "max-height 0.3s ease",
                        }}
                        className="accordion__content"
                      >
                        <div
                          className="accordion__content__inner"
                          style={{ padding: "10px 0" }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                              backgroundSize: "200% 100%",
                              animation: "skeleton-loading 1.5s infinite",
                              height: "50px",
                              borderRadius: "4px",
                              width: "80%",
                              marginBottom: "10px",
                            }}
                          ></div>

                          <div
                            style={{
                              background:
                                "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                              backgroundSize: "200% 100%",
                              animation: "skeleton-loading 1.5s infinite",
                              height: "50px",
                              borderRadius: "4px",
                              width: "90%",
                            }}
                          ></div>
                        </div>
                      </div> */}
                    </div>
                  ))
                : packageList.map((elm, i) => (
                    <div
                      onClick={() =>
                        setActiveFaq((pre) => (pre === elm.id ? 0 : elm.id))
                      }
                      key={i}
                      className={`accordion__item ${
                        activeFaq === elm.id ? "is-active" : ""
                      }`}
                    >
                      <div className="accordion__button">
                        <div className="accordion__icon">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="icon"
                            data-feather="plus"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="icon"
                            data-feather="minus"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </div>
                        </div>
                        <span className="text-17 fw-500 text-dark-1">
                          <p
                            className="para"
                            style={{ fontSize: "18px", fontWeight: "bold" }}
                          >
                            {elm.Heading}
                          </p>
                        </span>
                      </div>

                      <div
                        style={{
                          maxHeight: activeFaq === elm.id ? "300px" : "0",
                          overflow: "hidden",
                          transition: "max-height 0.3s ease",
                        }}
                        className="accordion__content"
                      >
                        <div
                          className="accordion__content__inner"
                          style={{ padding: "10px 0" }}
                        >
                          {editorState[i] && (
                            <Editor
                              editorState={editorState[i]}
                              toolbarHidden
                              readOnly
                              wrapperClassName="editor-wrapper"
                              editorClassName="editor-content"
                              toolbarClassName="editor-toolbar"
                              customStyleMap={customStyleMap}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            <div
              className="container"
              style={{
                marginTop: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <p
                className="sectionTitle__title heading"
                style={{ marginBottom: "20px" }}
              >
                Have More Questions?
              </p>
              <Link
                variant="contained"
                href="/contactus"
                className="button -md -purple-4 text-white button-font brd-10"
                style={{
                  // padding: "0px 5px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
