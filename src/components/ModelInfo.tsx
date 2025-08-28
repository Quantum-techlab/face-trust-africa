import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cpu, ScanFace, Sliders, Box } from "lucide-react";

const ModelInfo: React.FC<{ trained?: boolean; members?: number }> = ({ trained = true, members = 1 }) => {
  return (
    <section className="rounded-lg border bg-card/80 backdrop-blur p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium flex items-center gap-2"><Cpu className="w-4 h-4" /> Model</h3>
        <Badge variant={trained ? "default" : "secondary"} className="text-xs">
          {trained ? "Trained" : "Untrained"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">OpenCV LBPH Face Recognizer</p>
      <Separator className="my-2" />
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <ScanFace className="w-4 h-4 text-[hsl(var(--brand))]" />
          <span>Detection: Haar Cascade (enhanced + fallback)</span>
        </div>
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[hsl(var(--brand-contrast))]" />
          <span>Features: LBPH histogram (200×200 ROI)</span>
        </div>
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-foreground" />
          <span>Known members: {members}</span>
        </div>
      </div>
    </section>
  );
};

export default ModelInfo;


