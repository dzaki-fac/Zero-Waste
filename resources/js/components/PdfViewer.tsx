import { lazy, Suspense } from "react";

const LazyDocument = lazy(() =>
  import("react-pdf").then((m) => ({ default: m.Document }))
);
const LazyPage = lazy(() =>
  import("react-pdf").then((m) => ({ default: m.Page }))
);

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type PdfViewerProps = {
  file: string;
  pageNumber?: number;
  scale?: number;
  mode?: "single" | "all";
  numPages?: number;
  onLoadSuccess?: (info: { numPages: number }) => void;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  pageRefs?: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
};

export function PdfDocument({
  file,
  onLoadSuccess,
  loading,
  error,
  children,
}: {
  file: string;
  onLoadSuccess?: (info: { numPages: number }) => void;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={loading ?? <p className="text-sm py-20">Memuat dokumen...</p>}
    >
      <LazyDocument
        file={file}
        onLoadSuccess={onLoadSuccess}
        loading={loading}
        error={error}
      >
        {children}
      </LazyDocument>
    </Suspense>
  );
}

export function PdfPage({
  pageNumber,
  scale,
  className,
}: {
  pageNumber: number;
  scale?: number;
  className?: string;
}) {
  return (
    <LazyPage
      pageNumber={pageNumber}
      scale={scale}
      className={className}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  );
}
