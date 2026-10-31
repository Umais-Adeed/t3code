import type { MenuAction } from "@react-native-menu/menu";
import { NativeStackScreenOptions } from "../../native/StackHeader";
import { ThreadListToolbar } from "./ThreadListToolbar";
import { useProjectFilterMenuIcon } from "./useProjectFilterMenuIcon";
import type { HomeHeaderProps } from "./HomeHeader.types";

export type { HomeHeaderEnvironment } from "./HomeHeader.types";

function checkedMenuState(checked: boolean) {
  return checked ? ("on" as const) : undefined;
}

export function HomeHeader(props: HomeHeaderProps) {
  const renderProjectIcon = useProjectFilterMenuIcon(props.projects);
  const hasCustomListOptions =
    props.selectedEnvironmentId !== null || props.selectedProjectKey !== null;
  const menuActions: MenuAction[] = [
    {
      id: "environment",
      title: "Environment",
      image: "desktopcomputer",
      subactions: [
        {
          id: "environment:all",
          title: "All environments",
          image: "square.grid.2x2",
          state: checkedMenuState(props.selectedEnvironmentId === null),
        },
        ...props.environments.map((environment) => ({
          id: `environment:${environment.environmentId}`,
          title: environment.label,
          image: "desktopcomputer",
          state: checkedMenuState(props.selectedEnvironmentId === environment.environmentId),
        })),
      ],
    },
    ...(props.projects.length === 0
      ? []
      : ([
          {
            id: "project",
            title: "Project",
            image: "folder.fill",
            subactions: [
              {
                id: "project:all",
                title: "All projects",
                image: "square.grid.2x2",
                state: checkedMenuState(props.selectedProjectKey === null),
              },
              ...props.projects.map((project) => ({
                id: `project:${project.key}`,
                title: project.label,
                image: project.representative?.isScratch ? "bubble.left" : undefined,
                state: checkedMenuState(props.selectedProjectKey === project.key),
              })),
            ],
          },
        ] satisfies MenuAction[])),
  ];
  const handleMenuAction = (event: { nativeEvent: { event: string } }) => {
    const id = event.nativeEvent.event;
    if (id === "environment:all") {
      props.onEnvironmentChange(null);
      return;
    }

    if (id.startsWith("environment:")) {
      const environmentId = id.slice("environment:".length);
      const environment = props.environments.find(
        (candidate) => candidate.environmentId === environmentId,
      );
      if (environment) {
        props.onEnvironmentChange(environment.environmentId);
      }
      return;
    }

    if (id === "project:all") {
      props.onProjectChange(null);
      return;
    }

    if (id.startsWith("project:")) {
      const projectKey = id.slice("project:".length);
      if (props.projects.some((project) => project.key === projectKey)) {
        props.onProjectChange(projectKey);
      }
      return;
    }
  };

  return (
    <>
      <NativeStackScreenOptions options={{ headerShown: false }} />
      <ThreadListToolbar
        searchQuery={props.searchQuery}
        onSearchQueryChange={props.onSearchQueryChange}
        filterActions={menuActions}
        filterCustomized={hasCustomListOptions}
        onFilterAction={handleMenuAction}
        renderFilterIcon={renderProjectIcon}
        onOpenEnvironments={props.onOpenEnvironments}
      />
    </>
  );
}
