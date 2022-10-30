// @refresh reload
import { createSignal, lazy, Show, Suspense } from 'solid-js';
import { Body, ErrorBoundary, Head, Html, Meta, Scripts, Title } from 'solid-start';
import LayoutView from './components/LayoutView';
import SimulationParams from './components/SimulationParams';
import { layout, setLayout } from './model/layout';
import { toMagic } from './model/magic';
import { spiceFile } from './model/spiceFile';
import './root.css';
import { downloadFile } from './utils/download-file';

export default function Root() {
  const Graph = lazy(() => import('./components/Graph'));
  const [showSpice, setShowSpice] = createSignal(false);

  if (typeof location !== 'undefined') {
    const urlParams = new URLSearchParams(location.search);
    const preset = urlParams.get('preset');
    import(`~/../presets/${preset}.json`).then((module) => {
      if (module && module.rects) {
        setLayout('rects', module.rects);
      }
    });
  }

  return (
    <Html lang="en">
      <Head>
        <Title>SiliWiz Demo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <ErrorBoundary>
          <h1>Siliwiz</h1>
          <LayoutView />
          <hr style={{ margin: '1em 0' }} />
          <SimulationParams />
          <Suspense fallback={<div>Loading graph...</div>}>
            <Graph />
          </Suspense>
          <label>
            <input
              type="checkbox"
              onclick={(e) => setShowSpice((e.target as HTMLInputElement).checked)}
            />
            Show SPICE
          </label>
          <br />
          <Show when={showSpice()}>
            <textarea value={spiceFile()} cols="100" rows="15" readonly />
            <br />
            <button onClick={() => downloadFile('siliwiz.mag', toMagic(layout))}>
              Download MAGIC
            </button>
            &nbsp;
            <button onClick={() => downloadFile('siliwiz.spice', spiceFile())}>
              Download SPICE
            </button>
          </Show>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
