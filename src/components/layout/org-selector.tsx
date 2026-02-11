"use client";

import React, { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/use-org";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <Select value={orgId} onValueChange={setOrgId}>
      <SelectTrigger className="w-[220px] bg-[var(--input-bg)] border-[var(--card-border)] text-[var(--text-primary)]">
        <SelectValue placeholder="Select portfolio company" />
      </SelectTrigger>
      <SelectContent className="bg-[var(--card-bg)] border-[var(--card-border)]">
        {orgs.map((org) => (
          <SelectItem key={org.id} value={org.id} className="text-[var(--text-secondary)]">
            <div className="flex items-center justify-between w-full gap-2">
              <span>{org.name}</span>
              {org.arr_millions && (
                <span className="text-xs text-[var(--text-muted)]">${org.arr_millions}M ARR</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
