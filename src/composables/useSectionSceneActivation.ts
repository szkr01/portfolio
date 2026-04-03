import { onBeforeUnmount } from "vue";

interface UseSectionSceneActivationOptions {
  activate: (sceneId: string, source: "scroll") => void | Promise<void>;
  root?: Element | null;
}

type SectionTarget = Element | { $el?: Element | null } | null;

export function useSectionSceneActivation(options: UseSectionSceneActivationOptions): {
  registerSection: (sceneId: string, element: SectionTarget) => void;
} {
  const sceneMap = new Map<Element, string>();
  const observer = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

      if (!activeEntry) {
        return;
      }

      const sceneId = sceneMap.get(activeEntry.target);
      const sceneIdFromDataset =
        activeEntry.target instanceof HTMLElement
          ? activeEntry.target.dataset.sceneId
          : undefined;
      const resolvedSceneId = sceneId ?? sceneIdFromDataset;
      if (resolvedSceneId) {
        void options.activate(resolvedSceneId, "scroll");
      }
    },
    {
      root: options.root ?? null,
      threshold: [0.25, 0.5, 0.75]
    }
  );

  onBeforeUnmount(() => {
    observer.disconnect();
    sceneMap.clear();
  });

  return {
    registerSection(sceneId, element) {
      const resolvedElement =
        element instanceof Element ? element : element && "$el" in element ? element.$el : null;
      if (!resolvedElement) {
        return;
      }
      sceneMap.set(resolvedElement, sceneId);
      if (resolvedElement instanceof HTMLElement) {
        resolvedElement.dataset.sceneId = sceneId;
      }
      observer.observe(resolvedElement);
    }
  };
}
