const localUploadLimitBytes = 900_000;

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

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Kon afbeelding niet voorbereiden voor upload."));
        return;
      }

      resolve(blob);
    }, type);
  });
}

async function resizeImage(file: File, maxSide: number, type: string) {
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

  return canvasToBlob(canvas, type);
}

export async function prepareImageForUpload(
  file: File,
  options: { logo?: boolean } = {}
): Promise<PreparedUpload> {
  const extension = getExtension(file.name);
  const isSvg = extension === "svg" || file.type === "image/svg+xml";

  if (file.size <= localUploadLimitBytes || isSvg) {
    return { file, optimized: false };
  }

  const preserveTransparency =
    options.logo || extension === "png" || file.type === "image/png";
  const outputType = preserveTransparency ? "image/png" : "image/jpeg";
  const outputExtension = preserveTransparency ? "png" : "jpg";
  const targetSizes = options.logo
    ? [768, 640, 512, 384, 256]
    : [1600, 1280, 960, 768, 640];

  let bestBlob: Blob | null = null;

  for (const size of targetSizes) {
    const blob = await resizeImage(file, size, outputType);
    bestBlob = blob;

    if (blob.size <= localUploadLimitBytes) {
      break;
    }
  }

  if (!bestBlob) {
    return { file, optimized: false };
  }

  return {
    file: new File([bestBlob], withExtension(file.name, outputExtension), {
      lastModified: Date.now(),
      type: outputType,
    }),
    optimized: true,
  };
}
