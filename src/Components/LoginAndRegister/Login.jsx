import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";
import { useCookies } from "react-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["userToken", "userId"]);
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State to toggle between blocks

  const onPress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://kapitanlands-8xjj.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            roles: role,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data);
        toast.success("Login Successfull");
        localStorage.setItem("token", data.data?.token);
        // console.log("token", data.data?.token);
        localStorage.setItem("username", data?.data?.user?.fullName);
        localStorage.setItem("userId", data?.data?.user?._id);
        localStorage.setItem("role", data?.data?.user?.roles);

        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        setCookie("userToken", data.data.token, {
          path: "/",
          maxAge: sevenDaysInSeconds,
        });
        setCookie("userId", data.data.user._id, {
          path: "/",
          maxAge: sevenDaysInSeconds,
        });
        window.location.reload();
      } else {
        console.error("Login failed", data.message);
      }
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <div
        className="vh-100"
        style={{
          backgroundImage: `url('./images/bg.png')`,
          backgroundPosition: "center",
        }}
      >
        <div className="authincation h-100">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="position-relative">
                <button
                  className="btn btn-secondary position-absolute top-0 end-0 m-3"
                  onClick={() => setShowLogin(!showLogin)}
                >
                  {showLogin ? "Show Info" : "Login"}
                </button>
              </div>
              <div className="col-md-6">
                {showLogin ? (
                  <div className="authincation-content">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="auth-form">
                          <div className="text-center mb-3">
                            <a>
                              <img src="./images/logo/newlogo.png" alt="" />
                            </a>
                          </div>
                          <h4 className="text-center mb-4">
                            Sign in to your account
                          </h4>
                          <div>
                            <div className="mb-3">
                              <label className="mb-1">
                                <strong>Email</strong>
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="hello@example.com"
                              />
                            </div>
                            <div className="mb-3 position-relative">
                              <label className="mb-1">
                                <strong>Password</strong>
                              </label>
                              <div className="password-input-container">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="form-control"
                                />
                                <i
                                  className={`password-toggle-icon position-absolute ${
                                    showPassword
                                      ? "fa fa-eye-slash"
                                      : "fa fa-eye"
                                  }`}
                                  onClick={() => setShowPassword(!showPassword)}
                                ></i>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="mb-1">
                                <strong>Role</strong>
                              </label>
                              <select
                                id="inputState"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="default-select form-control wide"
                              >
                                <option selected>Select Role</option>
                                <option value={"dpo"}>Dpo</option>
                                <option value={"accountOfficer"}>
                                  Account Officer
                                </option>
                                <option value={"assistantManager"}>
                                  Assistant Manager
                                </option>
                                <option value={"manager"}>Manager</option>
                                <option value={"superAdmin"}>
                                  Super Admin
                                </option>
                              </select>
                            </div>
                            <div className="text-center mt-4">
                              <button
                                className="btn btn-primary btn-block"
                                onClick={onPress}
                              >
                                Sign me In
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="authincation-content">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="auth-form">
                          <div className="text-center mb-3">
                            <a>
                              <img src="./images/logo/newlogo.png" alt="" />
                            </a>
                          </div>
                          <p className="text-md" style={{ fontSize: "14px" }}>
                            <b>Welcome to Kapitanlands Investment Limited</b>&nbsp;
                            Empowering Small and Medium-Scale Businesses with
                            Financial Solutions <br/>At Kapitanlands, we understand
                            the unique challenges that small and medium-scale
                            businesses face.<br/> As a trusted financial company, we
                            offer services tailored to meet your business needs,
                            ensuring that you have the financial support to
                            thrive. <br/><b>Why Choose Kapitanlands?</b> We are more than
                            just a financial service provider. We’re your
                            partner in growth. Whether you're saving,
                            withdrawing, or in need of a loan, we are here to
                            support your business every step of the way.<br/> Our
                            dedicated team works closely with you to offer
                            tailored solutions, ensuring you achieve financial
                            success. Looking Ahead As we continue to serve
                            businesses across various sectors, Kapitanlands is
                            also expanding into real estate, offering investment
                            opportunities to help you diversify and grow your
                            portfolio.<br/><br/> Let us help you take the next step in
                            securing your business future.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
