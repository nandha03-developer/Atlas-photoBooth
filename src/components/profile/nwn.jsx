"use client";

import Link from "next/link";
import React from "react";

export default function QuoteForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="form-page__content lg:mt-50">
      <div className="container" style={{ marginTop: "80px" }}>
        <div className="row text-center">
          <div className="col-xl-12 col-lg-12">
            <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
              <h3 className="text-30 lh-13">Request a Quote</h3>
              <p className="mt-6">
                Fill out this form, and a Pop Up Photo Booth team member will
                contact you to craft a personalized photo booth rental package
                tailored to your event’s unique needs.
              </p>

              <form
                className="contact-form respondForm__form row y-gap-20 pt-30"
                onSubmit={handleSubmit}
              >
                <div className="col-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    name="title"
                    placeholder="First Name"
                  />
                </div>
                <div className="col-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Last Name
                  </label>
                  <input required type="text" name="title" placeholder="Name" />
                </div>
                {/* phone */}
                <div class="col-6">
                  <label for="phone" class="label">
                    Phone
                  </label>
                  <input
                    required
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    class="input"
                  />
                </div>
                {/* <div className="col-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Occassion
                  </label>
                  <input
                    required
                    type="text"
                    name="title"
                    placeholder="Phone"
                  />
                </div> */}
                {/* Occassion */}
                <div className="col-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Occasion
                  </label>
                  <select
                    required
                    name="occasion"
                    placeholder="Select Occasion"
                  >
                    <option value="">Select Occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="wedding">Wedding</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="graduation">Graduation</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                {/* rental */}
                <div className="form-group col-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Rental
                  </label>
                  <select
                    required
                    name="occasion"
                    placeholder="Select Occasion"
                  >
                    <option value="">Select Rental</option>
                    <option value="birthday">Drop Off</option>
                    <option value="wedding">With Attendance</option>
                  </select>
                </div>
                {/* date */}
                <div className="col-6">
                  <label
                    className="text-16 lh-1 fw-500 text-dark-1 mb-10"
                    class="label"
                  >
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    name="title"
                    placeholder="Phone"
                    class="input"
                  />
                </div>
                {/* time */}
                <div class="form-group col-6">
                  <label for="start-time" class="label">
                    Start Time
                  </label>
                  <input
                    required
                    type="time"
                    id="start-time"
                    name="start-time"
                    class="input"
                  />
                </div>
                <div class="form-group col-6">
                  <label for="end-time" class="label">
                    End Time
                  </label>
                  <input
                    required
                    type="time"
                    id="end-time"
                    name="end-time"
                    class="input"
                  />
                </div>
                <div class="form-group col-6">
                  <label for="default-duration" class="label">
                    Default Duration
                  </label>
                  <input
                    type="text"
                    id="default-duration"
                    name="default-duration"
                    class="input"
                    value="3 hours"
                    readonly
                  />
                </div>
                <div class="form-group col-6">
                  <label for="additional-time" class="label">
                    Additional Time
                  </label>
                  <select
                    id="additional-time"
                    name="additional-time"
                    class="input"
                    required
                  >
                    <option value="" disabled selected>
                      Select additional time
                    </option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                  </select>
                </div>
                {/* <div className="col-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    name="title"
                    placeholder="Password"
                  />
                </div> */}
                <div className="col-12">
                  <button
                    type="submit"
                    name="submit"
                    id="submit"
                    className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                Or sign in using
              </div>

              <div className="d-flex x-gap-20 items-center justify-between pt-20">
                <div>
                  <button className="button -sm px-24 py-20 -outline-blue-3 text-blue-3 text-14">
                    Log In via Facebook
                  </button>
                </div>
                <div>
                  <button className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14">
                    Log In via Google+
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}