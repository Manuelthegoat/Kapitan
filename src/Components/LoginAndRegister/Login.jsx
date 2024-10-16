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
      setLoading(false); // <-- stop the loader
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
              <div className="col-md-6">
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
                                  showPassword ? "fa fa-eye-slash" : "fa fa-eye"
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
                              <option value={"superAdmin"}>Super Admin</option>
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
              </div>
              <div className="col-md-6">
                <div className="authincation-content">
                  <div className="row no-gutters">
                    <div className="col-xl-12">
                      <div className="auth-form">
                        <p className="text-sm">
                          Welcome to Kapitanlands Investment Limited Empowering
                          Small and Medium-Scale Businesses with Financial
                          Solutions At Kapitanlands, we understand the unique
                          challenges that small and medium-scale businesses
                          face. As a trusted financial company, we offer
                          services tailored to meet your business needs,
                          ensuring that you have the financial support to
                          thrive. Our Services Daily Savings: We help you build
                          financial security with our flexible daily savings
                          plans. Save a little each day and watch your funds
                          grow over time. Easy Withdrawals: Access your savings
                          anytime with a simple withdrawal process based on your
                          requests. Loan Services: Need a financial boost? We
                          provide loans with flexible repayment options, helping
                          your business grow and succeed. Loan Reconciliation:
                          We make loan repayments hassle-free with seamless
                          reconciliation when payments are due. Why Choose
                          Kapitanlands? We are more than just a financial
                          service provider. We’re your partner in growth.
                          Whether you're saving, withdrawing, or in need of a
                          loan, we are here to support your business every step
                          of the way. Our dedicated team works closely with you
                          to offer tailored solutions, ensuring you achieve
                          financial success. Looking Ahead As we continue to
                          serve businesses across various sectors, Kapitanlands
                          is also expanding into real estate, offering
                          investment opportunities to help you diversify and
                          grow your portfolio. Let us help you take the next
                          step in securing your business future. This content
                          introduces your core services and values while
                          highlighting your focus on small and medium businesses
                          and your future plans in real estate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
