type IconProps = { size?: number };

function IcoImg({ src, size, alt }: { src: string; size: number; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ imageRendering: "pixelated", display: "block" }}
      draggable={false}
    />
  );
}

export function IconMyComputer({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/w95_14.ico" size={size} alt="My Computer" />;
}

export function IconNotepad({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/w95_16.ico" size={size} alt="Notepad" />;
}

export function IconBriefcase({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/w95_23.ico" size={size} alt="Briefcase" />;
}

export function IconFolder({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/w95_4.ico" size={size} alt="Folder" />;
}

export function IconEnvelope({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/w95_24.ico" size={size} alt="Envelope" />;
}

export function IconWolfenstein({ size = 32 }: IconProps) {
  return <IcoImg src="/wolf3d-browser/favicon.png" size={size} alt="Wolfenstein 3D" />;
}

export function IconBlog({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/w95_2.ico" size={size} alt="Blog" />;
}

export function IconNetflix({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/netflix-95.ico" size={size} alt="Netflix" />;
}

export function IconWindowsLogo({ size = 16 }: IconProps) {
  return <IcoImg src="/icons/start-button.ico" size={size} alt="Windows" />;
}

export function IconInternetExplorer({ size = 32 }: IconProps) {
  return <IcoImg src="/icons/internet.ico" size={size} alt="Internet Explorer" />;
}
