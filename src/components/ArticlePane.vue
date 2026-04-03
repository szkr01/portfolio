<script setup lang="ts">
import { articleSections } from "../content/articleSections";

defineProps<{
  registerSection: (
    sceneId: string,
    element:
      | Element
      | {
          $el?: Element | null;
        }
      | null
  ) => void;
}>();
</script>

<template>
  <div
    id="right-pane"
    class="theme-bg color-transition h-full w-1/2 overflow-y-auto px-12 py-16"
  >
    <div class="mx-auto max-w-2xl">
      <header
        :ref="(node) => registerSection(articleSections[0].id, node)"
        :data-scene-id="articleSections[0].id"
        class="mb-12"
      >
        <h1 class="theme-text color-transition mb-4 text-4xl font-extrabold tracking-tight">
          Color Harmony &
          <span class="theme-accent color-transition">Contrast</span>
        </h1>
        <p class="theme-muted color-transition text-lg leading-relaxed">
          A visual exploration of dynamic themes driven by localized spatial color sampling. As
          you navigate the image, the background, text, and accents adapt in real-time.
        </p>
      </header>

      <section
        :ref="(node) => registerSection(articleSections[1].id, node)"
        :data-scene-id="articleSections[1].id"
        class="mb-10"
      >
        <h2
          class="theme-accent color-transition theme-border mb-4 border-b pb-2 text-2xl font-bold"
        >
          Understanding Complements
        </h2>
        <p class="theme-text color-transition mb-4 leading-relaxed">
          Complementary colors are pairs of colors which, when combined or mixed, cancel each
          other out by producing a grayscale color like white or black. When placed next to each
          other, they create the strongest contrast for those two colors.
        </p>
        <blockquote
          class="theme-accent-2-border theme-surface color-transition my-6 rounded-r-xl border-l-4 p-5 shadow-sm"
        >
          <p class="theme-text color-transition text-lg italic opacity-80">
            "Color does not add a pleasant quality to design - it reinforces it." <br />
            <span
              class="theme-accent-2 color-transition mt-3 block text-sm font-bold tracking-wide uppercase"
            >
              - Pierre Bonnard
            </span>
          </p>
        </blockquote>
        <p class="theme-text color-transition leading-relaxed">
          In digital interfaces, relying purely on opposite hues can lead to visual vibration. The
          key is to manage the
          <span
            class="theme-accent-bg color-transition rounded px-2 py-0.5 text-sm font-semibold text-white shadow-sm"
          >
            Lightness
          </span>
          and
          <span
            class="theme-accent-bg color-transition rounded px-2 py-0.5 text-sm font-semibold text-white shadow-sm"
          >
            Chroma
          </span>
          (saturation) to maintain readability while keeping the aesthetic link.
        </p>
      </section>

      <section
        :ref="(node) => registerSection(articleSections[2].id, node)"
        :data-scene-id="articleSections[2].id"
        class="mb-10"
      >
        <h2
          class="theme-accent color-transition theme-border mb-4 border-b pb-2 text-2xl font-bold"
        >
          Contrast & Context
        </h2>
        <p class="theme-text color-transition mb-4 leading-relaxed">
          The background color naturally shifts based on the overall brightness of the viewport.
          Darker image areas trigger a subtle dark mode, while lighter areas return to a luminous
          white, maintaining perfect text contrast automatically.
        </p>
        <div class="mb-6 mt-6 flex gap-6">
          <div
            class="theme-surface theme-border color-transition flex-1 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="mb-3 flex items-center gap-3">
              <div class="theme-bg theme-border h-4 w-4 rounded-full border"></div>
              <h3 class="theme-text color-transition font-bold">Dynamic Background</h3>
            </div>
            <p class="theme-muted color-transition text-sm">
              Calculated by averaging the lightness of the viewport and applying a faint hue of the
              dominant color to unify the design.
            </p>
          </div>
          <div
            class="theme-surface theme-border color-transition flex-1 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="mb-3 flex items-center gap-3">
              <div class="theme-accent-bg h-4 w-4 rounded-full"></div>
              <h3 class="theme-accent-2 color-transition font-bold">Responsive Accents</h3>
            </div>
            <p class="theme-muted color-transition text-sm">
              Accent colors are verified against the background. If contrast falls below WCAG
              standards, lightness is dynamically corrected.
            </p>
          </div>
        </div>
      </section>

      <section
        :ref="(node) => registerSection(articleSections[3].id, node)"
        :data-scene-id="articleSections[3].id"
      >
        <h2
          class="theme-accent color-transition theme-border mb-4 border-b pb-2 text-2xl font-bold"
        >
          The Mechanics
        </h2>
        <p class="theme-text color-transition mb-4 leading-relaxed">
          This demonstration does not simply average the entire image. It utilizes an
          <code
            class="theme-surface theme-border color-transition rounded border px-2 py-1 text-sm font-mono"
          >
            OffscreenCanvas
          </code>
          to render the exact viewport you are looking at.
        </p>
        <ul class="mt-6 space-y-4">
          <li class="flex items-start">
            <span
              class="theme-accent-bg color-transition mr-4 mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            >
              1
            </span>
            <span class="theme-text color-transition leading-relaxed">
              Extract dominant neutral tones to formulate subtle background tints and determine
              Light/Dark mode.
            </span>
          </li>
          <li class="flex items-start">
            <span
              class="theme-accent-bg color-transition mr-4 mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            >
              2
            </span>
            <span class="theme-text color-transition leading-relaxed">
              Identify vibrant peaks for primary accents, ensuring they pop against the current
              background.
            </span>
          </li>
          <li class="flex items-start">
            <span
              class="theme-accent-bg color-transition mr-4 mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            >
              3
            </span>
            <span class="theme-text color-transition leading-relaxed">
              Calculate a 180° hue shift for the complementary accent to provide secondary
              highlights.
            </span>
          </li>
          <li class="flex items-start">
            <span
              class="theme-accent-bg color-transition mr-4 mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            >
              4
            </span>
            <span class="theme-text color-transition leading-relaxed">
              Apply an Exponential Moving Average (EMA) to smooth the transition beautifully over
              time.
            </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
