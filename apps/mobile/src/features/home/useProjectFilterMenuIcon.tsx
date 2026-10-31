import type { MenuAction } from "@react-native-menu/menu";

import { ProjectFavicon } from "../../components/ProjectFavicon";
import { useAndroidControlSizing } from "../../components/ui/useAndroidControlSizing";
import type { HomeListFilterMenuProject } from "./home-list-filter-menu";

export function useProjectFilterMenuIcon(projects: ReadonlyArray<HomeListFilterMenuProject>) {
  const { iconSize } = useAndroidControlSizing();
  return (action: MenuAction) => {
    const project = projects.find(
      (candidate) => `project:${candidate.key}` === action.id,
    )?.representative;
    if (!project || project.isScratch) return null;
    return (
      <ProjectFavicon
        environmentId={project.environmentId}
        faviconPath={project.faviconPath}
        projectIcon={project.projectIcon}
        projectTitle={project.title}
        size={iconSize}
        workspaceRoot={project.workspaceRoot}
      />
    );
  };
}
