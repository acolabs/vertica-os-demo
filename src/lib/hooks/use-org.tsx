"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface OrgContextType {
  orgId: string;
  setOrgId: (id: string) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

const DEFAULT_ORG_ID = "org_dsn";

export function OrgProvider({ children }: { children: ReactNode }) {
  const [orgId, setOrgIdState] = useState<string>(DEFAULT_ORG_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vertica_org_id");
    if (stored) {
      setOrgIdState(stored);
    }
    setMounted(true);
  }, []);

  const setOrgId = (id: string) => {
    setOrgIdState(id);
    localStorage.setItem("vertica_org_id", id);
  };

  if (!mounted) {
    return null;
  }

  return (
    <OrgContext.Provider value={{ orgId, setOrgId }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg(): OrgContextType {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
}
