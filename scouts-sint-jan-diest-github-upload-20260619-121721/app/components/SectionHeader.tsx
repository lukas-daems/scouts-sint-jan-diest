type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow ? (
        <p
          className={`mb-4 text-sm font-semibold uppercase ${
            light ? "text-green-100" : "text-[#2f6b18]"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-3xl font-bold leading-tight sm:text-4xl md:text-5xl ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-5 text-base leading-8 sm:text-lg ${
          light ? "text-green-50" : "text-slate-600"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}
