import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@repo/shared-ui";
import { useLoginMutation } from "@repo/shared-store";
import { loginSuccess } from "@repo/shared-store";

// lazy-load the shared Input component (code-split)
const Input = lazy(() =>
  import("@repo/shared-ui").then((m) => ({ default: m.Input }))
);

export default function LoginApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Use the login mutation hook
  const [login] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    try {
      // Trigger the login API call
      const response = await login({ email, password }).unwrap();
      console.log("Login successful:", response);
      // Dispatch login success action
      dispatch(
        loginSuccess({
          id: response.id,
          role: response.role,
          token: response.token,
        })
      );

      // Navigate to the profile page
      navigate("/profile");
    } catch (err) {
      // For now at api fail also calling dispatch to loginSuccess for testing
      dispatch(loginSuccess({ id: email, role: "USER", token: "test" }));
      navigate("/profile");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Suspense
            fallback={
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
            }
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
            }
          >
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Suspense>

          <Button label="Sign In" variant="secondary" onClick={handleLogin} />
        </form>

        <p className="text-gray-600 text-center mt-6">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
