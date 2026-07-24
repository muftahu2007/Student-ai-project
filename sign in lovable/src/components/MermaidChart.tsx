import React, { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidChartProps {
  chart: string;
}

export function MermaidChart({ chart }: MermaidChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, ''); // React's useId can contain colons, replace them for a valid CSS ID

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    });

    let isMounted = true;

    if (ref.current && chart) {
      // Clear previous content
      ref.current.innerHTML = '';
      
      const renderChart = async () => {
        try {
          // Use a completely unique ID for every render to avoid Mermaid DOM conflicts
          const uniqueId = `mermaid-${id}-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, chart);
          if (isMounted && ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (err) {
          console.error("Mermaid rendering error:", err);
          if (isMounted && ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">Error rendering mind map. The AI may have generated invalid syntax.</div>`;
          }
        }
      };

      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  return (
    <div 
      className="w-full h-full min-h-[400px] flex items-center justify-center overflow-auto p-4 bg-white/50 rounded-xl"
      ref={ref} 
    />
  );
}
