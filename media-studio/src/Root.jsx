import { Composition } from "remotion";
import { Energy, Sensor, Attention, ConvNet, StudentPlurilingual, Portfolio } from "./figures.jsx";
import { BlogCovers } from "./covers.jsx";
import { PortraitLoop } from "./portrait.jsx";
import { Teardown } from "./Teardown.jsx";

const LOOPS = [
  { id: "energy-arima-forecasting", component: Energy },
  { id: "bfrb-sensor-fusion", component: Sensor },
  { id: "transformer-time-series", component: Attention },
  { id: "convnet-cifar10", component: ConvNet },
  { id: "student-plurilingual-databricks", component: StudentPlurilingual },
  { id: "portfolio-website", component: Portfolio },
];

const COVERS = [
  "agents-md-open-standard-coding-agents",
  "gpt-6-wave-and-model-churn",
  "why-ai-agents-fail-in-production",
  "cnn-cifar10-from-scratch",
  "time-series-forecasting-arima",
  "transformer-time-series",
  "production-ai-agent-serverless",
  "mlops-pipeline-production",
  "nlp-document-classifier-distilbert",
];

export const Root = () => (
  <>
    {LOOPS.map(({ id, component }) => (
      <Composition key={id} id={id} component={component} width={1280} height={720} fps={30} durationInFrames={180} />
    ))}
    {COVERS.map((slug) => (
      <Composition key={slug} id={`blog-${slug}`} component={BlogCovers[slug]} width={960} height={540} fps={30} durationInFrames={180} />
    ))}
    <Composition id="portrait" component={PortraitLoop} width={576} height={768} fps={30} durationInFrames={180} />
    {/* One full guided tour: 6 stages at 3.5 seconds each. */}
    <Composition id="agent-teardown" component={Teardown} width={1280} height={720} fps={30} durationInFrames={630} />
  </>
);
