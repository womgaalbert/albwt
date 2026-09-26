// Global SVG filter that turns any rendered image into an ink drawing:
// grayscale -> edge detection -> inverted ink lines, multiplied with a soft
// ink wash of the original tones, slightly displaced so strokes look hand-drawn,
// then laid on warm paper with a fine grain. Referenced by `.ink-layer` in index.css.
export default function InkFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="ink-filter" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" result="gray" />

          {/* Line work: Laplacian edges, inverted so edges become dark ink on white */}
          <feConvolveMatrix in="gray" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edges" />
          <feComponentTransfer in="edges" result="lines">
            <feFuncR type="linear" slope="-3.2" intercept="1" />
            <feFuncG type="linear" slope="-3.2" intercept="1" />
            <feFuncB type="linear" slope="-3.2" intercept="1" />
          </feComponentTransfer>

          {/* Ink wash: bright areas of the source become light grey washes */}
          <feComponentTransfer in="gray" result="wash">
            <feFuncR type="linear" slope="-0.55" intercept="1" />
            <feFuncG type="linear" slope="-0.55" intercept="1" />
            <feFuncB type="linear" slope="-0.55" intercept="1" />
          </feComponentTransfer>
          <feBlend in="lines" in2="wash" mode="multiply" result="drawing" />

          {/* Hand-drawn wobble */}
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="wobble" />
          <feDisplacementMap in="drawing" in2="wobble" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="inked" />

          {/* Paper: warm tone + fine grain */}
          <feFlood floodColor="#f6f1e6" result="paperTone" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="3" result="grainNoise" />
          <feColorMatrix in="grainNoise" type="matrix"
            values="0 0 0 0 0.93  0 0 0 0 0.91  0 0 0 0 0.87  0 0 0 0.35 0" result="grain" />
          <feBlend in="grain" in2="paperTone" mode="multiply" result="paper" />
          <feBlend in="inked" in2="paper" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}
