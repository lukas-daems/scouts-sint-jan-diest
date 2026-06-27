const localUploadLimitBytes = 850_000;

type PreparedUpload = {
  file: File;
  optimized: boolean;
};

function getExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function withExtension(name: string, extension: string) {
  const baseName = name.replace(/\.[^.]+$/, "");
  return `${baseName}.${extension}`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Kon afbeelding niet voorbereiden voor upload."));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}

async function resizeImage(
  file: File,
  maxSide: number,
  type: string,
  quality?: number
) {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Kon afbeelding niet voorbereiden voor upload.");
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  image.close?.();

  return canvasToBlob(canvas, type, quality);
}

export async function prepareImageForUpload(
  file: File,
  options: { logo?: boolean } = {}
): Promise<PreparedUpload> {
  const extension = getExtension(file.name);
  const isSvg = extension === "svg" || file.type === "image/svg+xml";
  const isGif = extension === "gif" || file.type === "image/gif";

  if (file.size <= localUploadLimitBytes || isSvg || isGif) {
    return { file, optimized: false };
  }

  const preserveTransparency =
    options.logo || extension === "png" || file.type === "image/png";
  const candidates = [
    ...(preserveTransparency
      ? [
          {
            type: "image/png",
            extension: "png",
            qualities: [undefined],
            sizes: options.logo
              ? [768, 640, 512, 384, 256, 180, 128]
              : [1400, 1100, 900, 720, 560, 420],
          },
          {
            type: "image/webp",
            extension: "webp",
            qualities: [0.86, 0.76, 0.66, 0.56],
            sizes: options.logo
              ? [768, 640, 512, 384, 256, 180, 128]
              : [1400, 1100, 900, 720, 560, 420],
          },
        ]
      : [
          {
            type: "image/webp",
            extension: "webp",
            qualities: [0.84, 0.74, 0.64, 0.54],
            sizes: [1800, 1500, 1200, 960, 768, 640],
          },
          {
            type: "image/jpeg",
            extension: "jpg",
            qualities: [0.84, 0.74, 0.64, 0.54],
            sizes: [1800, 1500, 1200, 960, 768, 640],
          },
        ]),
  ];

  let best: { blob: Blob; extension: string; type: string } | null = null;

  for (const candidate of candidates) {
    for (const size of candidate.sizes) {
      for (const quality of candidate.qualities) {
        const blob = await resizeImage(file, size, candidate.type, quality);

        if (!best || blob.size < best.blob.size) {
          best = {
            blob,
            extension: candidate.extension,
            type: candidate.type,
          };
        }

        if (blob.size <= localUploadLimitBytes) {
          return {
            file: new File(
              [blob],
              withExtension(file.name, candidate.extension),
              {
                lastModified: Date.now(),
                type: candidate.type,
              }
            ),
            optimized: true,
          };
        }
      }
    }
  }

  if (!best) {
    return { file, optimized: false };
  }

  return {
    file: new File([best.blob], withExtension(file.name, best.extension), {
      lastModified: Date.now(),
      type: best.type,
    }),
    optimized: true,
  };
}
