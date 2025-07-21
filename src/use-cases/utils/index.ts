export function getRandomColor(): string {
  const colors = [
    "#2B95F6",
    "#898989",
    "#8AC53E",
    "#FFD143",
    "#A900CA",
    "#6E86F1",
    "#FFAE55",
    "#F761D6",
    "#00DE73"
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function makeFileUrl(newAvatarPath: string): string {
  return `${process.env.API_URL}/file/${newAvatarPath}`;
}
