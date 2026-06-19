"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import dynamic from "next/dynamic";
import { List, OrderedSet } from "immutable";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import logo from "../../public/assets/img/logo/logo72.svg";

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

export default function GetApp() {
  const [loading, setLoading] = useState(true);
  const [policyList, setPolicyList] = useState([]);
  const [editorState, setEditorState] = useState("");

  const fetchPolicy = () => {
    // setLoading(true);
    const query = `
   query MyQuery {
  listPolicies {
    Totalcount
    items {
      Description
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
        const userDetails = res.data?.data?.listPolicies?.items || [];
        setPolicyList(userDetails);
        // Create editor states for each package
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

  useEffect(() => {
    fetchPolicy();
  }, []);

  const createEditorStateFromHTML = (html) => {
    if (html) {
      // Clean up the HTML string
      html = html.replace(/^"|"$/g, "");
      html = html.replace(/\\"/g, '"').replace(/\\n/g, "");

      // Convert HTML to Content Blocks and handle entityMap
      const blocksFromHTML = convertFromHTML(html);

      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );

      // Apply list styles manually if needed
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

      // Create EditorState with updated ContentState
      const editorState = EditorState.createWithContent(updatedContentState);
      return editorState;
    }
    return EditorState.createEmpty();
  };

  useEffect(() => {
    if (policyList && policyList.Description) {
      const editorStateFromAPI = createEditorStateFromHTML(
        policyList.Description
      );
      // const editorStateFromAPI = createEditorStateFromHTML(singleStore.Content);
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [editorState]);

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
      className="layout-pt-lg layout-pb-lg bg-light-3"
      style={{ marginTop: "50px" }}
    >
      <div className="container">
        <div className="row y-gap-20 items-center">
          <div>
            <div className="app-content">
              <p
                className="app-content__title heading"
                style={{ display: "flex", justifyContent: "center" }}
              >
                Policies
              </p>

              {policyList.length === 0
                ? [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "20px",
                        flexGrow: 1,
                        background:
                          "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "skeleton-loading 1.5s infinite",
                        borderRadius: "8px",
                        marginBottom: "15px",
                      }}
                    >
                      {/* Skeleton for Editor Content */}
                      {/* <div
                        style={{
                          background:
                            "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                          backgroundSize: "200% 100%",
                          animation: "skeleton-loading 1.5s infinite",
                          height: "200px",
                          borderRadius: "8px",
                        }}
                      ></div> */}
                    </div>
                  ))
                : policyList.map((pkg, index) => (
                    <div key={index} style={{ padding: "20px", flexGrow: 1 }}>
                      {/* Display the content using Editor */}
                      {editorState[index] ? (
                        <Editor
                          editorState={editorState[index]}
                          toolbarHidden
                          readOnly
                          wrapperClassName="editor-wrapper"
                          editorClassName="editor-content"
                          toolbarClassName="editor-toolbar"
                          customStyleMap={customStyleMap}
                        />
                      ) : (
                        // Skeleton loader when editorState is not available
                        <div
                          style={{
                            background:
                              "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                            backgroundSize: "200% 100%",
                            animation: "skeleton-loading 1.5s infinite",
                            height: "200px",
                            borderRadius: "8px",
                          }}
                        ></div>
                      )}
                    </div>
                  ))}

              {/* <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Our small business is insured and COIs will be provided as
                  requested.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  All prices will incur a 5.3% processing fee.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Delivery, pick up, or set ups on holidays and after midnight
                  will incur an extra 10% charge.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Rentals placed outdoors cannot be guaranteed for strong winds,
                  rain, or snow. It is the responsibility of clients to reach
                  out 24 hours in advance to discuss a potential rain, heat, or
                  snow plan; otherwise cancellation due to weather will have no
                  refunds.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Neon signs will have no additional installation costs. Hanging
                  your sign on our rentals will incur an additional $50 charge
                  if we provide the service.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Missing or damaged rentals will be charged at replacement
                  cost.
                </li> */}
              {/* <li className="app-content__text para" style={{fontSize:"17px"}}>
                  In the case of cancellation, there is no refund of the
                  deposit.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Rentals shall not be altered or modified without the
                  permission of Light Up Rentals.
                </li>
                <li className="app-content__text para" style={{fontSize:"17px"}}>
                  Set up locations need to be identified prior to set up. Moving
                  the set up location, when possible, after set up is complete,
                  will incur a 25% charge due to the time and labor in
                  de-installing and re-installing.
                </li>
                <li className="app-content__text para"style={{fontSize:"17px"}}>
                  There is a maximum of a 15 minute waiting period allowed
                  before the staff leaves the premise. As we have multiple
                  events in a day, we cannot wait longer than 15 minutes to
                  start or remove installations. Refunds in these cases are not
                  possible. There is a $50 charge per every 15 minutes that the
                  set up or pick up time is delayed. Please be mindful of this
                  policy and book a set up and pick up time that works for you.
                </li>
                <li className="app-content__text para"style={{fontSize:"17px"}}>
                  Photo booth galleries will be shared if requested within 30
                  days of the event. They are shareable for up to 30 days after
                  the event is over. The galleries will be deleted after this
                  time frame.
                </li> */}
              {/* </ul> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
