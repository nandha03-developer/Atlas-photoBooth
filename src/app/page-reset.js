import { useState } from "react";
import Link from "next/link";
import Layout from "../components/layout/Layout";
import useAuth from "src/hooks/useAuth";
import axios from "axios";

function Reset() {
  const { resetPasswordRequest } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userValue, setUserValue] = useState({});

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }


    const result = axios
      .get("/api/customer")
      .then((res) => {
        const result = res.data;
        const emailList = result.map((item) => item.email);
        if (emailList.includes(email)) {
          resetPasswordRequest(email);

        } else {
          setEmailError("Email not found");
        }
      })
      .catch((error) => {
       
        setEmailError("Error fetching email list");
      });

    setLoading(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <Layout>
      <section className="section-box">
        <div className="container box-reset">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="box-signup mt-90">
                <h1 className="text-heading-3 mb-15 text-center">
                  Reset password
                </h1>
                <div className="text-center mb-50">
                  <p className="text-body-text color-gray-500">
                    Enter your email to reset your password.
                  </p>
                </div>
                <div className="box-form-signup">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="form-field">
                        <input
                          className="form-control input-green-bd input-with-icon"
                          placeholder="Enter your email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <span className="icon-email-right" />
                      </div>
                      {emailError && (
                        <p className="text-danger">{emailError}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-green-full text-heading-6"
                        disabled={loading}
                      >
                        {loading ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <p
                              style={{
                                position: "absolute",
                                left: "105px",
                                top: "10px",
                              }}
                            >
                              Reset Password
                            </p>
                            <div
                              className="d-flex justify-content-center"
                              style={{ position: "absolute", top: "10px" }}
                            >
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              position: "absolute",
                              left: "105px",
                              top: "10px",
                            }}
                          >
                            {" "}
                            Reset Password
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                  <div className="form-group">
                    <Link href="/" legacyBehavior as>
                      <a className="text-body-text text-center">
                        Back to homepage
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Reset;
