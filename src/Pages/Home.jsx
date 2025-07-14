import React from "react";
import HomeCards from "../Components/HomeCards";

const Home = () => {
  const role = localStorage.getItem("role");
  console.log(role);

  return (
    <>
      <div className="row">
        <div className="col-xl-9 col-xxl-12">
          <div className="row">
            <div className="col-lg-12">
              {(role === "superAdmin" || role === "manager") && <HomeCards />}

              {role !== "superAdmin" && role !== "manager" && (
                <div class="authincation fix-wrapper">
                  <div class="container ">
                    <div class="row justify-content-center h-100 align-items-center">
                      <div class="col-md-6">
                        <div class="error-page">
                          <div class="error-inner text-center">
                            <div class="dz-error" data-text="444">
                              444
                            </div>
                            <h2 class="error-head mb-0">
                              <i class="fa fa-thumbs-down text-danger me-2"></i>
                              Request not permitted
                            </h2>
                            <p>
                              You do not have permission to view this resource.
                            </p>
                            <a href="/login" class="btn btn-secondary">
                              BACK TO LOGIN
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
