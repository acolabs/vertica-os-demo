"use client";

import React, { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/use-org";

interface Organization {
  id: string;
  name: string;
  type: string;
  industry: string | null;
  arr_millions: number | null;
}

export function OrgSelector() {
  const { orgId, setOrgId } = useOrg();
  const [orgs, setOrgs] = useState<Organization[]>([]);

  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => {
        const portfolio = data.filter((o: Organization) => o.type === "portfolio");
        setOrgs(portfolio);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      {/* All Portfolio button */}
      <button
        onClick={() => setOrgId("all")}
        className={`
          px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap
          ${orgId === "all"
            ? "bg-[var(--primary)] text-white"
            : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
          }
        `}
      >
        All Portfolio
      </button>

      {/* Individual org buttons */}
      {orgs.map((org) => (
        <button
          key={org.id}
          onClick={() => setOrgId(org.id)}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5
            ${orgId === org.id
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
            }
          `}
        >
          <span>{org.name}</span>
          {org.arr_millions && (
            <span className={`text-[10px] ${orgId === org.id ? "text-white/70" : "text-[var(--text-muted)]"}`}>
              ${org.arr_millions}M
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
