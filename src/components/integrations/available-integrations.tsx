"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  Headphones,
  MessageSquare,
  CheckSquare,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailableIntegration {
  name: string;
  type: string;
  icon: React.ElementType;
  color: string;
}

const availableIntegrations: AvailableIntegration[] = [
  { name: "HubSpot", type: "CRM", icon: Database, color: "text-orange-400" },
  { name: "Intercom", type: "Support", icon: Headphones, color: "text-[var(--primary)]" },
  { name: "BigQuery", type: "Data Warehouse", icon: Database, color: "text-blue-300" },
  { name: "Microsoft Teams", type: "Communication", icon: MessageSquare, color: "text-purple-400" },
  { name: "Asana", type: "Project Mgmt", icon: CheckSquare, color: "text-rose-400" },
  { name: "Tableau", type: "BI / Reporting", icon: BarChart3, color: "text-amber-400" },
];

interface AvailableIntegrationsProps {
  onConnect: (name: string) => void;
}

export function AvailableIntegrations({ onConnect }: AvailableIntegrationsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)]" />
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Available Integrations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card
              key={integration.name}
              className="border-[var(--card-border)] bg-[var(--card-bg)] opacity-60 hover:opacity-80 transition-opacity"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                    <Icon className={cn("w-5 h-5", integration.color)} />
                  </div>
                  <div>
                    <CardTitle className="text-[var(--text-primary)] text-sm">{integration.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] mt-1 bg-[var(--surface)] text-[var(--text-muted)]">
                      {integration.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    <span className="text-xs text-[var(--text-muted)]">Not connected</span>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onConnect(integration.name)}
                    className="text-xs"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
