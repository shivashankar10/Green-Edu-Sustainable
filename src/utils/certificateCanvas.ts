export const generateCertificateCanvas = (
  certificateData: any,
  courseTitle: string,
  lessons: number,
  hours: number,
  score: number,
  userName: string
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Set canvas size
  canvas.width = 800;
  canvas.height = 600;

  // Draw very light green watermark across background
  ctx.save();
  ctx.globalAlpha = 0.08; // Very low opacity for background
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 6); // Rotate texts by -30º for diagonal effect
  ctx.font = "bold 56px Arial";
  ctx.fillStyle = "#54f294"; // Light green
  ctx.textAlign = "center";

  // Repeat watermark
  const text = "GreenEdu Platform";
  for (let y = -600; y < 600; y += 120) {
    for (let x = -800; x < 800; x += 400) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.restore();

  // Fill background (over watermark, but use opaque white to ensure readability)
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Redraw watermark (because fully opaque white would otherwise cover it)
  ctx.save();
  ctx.globalAlpha = 0.10; // Slightly higher alpha for watermark above white
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 6);
  ctx.font = "bold 56px Arial";
  ctx.fillStyle = "#54f294";
  ctx.textAlign = "center";
  for (let y = -600; y < 600; y += 120) {
    for (let x = -800; x < 800; x += 400) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.restore();

  // Add border
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Add logo/brand section at the top
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(30, 30, canvas.width - 60, 60);
  
  // Logo text (you can replace this with an actual logo image later)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🌱 GreenEdu', canvas.width / 2, 70);

  // Set text properties
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';

  // Title
  ctx.font = 'bold 32px Arial';
  ctx.fillStyle = '#16a34a';
  ctx.fillText('Certificate of Completion', canvas.width / 2, 140);

  // Subtitle
  ctx.font = '16px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText('This is to certify that', canvas.width / 2, 180);

  // User name
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#16a34a';
  ctx.fillText(userName, canvas.width / 2, 220);

  // Course completion text
  ctx.font = '16px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText('has successfully completed', canvas.width / 2, 260);

  // Course title
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#000000';
  const maxWidth = 600;
  const words = courseTitle.split(' ');
  let line = '';
  let y = 300;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = words[n] + ' ';
      y += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);

  // Course details
  ctx.font = '14px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText(`${hours} hours • ${lessons} lessons`, canvas.width / 2, y + 50);

  // Score
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#16a34a';
  ctx.fillText(`Score: ${score}%`, canvas.width / 2, y + 90);

  // Date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  ctx.font = '14px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText(currentDate, canvas.width / 2, canvas.height - 120);

  // Certificate code
  ctx.font = '12px Arial';
  ctx.fillStyle = '#888888';
  ctx.fillText(`Certificate Code: ${certificateData.certificate_code}`, canvas.width / 2, canvas.height - 100);

  // Platform name
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#16a34a';
  ctx.fillText('GreenEdu Platform', canvas.width / 2, canvas.height - 80);

  return canvas;
};

export const downloadCanvasAsPNG = (canvas: HTMLCanvasElement, filename: string) => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
};
