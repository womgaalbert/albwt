import { Composition } from "remotion";
import { Energy, Sensor, Attention, ConvNet, Portfolio } from "./scenes.jsx";
import { Teardown } from "./Teardown.jsx";

const LOOPS = [
  { id: "energy-arima-forecasting", component: Energy },
  { id: "bfrb-sensor-fusion", component: Sensor },
  { id: "transformer-time-series", component: Attention },
  { id: "convnet-cifar10", component: ConvNet },
  { id: "portfolio-website", component: Portfolio },
];

export const Root = () => (
  <>
    {LOOPS.map(({ id, component }) => (
      <Composition key={id} id={id} component={component} width={1280} height={720} fps={30} durationInFrames={180} />
    ))}
    {/* One full guided tour: 6 stages at 3.5 seconds each. */}
    <Composition id="agent-teardown" component={Teardown} width={1280} height={720} fps={30} durationInFrames={630} />
  </>
);
