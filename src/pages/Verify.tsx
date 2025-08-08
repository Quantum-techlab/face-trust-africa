import React, { useState } from "react";
import SEO from "@/components/SEO";
import CameraCapture from "@/components/CameraCapture";
import VerificationResultCard from "@/components/VerificationResultCard";
import { verifyFace, logVerification } from "@/services/verification";

const Verify: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onCapture = async (dataUrl: string, blob: Blob) => {
    setImg(dataUrl);
    setLoading(true);
    try {
      const res = await verifyFace(dataUrl);
      setResult(res);
      await logVerification({ ts: Date.now(), res });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <SEO
        title="Verify Identity – FaceTrust AI"
        description="Capture a face via webcam and verify identity in real-time with FaceTrust AI."
        canonical={window.location.origin + "/verify"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FaceTrust AI",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Web",
        }}
      />
      <header>
        <h1 className="text-2xl font-semibold">Face Verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">Use the camera to capture a face and run verification.</p>
      </header>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <CameraCapture onCapture={onCapture} buttonLabel="Capture & Verify" />
          {img && (
            <figure className="mt-4">
              <img src={img} alt="Captured face for verification" className="w-full rounded-md border" loading="lazy" />
              <figcaption className="mt-1 text-xs text-muted-foreground">Captured frame (optimized)</figcaption>
            </figure>
          )}
        </div>
        <div>
          <VerificationResultCard result={result} loading={loading} />
        </div>
      </section>
    </main>
  );
};

export default Verify;
