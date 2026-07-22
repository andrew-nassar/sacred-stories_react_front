import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useSacredStore } from "../../../shared/store/sacredStore";

export type AuthScreenType = 
  | "login"            // Screenshot 9: Archivist Login
  | "register"         // Screenshot 7: Register / Create Account
  | "verification_pending" // Screenshot 8: Verification Pending
  | "email_verified"   // Screenshot 2 & 5: Email Verified / Communion Restored
  | "verification_failed" // Screenshot 3 & 6: Verification Failed
  | "request_reset";   // Screenshot 1: Return to the Archive (Send Verification)

export interface AuthUserSession {
  email: string;
  role: "admin" | "user";
  isLoggedIn: boolean;
}

export function useAuthLogic() {
  // Navigation states
  const { setCurrentTab } = useSacredStore();
  
  // Core Form Screen Toggles
  const [screen, setScreen] = useState<AuthScreenType>("login");
  
  // Form Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength label (as seen in Screenshot 7)
  const [passwordStrength, setPasswordStrength] = useState<"NOT SET" | "WEAK" | "MEDIUM" | "STRONG">("NOT SET");

  // Selected Role (as requested: "create two path when click login is admin or is user ok")
  const [loginRole, setLoginRole] = useState<"admin" | "user">("user");

  // Logged-in session status (simple client-side simulation)
  const [session, setSession] = useState<AuthUserSession | null>(() => {
    const saved = localStorage.getItem("sacred_archivist_session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Handle password strength calculation
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (!val) {
      setPasswordStrength("NOT SET");
      return;
    }
    if (val.length < 6) {
      setPasswordStrength("WEAK");
    } else if (val.length < 10) {
      setPasswordStrength("MEDIUM");
    } else {
      setPasswordStrength("STRONG");
    }
  };

  /**
   * INITIATE ACCESS (Login Handler)
   * Handles path selection for "admin" vs "user" roles based on input/state.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // --- CLEAR LOGIC FOR FUTURE INTEGRATION ---
      // You can add your remote endpoint API calls or Firebase Auth here:
      // const response = await fetch("https://exhume-amends-coasting.ngrok-free.dev/api/Auth/login", { ... })
      
      // Simulate API lag
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check credentials / set role (e.g., if email contains "admin" or role toggle is set to admin)
      const determinedRole: "admin" | "user" = (email.toLowerCase().includes("admin") || loginRole === "admin") ? "admin" : "user";

      const userSession: AuthUserSession = {
        email: email.trim(),
        role: determinedRole,
        isLoggedIn: true,
      };

      setSession(userSession);
      localStorage.setItem("sacred_archivist_session", JSON.stringify(userSession));
      
      // Navigate to success verification screen or immediately to dashboard
      setScreen("email_verified");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate access.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * CREATE ACCOUNT (Registration Handler)
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // --- CLEAR LOGIC FOR FUTURE INTEGRATION ---
      // You can call your remote register endpoint here:
      // await apiFetch("/api/Auth/register", { ... })

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // After registering, show verification pending screen (Screenshot 8)
      setScreen("verification_pending");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * SEND VERIFICATION LINK (Screenshot 1: Return to the Archive)
   */
  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Show pending or simulation of verification failure to test both pathways
      // Let's toggle to pending
      setScreen("verification_pending");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send verification link.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * LOGOUT
   */
  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("sacred_archivist_session");
    setScreen("login");
  };

  /**
   * RESET STATES
   */
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
  };

  return {
    screen,
    setScreen,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    setErrorMessage,
    isLoading,
    passwordStrength,
    handlePasswordChange,
    loginRole,
    setLoginRole,
    session,
    handleLogin,
    handleRegister,
    handleSendVerification,
    handleLogout,
    resetForm,
    setCurrentTab
  };
}
