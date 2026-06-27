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

function removeWhiteLogoBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];
    const brightness = Math.max(red, green, blue);
    const darkness = Math.min(red, green, blue);
    const saturation = brightness - darkness;

    if (alpha > 0 && brightness > 238 && saturation < 22) {
      data[index + 3] = 0;
    } else if (alpha > 0 && brightness > 224 && saturation < 30) {
      data[index + 3] = Math.round(alpha * 0.25);
    }
  }

  context.putImageData(imageData, 0, 0);
}

async function resizeImage(
  file: File,
  maxSide: number,
  type: string,
  options: { logo?: boolean; quality?: number } = {}
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

  if (options.logo) {
    removeWhiteLogoBackground(context, width, height);
  }

  image.close?.();

  return canvasToBlob(canvas, type, options.quality);
}

export async function prepareImageForUpload(
  file: File,
  options: { logo?: boolean } = {}
): Promise<PreparedUpload> {
  const extension = getExtension(file.name);
  const isSvg = extension === "svg" || file.type === "image/svg+xml";
  const isGif = extension === "gif" || file.type === "image/gif";

  if ((file.size <= localUploadLimitBytes && !options.logo) || isSvg || isGif) {
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
              ? [1100, 900, 720, 560, 420, 320]
              : [1400, 1100, 900, 720, 560, 420],
          },
          {
            type: "image/webp",
            extension: "webp",
            qualities: [0.86, 0.76, 0.66, 0.56],
            sizes: options.logo
              ? [1100, 900, 720, 560, 420, 320]
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
        const blob = await resizeImage(file, size, candidate.type, {
          logo: options.logo,
          quality,
        });

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
