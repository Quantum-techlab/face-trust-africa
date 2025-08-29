import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cpu, ScanFace, Sliders, Box, CheckCircle2, AlertCircle, Users, Zap } from "lucide-react";

const ModelInfo: React.FC<{ trained?: boolean; members?: number }> = ({ trained = true, members = 1 }) => {
  return (
    <section className="rounded-2xl border bg-gradient-to-br from-card to-card/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-contrast))] flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          AI Model Status
        </h3>
        <Badge 
          variant={trained ? "default" : "secondary"} 
          className={`text-sm px-3 py-1 ${trained ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          {trained ? (
            <><CheckCircle2 className="w-4 h-4 mr-1" />Trained</>
          ) : (
            <><AlertCircle className="w-4 h-4 mr-1" />Untrained</>
          )}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-muted/30">
          <h4 className="font-semibold text-sm mb-2 text-[hsl(var(--brand))]">OpenCV LBPH Face Recognizer</h4>
          <p className="text-xs text-muted-foreground">Local Binary Pattern Histogram with enhanced Haar cascade detection</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-1">
              <ScanFace className="w-4 h-4 text-[hsl(var(--brand))]" />
              <span className="text-xs font-medium">Detection</span>
            </div>
            <p className="text-xs text-muted-foreground">Haar Cascade</p>
          </div>
          <div className="p-3 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-[hsl(var(--brand-contrast))]" />
              <span className="text-xs font-medium">Features</span>
            </div>
            <p className="text-xs text-muted-foreground">LBPH (200×200)</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium">Known Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono">
                {members}
              </Badge>
              {members > 0 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
          </div>
          
          {trained && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                ~500ms avg
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">
              {trained ? 'System Ready for Verification' : 'Awaiting Model Training'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelInfo;


