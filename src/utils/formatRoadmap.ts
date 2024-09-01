export function formatRoadmap(rawRoadmap: string): string {
    const sections = rawRoadmap.split(/\d+\.\s+/).filter(Boolean);
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(Boolean);
      const title = lines[0].trim();
      const content = lines.slice(1);
  
      let formattedContent = content.map(line => {
        if (line.startsWith('-')) {
          return line.trim();
        } else if (line.startsWith('**')) {
          return `\n### ${line.replace(/\*\*/g, '').trim()}`;
        } else {
          return `- ${line.trim()}`;
        }
      }).join('\n');
  
      return `## ${index + 1}. ${title}\n\n${formattedContent}\n`;
    }).join('\n');
  }